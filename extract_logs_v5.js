(() => {
  const table = document.querySelector('[role="table"]');
  if (!table) return { __result: "No [role='table'] found" };
  const rows = Array.from(table.querySelectorAll('[role="row"]')).slice(-50);
  const logLines = rows.map(row => {
    return Array.from(row.querySelectorAll('[role="cell"], [role="columnheader"]')).map(cell => cell.innerText.trim()).join(' | ');
  });
  return { __result: logLines.join('\n') };
})()