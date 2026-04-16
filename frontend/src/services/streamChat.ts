import { StreamChat } from 'stream-chat';

let cachedClient: StreamChat | null = null;
let connectedUserId: string | null = null;

export async function getStreamChatClient(userId: string, userName: string) {
  const apiKey = import.meta.env.VITE_STREAM_API_KEY as string | undefined;
  if (!apiKey) return null;

  if (!cachedClient) {
    cachedClient = StreamChat.getInstance(apiKey);
  }

  if (connectedUserId !== userId) {
    if (connectedUserId) {
      await cachedClient.disconnectUser();
      connectedUserId = null;
    }
    const explicitToken = import.meta.env.VITE_STREAM_USER_TOKEN as string | undefined;
    const token = explicitToken || cachedClient.devToken(userId);
    await cachedClient.connectUser({ id: userId, name: userName }, token);
    connectedUserId = userId;
  }

  return cachedClient;
}

export function normalizeChannelId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64) || 'default';
}

