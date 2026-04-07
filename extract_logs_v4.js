(() => {
  // Find all tables and see which one has rows
  const allTables = Array.from(document.querySelectorAll('table'));
  const logTable = allTables.find(t => t.innerText.includes('Time') && t.innerText.includes('Data'));
  if (!logTable) return { __result: "No table with 'Time' and 'Data' found" };
  const rows = Array.from(logTable.querySelectorAll('tr')).slice(-50);
  const logLines = rows.map(row => {
    return Array.from(row.cells).map(cell => cell.innerText.trim()).join(' | ');
  });
  return { __result: logLines.join('\n') };
})()