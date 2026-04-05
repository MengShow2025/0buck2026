
import json
from typing import Any, Optional
from sqlalchemy.orm import Session
from app.models.ledger import SystemConfig
from app.core.config import settings

class ConfigService:
    _cache = {}
    _versions = {}

    def __init__(self, db: Session):
        self.db = db

    def get(self, key: str, default: Any = None) -> Any:
        """
        Fetch configuration from DB with hot-reload versioning and local cache.
        """
        # v3.1: Check version to decide if cache needs refresh
        config = self.db.query(SystemConfig).filter_by(key=key).first()
        
        if config:
            cached_version = self._versions.get(key, 0)
            config_version = config.version if config.version is not None else 1
            if config_version > cached_version:
                # Refresh cache
                self._cache[key] = config.value
                self._versions[key] = config_version
            
            return self._cache.get(key, config.value)
        
        # Fallback to settings if available
        if hasattr(settings, key):
            return getattr(settings, key)
            
        return default

    def set(self, key: str, value: Any, description: str = None):
        """
        Update or create a configuration entry and increment version.
        """
        config = self.db.query(SystemConfig).filter_by(key=key).first()
        if not config:
            config = SystemConfig(key=key, value=value, description=description, version=1)
            self.db.add(config)
        else:
            config.value = value
            config.version += 1 # Increment version for hot-reload signal
            if description:
                config.description = description
        self.db.commit()
        
        # Update local cache immediately
        self._cache[key] = value
        self._versions[key] = config.version
        return config

    def get_api_key(self, key_name: str) -> str:
        """
        Helper for fetching API keys. 
        Admin can override these in SystemConfig to avoid env restarts.
        """
        return self.get(key_name, getattr(settings, key_name, ""))
