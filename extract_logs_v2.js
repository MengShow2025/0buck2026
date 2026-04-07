(async () => {
  const table = document.querySelector('table');
  if (!table) return "No table found";
  const rows = Array.from(table.querySelectorAll('tr')).slice(-50);
  const logLines = rows.map(row => {
    return Array.from(row.cells).map(cell => cell.innerText).join(' | ');
  });
  return logLines.join('\n');
})()