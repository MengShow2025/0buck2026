(async () => {
  const results = {};

  // 1. GET /api/v1/products/discovery?user_id=1
  try {
    const res1 = await fetch('/api/v1/products/discovery?user_id=1');
    const data1 = await res1.json();
    results.discovery = {
      status: res1.status,
      count: data1.products ? data1.products.length : (Array.isArray(data1) ? data1.length : 'unknown'),
      data: data1
    };
  } catch (err) {
    results.discovery = { error: err.message };
  }

  // 2. POST /api/v1/butler/chat
  try {
    const res2 = await fetch('/api/v1/butler/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Hello", user_id: 1 })
    });
    const data2 = await res2.json();
    results.chat = {
      status: res2.status,
      data: data2
    };
  } catch (err) {
    results.chat = { error: err.message };
  }

  return results;
})()
