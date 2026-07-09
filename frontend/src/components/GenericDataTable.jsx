export default function GenericDataTable({ columns, rows }) {
  return (
    <div className="generic-table-wrap card">
      <table className="generic-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col} className="mono">
                  {typeof row[col] === "number" ? row[col].toLocaleString("en-IN") : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .generic-table-wrap {
          overflow-x: auto;
          padding: 4px;
        }
        .generic-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          min-width: 420px;
        }
        .generic-table th {
          text-align: left;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-400);
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }
        .generic-table td {
          padding: 12px 20px;
          border-bottom: 1px solid var(--border);
          color: var(--ink-700);
          white-space: nowrap;
        }
        .generic-table tr:last-child td {
          border-bottom: none;
        }
        .generic-table tbody tr:hover {
          background: var(--blue-100);
        }
      `}</style>
    </div>
  );
}
