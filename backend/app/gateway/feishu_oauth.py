from urllib.parse import urlencode


def build_feishu_authorize_url(
    client_id: str,
    redirect_uri: str,
    state: str,
    scope: str = "auth:user.id:read",
    prompt: str = "consent",
) -> str:
    query = urlencode({
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": scope,
        "state": state,
        "prompt": prompt,
    })
    return f"https://accounts.feishu.cn/open-apis/authen/v1/authorize?{query}"

