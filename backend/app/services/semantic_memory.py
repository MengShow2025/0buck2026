from __future__ import annotations

from typing import Any, Dict, List, Optional

from qdrant_client import QdrantClient
from qdrant_client.http import models

from app.core.genai_client import embed_text


class SemanticMemoryService:
    def __init__(self):
        try:
            self.client = QdrantClient(host="localhost", port=6333, timeout=2)
            self.client.get_collections()
        except Exception:
            self.client = QdrantClient(location=":memory:")

        self.collection_name = "user_memory_semantics"
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

    async def upsert(self, *, memory_id: int, user_id: int, content: str, tags: List[str]) -> Optional[List[float]]:
        vec = await embed_text(contents=content, task_type="RETRIEVAL_DOCUMENT", output_dimensionality=self.vector_size)
        if not vec:
            return None

        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=memory_id,
                    vector=vec,
                    payload={
                        "user_id": int(user_id),
                        "content": content,
                        "tags": tags,
                    },
                )
            ],
        )
        return vec

    async def search(self, *, user_id: int, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        vec = await embed_text(contents=query, task_type="RETRIEVAL_QUERY", output_dimensionality=self.vector_size)
        if not vec:
            return []

        res = self.client.query_points(
            collection_name=self.collection_name,
            query=vec,
            limit=limit,
            query_filter=models.Filter(
                must=[
                    models.FieldCondition(
                        key="user_id",
                        match=models.MatchValue(value=int(user_id)),
                    )
                ]
            ),
        ).points
        out = []
        for r in res:
            payload = r.payload or {}
            out.append(
                {
                    "memory_id": r.id,
                    "score": r.score,
                    "content": payload.get("content", ""),
                    "tags": payload.get("tags", []),
                }
            )
        return out


semantic_memory_service = SemanticMemoryService()

