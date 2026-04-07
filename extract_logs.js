(async () => {
  const rows = Array.from(document.querySelectorAll('tr')).slice(-50);
  const logs = rows.map(row => {
    const cells = Array.from(row.querySelectorAll('cell, td'));
    return cells.map(c => c.innerText).join(' ');
  }).join('\n');
  return logs;
})()