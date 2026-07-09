export default function DatasetTable({ rows }) {
  return (
    <div className="dataset-table-wrap card">
      <table className="dataset-table">
        <thead>
          <tr>
            <th>Years of Experience</th>
            <th>Salary (₹)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.experience}>
              <td className="mono">{row.experience}</td>
              <td className="mono">{Number(row.salary).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .dataset-table-wrap {
          overflow-x: auto;
          padding: 4px;
        }
        .dataset-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .dataset-table th {
          text-align: left;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-400);
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
        }
        .dataset-table td {
          padding: 12px 20px;
          border-bottom: 1px solid var(--border);
          color: var(--ink-700);
        }
        .dataset-table tr:last-child td {
          border-bottom: none;
        }
        .dataset-table tbody tr:hover {
          background: var(--blue-100);
        }
      `}</style>
    </div>
  );
}
