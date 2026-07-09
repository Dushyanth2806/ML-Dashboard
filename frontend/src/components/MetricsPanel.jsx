export default function MetricsPanel({ metrics }) {
  if (!metrics) return null;

  const rows = [
    { label: "R² Score", value: metrics.r2_score },
    { label: "MAE", value: metrics.mae },
    { label: "MSE", value: metrics.mse },
    { label: "RMSE", value: metrics.rmse },
  ];

  return (
    <div className="metrics-panel">
      <div className="metrics-grid">
        {rows.map((row) => (
          <div key={row.label} className="metrics-cell card">
            <p className="metrics-cell-label">{row.label}</p>
            <p className="metrics-cell-value mono">{row.value}</p>
          </div>
        ))}
      </div>

      <div className="accuracy-card">
        <p className="accuracy-label">Model Accuracy (R² Score)</p>
        <p className="accuracy-value mono">{metrics.accuracy_percent}%</p>
        <p className="accuracy-caption">
          Higher R² values indicate better prediction performance.
        </p>
      </div>

      <style>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 16px;
        }
        .metrics-cell {
          padding: 16px;
          text-align: center;
        }
        .metrics-cell-label {
          font-size: 12px;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-400);
          margin-bottom: 8px;
        }
        .metrics-cell-value {
          font-size: 20px;
          font-weight: 600;
          color: var(--blue-700);
        }
        .accuracy-card {
          padding: 24px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--blue-600), var(--blue-700));
          color: white;
          box-shadow: var(--shadow-lg);
        }
        .accuracy-label {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 6px;
        }
        .accuracy-value {
          font-size: clamp(28px, 4vw, 34px);
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
        }
        .accuracy-caption {
          font-size: 13px;
          color: rgba(255,255,255,0.85);
        }
        @media (max-width: 640px) {
          .metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
