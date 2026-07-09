export default function Spinner({ label = "Loading…" }) {
  return (
    <div className="spinner-wrap">
      <span className="spinner" aria-hidden="true" />
      <span className="spinner-label">{label}</span>

      <style>{`
        .spinner-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2.5px solid var(--blue-100);
          border-top-color: var(--blue-600);
          animation: spin 0.7s linear infinite;
        }
        .spinner-label {
          font-size: 14px;
          color: var(--ink-500);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
