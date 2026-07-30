// Helper utility for generating and downloading CSV files on mobile/desktop devices

export function downloadCSV(filename: string, rows: (string | number | boolean)[][], headers?: string[]) {
  const allRows: string[][] = [];

  if (headers) {
    allRows.push(headers.map(escapeCSVCell));
  }

  for (const row of rows) {
    allRows.push(row.map(val => escapeCSVCell(val)));
  }

  const csvContent = allRows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSVCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  // Double quotes inside string need to be escaped as ""
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return `"${str}"`;
}
