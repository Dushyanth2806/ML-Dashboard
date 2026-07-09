export default function ComingSoonCard({ icon, title }) {
  return (
    <button type="button" className="soon-card card" disabled>
      <div className="soon-card-icon">{icon}</div>
      <h4>{title}</h4>
      <span className="soon-badge">Coming Soon</span>

      <style>{`
        .soon-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          padding: 22px;
          background: var(--surface);
          text-align: left;
          width: 100%;
          cursor: default;
        }
        .soon-card:hover {
          transform: none;
          box-shadow: var(--shadow-sm);
          border-color: var(--border);
        }
        .soon-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #eef1f6;
          color: var(--ink-400);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .soon-card h4 {
          font-size: 16px;
          color: var(--ink-700);
        }
        .soon-badge {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--amber-500);
          background: var(--amber-100);
          border: 1px solid rgba(217, 139, 31, 0.25);
          padding: 4px 10px;
          border-radius: 999px;
        }
      `}</style>
    </button>
  );
}
