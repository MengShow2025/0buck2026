def normalize_database_url_for_runtime(raw_url: str) -> str:
    url = str(raw_url or "").strip()
    if not url:
        return url
    # Neon URLs with channel_binding=require are more reliable with psycopg v3.
    if url.startswith("postgresql://") and "channel_binding=require" in url:
        return "postgresql+psycopg://" + url[len("postgresql://") :]
    return url
