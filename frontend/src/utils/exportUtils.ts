/**
 * Converts an array of objects to a CSV string and triggers a browser download.
 */
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h] ?? '';
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') || str.includes('\n') || str.includes('"') ? `"${str}"` : str;
    }).join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
