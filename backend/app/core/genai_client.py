from __future__ import annotations

import asyncio
from functools import lru_cache
from typing import Optional

from google import genai
from google.genai import types

from app.core.config import settings


def _api_key() -> Optional[str]:
    import os
    from dotenv import load_dotenv
    load_dotenv(override=True)
    gemini_key = os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY
    google_key = os.getenv("GOOGLE_API_KEY") or settings.GOOGLE_API_KEY
    if gemini_key:
        # Enforce single-key mode to avoid SDK ambiguity when both are present.
        os.environ["GEMINI_API_KEY"] = gemini_key
        os.environ.pop("GOOGLE_API_KEY", None)
        return gemini_key
    return google_key


def _client() -> genai.Client:
    api_key = _api_key()
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY/GOOGLE_API_KEY not configured")
    return genai.Client(api_key=api_key)


async def generate_text(
    *,
    model: str,
    contents: str,
    system_instruction: Optional[str] = None,
    temperature: Optional[float] = None,
    response_mime_type: Optional[str] = None,
) -> types.GenerateContentResponse:
    config = None
    if system_instruction is not None or temperature is not None or response_mime_type is not None:
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=temperature,
            response_mime_type=response_mime_type,
        )

    try:
        return await _client().aio.models.generate_content(
            model=model,
            contents=contents,
            config=config,
        )
    except AssertionError:
        # google-genai aio client may fail with aiohttp connector assertion in some envs.
        def _sync_call():
            return _client().models.generate_content(
                model=model,
                contents=contents,
                config=config,
            )
        return await asyncio.to_thread(_sync_call)


async def embed_text(
    *,
    contents: str,
    task_type: str,
    output_dimensionality: int,
    model: str = "gemini-embedding-001",
) -> Optional[list[float]]:
    api_key = _api_key()
    if not api_key:
        return None

    config = None
    if hasattr(types, "EmbedContentConfig"):
        config = types.EmbedContentConfig(
            task_type=task_type,
            output_dimensionality=output_dimensionality,
        )

    try:
        if config is not None:
            resp = await _client().aio.models.embed_content(
                model=model,
                contents=contents,
                config=config,
            )
        else:
            resp = await _client().aio.models.embed_content(
                model=model,
                contents=contents,
                task_type=task_type,
                output_dimensionality=output_dimensionality,
            )
    except Exception as e:
        print(f"Error in embed_text: {e}")
        return None

    embeddings = getattr(resp, "embeddings", None)
    if not embeddings:
        return None

    e0 = embeddings[0]
    values = getattr(e0, "values", None) or getattr(e0, "embedding", None) or e0
    if isinstance(values, dict) and "values" in values:
        values = values["values"]
    if isinstance(values, list):
        return [float(x) for x in values]
    return None
