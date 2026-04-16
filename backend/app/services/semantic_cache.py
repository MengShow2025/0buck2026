from __future__ import annotations

import uuid
import time
from typing import Any, Dict, List, Optional

from qdrant_client import QdrantClient
from qdrant_client.http import models

from app.core.genai_client import embed_text

class SemanticCacheService:
    def __init__(self):
        try:
            self.client = QdrantClient(host="localhost", port=6333, timeout=2)
            self.client.get_collections()
        except Exception:
            self.client = QdrantClient(location=":memory:")

        self.collection_name = "semantic_cache"
        self.vector_size = 768
        self._ensure_collection()

    def _ensure_collection(self) -> None:
        collections = self.client.get_collections().collections
        exists = any(c.name == self.collection_name for c in collections)
        if not exists:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=self.vector_size,
                    distance=models.Distance.COSINE,
                ),
            )

    async def get_cache(self, query: str, threshold: float = 0.95, max_age_seconds: int = 600) -> Optional[Dict[str, Any]]:
        """
        Check if the query exists in the semantic cache.
        Returns the cached response if similarity > threshold and it's not expired.
        """
        vec = await embed_text(contents=query, task_type="RETRIEVAL_QUERY", output_dimensionality=self.vector_size)
        if not vec:
            return None

        # Search for similar queries
        res = self.client.query_points(
            collection_name=self.collection_name,
            query=vec,
            limit=1
        ).points
        
        if not res:
            return None
            
        best_match = res[0]
        
        # Check similarity threshold
        if best_match.score < threshold:
            return None
            
        payload = best_match.payload or {}
        timestamp = payload.get("timestamp", 0)
        
        # Check expiration
        if time.time() - timestamp > max_age_seconds:
            return None
            
        return {
            "response": payload.get("response"),
            "score": best_match.score
        }

    async def set_cache(self, query: str, response: str) -> None:
        """
        Store a query and its response in the semantic cache.
        """
        vec = await embed_text(contents=query, task_type="RETRIEVAL_DOCUMENT", output_dimensionality=self.vector_size)
        if not vec:
            return

        point_id = str(uuid.uuid4())
        
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=point_id,
                    vector=vec,
                    payload={
                        "query": query,
                        "response": response,
                        "timestamp": time.time()
                    },
                )
            ],
        )

semantic_cache_service = SemanticCacheService()
