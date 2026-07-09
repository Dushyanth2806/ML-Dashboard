export default function ResultCard({ label, value, prefix = "", decimals = 2 }) {
  const formatted = Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div className="result-card">
      <p className="result-eyebrow">{label}</p>
      <p className="result-value mono">
        {prefix}
        {formatted}
      </p>

      <style>{`
        .result-card {
          padding: 26px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--blue-600), var(--blue-700));
          color: white;
          box-shadow: var(--shadow-lg);
        }
        .result-eyebrow {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }
        .result-value {
          font-size: clamp(28px, 4vw, 36px);
          font-weight: 600;
          color: white;
        }
      `}</style>
    </div>
  );
}
