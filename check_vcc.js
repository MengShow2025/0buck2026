(async function() {
  try {
    const scripts = Array.from(document.querySelectorAll('script'));
    const results = [];
    for (const s of scripts) {
      if (s.src && s.src.includes('index')) {
        const text = await fetch(s.src).then(r => r.text());
        const match = text.match(/\[VCC\] Initializing StreamChat with Key:\s*([^'"]+)/);
        if (match) {
          results.push({ src: s.src, match: match[0], key: match[1] });
        }
      }
    }
    // Also check global console logs if possible
    // Or just look for the key in the entire body text
    const bodyText = document.body.innerText;
    if (bodyText.includes('[VCC]')) {
      results.push({ source: 'body', text: bodyText.substring(bodyText.indexOf('[VCC]'), bodyText.indexOf('[VCC]') + 100) });
    }
    return { __result: results };
  } catch (e) {
    return { __result: { error: e.message } };
  }
})()
