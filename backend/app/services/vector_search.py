import os
import hashlib
import random
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models
from app.core.config import settings

class VectorSearchService:
    def __init__(self):
        try:
            # 优先尝试连接本地 Qdrant 容器，失败则回退到内存模式
            self.client = QdrantClient(host="localhost", port=6333, timeout=2) 
            self.client.get_collections() # 测试连接
            self.mode = "server"
        except Exception:
            print("⚠️ Qdrant 容器未运行，正在切换到内存模式 (:memory:)。生产环境建议使用 Docker 部署 Qdrant。")
            self.client = QdrantClient(location=":memory:")
            self.mode = "memory"
            
        self.collection_name = "products_1688"
        self._ensure_collection()

    def _ensure_collection(self):
        """确保 Qdrant 集合存在"""
        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            if not exists:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=768, # SigLIP 常见维度
                        distance=models.Distance.COSINE
                    )
                )
        except Exception as e:
            print(f"Qdrant collection error: {e}")

    def upsert_product(self, product_id: str, vector: List[float], payload: Dict[str, Any]):
        """将商品向量和元数据写入 Qdrant"""
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=product_id,
                    vector=vector,
                    payload=payload
                )
            ]
        )

    def search(self, vector: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        """执行向量搜索"""
        results = self.client.query_points(
            collection_name=self.collection_name,
            query=vector,
            limit=limit
        ).points
        return [r.payload for r in results]

    async def get_embedding(self, text: Optional[str] = None, image_url: Optional[str] = None) -> List[float]:
        content = text or image_url
        if not content:
            raise ValueError("text or image_url required")

        from app.core.genai_client import embed_text

        vec = await embed_text(
            contents=content,
            task_type="RETRIEVAL_QUERY",
            output_dimensionality=768,
        )
        if vec and len(vec) == 768:
            return vec
        
        raise RuntimeError(f"Failed to generate valid 768-dimensional embedding for content: {content[:50]}...")

vector_search_service = VectorSearchService()
