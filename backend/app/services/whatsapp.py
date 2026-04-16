from app.core.config import settings
from app.core.http_client import ResilientAsyncClient

async def send_whatsapp_message(to_number: str, text: str):
    """
    Sends a text message using the WhatsApp Cloud API.
    """
    url = f"https://graph.facebook.com/v18.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_API_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "text",
        "text": {"body": text},
    }

    client = ResilientAsyncClient(name="whatsapp", retries=1, timeout_seconds=10.0, connect_timeout_seconds=5.0)
    response = await client.request("POST", url, headers=headers, json=payload)
    return response.json()
