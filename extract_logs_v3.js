(() => {
  const table = document.querySelector('table');
  if (!table) return { __result: "No table found" };
  const rows = Array.from(table.querySelectorAll('tr')).slice(-50);
  const logLines = rows.map(row => {
    return Array.from(row.cells).map(cell => cell.innerText.trim()).join(' | ');
  });
  return { __result: logLines.join('\n') };
})()