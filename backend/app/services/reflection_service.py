import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func
import google.generativeai as genai
import json
from datetime import datetime

from app.core.config import settings
from app.models.butler import UserMemoryFact, UserButlerProfile, AIUsageStats
from app.db.session import SessionLocal

logger = logging.getLogger(__name__)

class ReflectionService:
    """
    v3.2 Evolution & Memory Reflection Service.
    Analyzes conversation history to extract structured facts and tune personas.
    Uses Gemini-1.5-Flash for cost efficiency.
    """
    
    def __init__(self):
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel('models/gemini-1.5-flash')

    async def extract_facts(self, history: List[Dict[str, str]], user_id: int, db: Session):
        """
        v3.2 Laser Slicing: Extracts speaker-centric facts from a conversation.
        Serialized: Uses with_for_update() on ButlerProfile to prevent race conditions.
        """
        # 1. Acquire row lock for this user to prevent concurrent memory corruption
        try:
            profile = db.query(UserButlerProfile).filter(UserButlerProfile.user_id == user_id).with_for_update().first()
            if not profile:
                profile = UserButlerProfile(user_id=user_id)
                db.add(profile)
                db.commit()
                profile = db.query(UserButlerProfile).filter(UserButlerProfile.user_id == user_id).with_for_update().first()
        except IntegrityError:
            db.rollback()
            profile = db.query(UserButlerProfile).filter(UserButlerProfile.user_id == user_id).with_for_update().first()

        # 2. Format history for the AI
        formatted_history = ""
        for msg in history:
            role = "User" if msg["role"] == "user" else "Butler"
            formatted_history += f"[{role}]: {msg['content']}\n"

        prompt = (
            "You are the 0Buck Reflection Engine. Your task is to extract NEW factual insights and user pain points from the conversation.\n\n"
            "OUTPUT FORMAT: A JSON object with two keys:\n"
            "1. 'new_facts': List of objects: [{'key': 'string', 'value': 'any', 'confidence': 0.0-1.0, 'is_conflict': bool}]\n"
            "   Focus on: personal preferences, constraints, locations.\n"
            "2. 'unmet_needs': List of objects: [{'category': 'string', 'need': 'string', 'urgency': 1-5, 'is_pain_point': bool, 'sentiment': -1.0 to 1.0}]\n"
            "   Focus on: things the user wants but doesn't find, OR COMPLAINTS about current product quality/design/usability.\n\n"
            f"Conversation History:\n{formatted_history}\n\n"
            "Output JSON only:"
        )

        try:
            response = await self.model.generate_content_async(prompt)
            # v3.2: Directly parse Gemini's structured JSON output
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
                
            data = json.loads(text)
            
            # 2. Persist Facts to Database (LTM)
            extracted_facts = data.get("new_facts", [])
            for item in extracted_facts:
                key = item.get("key")
                value = item.get("value")
                conf = item.get("confidence", 0.8)
                
                if not key or not value: continue
                
                # Check for existing facts to handle decay/conflict
                existing = db.query(UserMemoryFact).filter(
                    UserMemoryFact.user_id == user_id,
                    UserMemoryFact.key == key,
                    UserMemoryFact.is_archived == False
                ).first()
                
                if existing:
                    if item.get("is_conflict"):
                        # Archive old, add new
                        existing.is_archived = True
                        db.add(UserMemoryFact(
                            user_id=user_id,
                            key=key,
                            value=value,
                            confidence=conf
                        ))
                    else:
                        # Update existing with higher confidence or new value
                        existing.value = value
                        existing.confidence = max(existing.confidence, conf)
                        existing.last_verified_at = func.now()
                else:
                    db.add(UserMemoryFact(
                        user_id=user_id,
                        key=key,
                        value=value,
                        confidence=conf
                    ))
            
            # 3. v3.3 C2M: Persist Unmet Needs to Database
            unmet_needs = data.get("unmet_needs", [])
            for need in unmet_needs:
                category = need.get("category", "General")
                need_text = need.get("need")
                is_pain = need.get("is_pain_point", False)
                sentiment = need.get("sentiment", 0.0)
                
                if need_text:
                    # Save as a specialized fact for C2MService to cluster
                    key = "pain_point" if is_pain else "missing_feature"
                    db.add(UserMemoryFact(
                        user_id=user_id,
                        key=key,
                        value=f"[{category}] {need_text} (Sentiment: {sentiment})",
                        confidence=0.9,
                        is_archived=False
                    ))
                    logger.info(f"  [C2M] {key.capitalize()} detected for user {user_id}: {need_text}")
            
            # 3. Log Reflection Token Usage
            usage = response.usage_metadata
            usage_stat = AIUsageStats(
                user_id=user_id,
                task_type="reflection",
                model_name="gemini-1.5-flash",
                tokens_in=usage.prompt_token_count,
                tokens_out=usage.candidates_token_count,
                cost_usd=(usage.prompt_token_count * 0.000000075) + (usage.candidates_token_count * 0.0000003),
                session_id="reflection_task"
            )
            db.add(usage_stat)
            db.commit()
            
        except Exception as e:
            logger.error(f"Reflection Error for User {user_id}: {str(e)}")
            db.rollback()

    async def tune_persona(self, history: List[Dict[str, str]], user_id: int, db: Session):
        """
        v3.2 Automatically tunes the L3 Persona Sliders based on user tone.
        """
        # Logic to analyze user sentiment/formality and update UserButlerProfile.custom_vectors
        pass

async def run_butler_learning(history: List[Dict[str, str]], user_id: int, db: Session):
    """Entry point for async reflection task"""
    service = ReflectionService()
    await service.extract_facts(history, user_id, db)
