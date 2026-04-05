export const fetchMinimaxChat = async (messages: {role: string, content: string}[], butlerName: string) => {
  // Proxy through backend to protect API keys
  const response = await fetch('/api/v1/butler/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: messages,
      butler_name: butlerName || '0Buck Butler'
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch from MiniMax API via Proxy');
  }

  const data = await response.json();
  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  }
  throw new Error('Invalid response from MiniMax');
};
