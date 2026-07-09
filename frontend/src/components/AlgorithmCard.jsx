import { Link } from "react-router-dom";

/**
 * A clickable card used for the two top-level home cards and for
 * "Linear Regression" (the one fully implemented algorithm).
 */
export default function AlgorithmCard({ to, icon, title, description, accent = "blue" }) {
  return (
    <Link to={to} className={`algo-card card accent-${accent}`}>
      <div className="algo-card-icon">{icon}</div>
      <div className="algo-card-body">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className="algo-card-arrow" aria-hidden="true">
        →
      </span>

      <style>{`
        .algo-card {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 26px;
          cursor: pointer;
          position: relative;
        }
        .algo-card-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .accent-blue .algo-card-icon { background: var(--blue-100); color: var(--blue-600); }
        .accent-sky .algo-card-icon { background: var(--sky-100); color: var(--sky-500); }

        .algo-card-body h3 {
          font-size: 19px;
          margin-bottom: 4px;
        }
        .algo-card-body p {
          font-size: 14px;
        }
        .algo-card-arrow {
          margin-left: auto;
          font-size: 20px;
          color: var(--ink-400);
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .algo-card:hover .algo-card-arrow {
          transform: translateX(4px);
          color: var(--blue-600);
        }
      `}</style>
    </Link>
  );
}
