import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/supervised", label: "Supervised" },
  { to: "/unsupervised", label: "Unsupervised" },
  { to: "/stock-prediction", label: "Stock Prediction" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="18" r="2.5" fill="#3B7BF0" />
            <circle cx="12" cy="8" r="2.5" fill="#2054D6" />
            <circle cx="19" cy="15" r="2.5" fill="#0EA5C4" />
            <path d="M5 18 12 8 19 15" stroke="#CBD8EA" strokeWidth="1.6" />
          </svg>
        </span>
        <span>
          ML<strong>Dashboard</strong>
        </span>
      </Link>

      <nav className="navbar-links">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`navbar-link ${pathname === link.to ? "is-active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          max-width: 1120px;
          width: 100%;
          margin: 0 auto;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-size: 18px;
          color: var(--ink-900);
        }
        .navbar-mark {
          display: inline-flex;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 6px;
          box-shadow: var(--shadow-sm);
        }
        .navbar-brand strong {
          font-weight: 700;
          color: var(--blue-700);
        }
        .navbar-links {
          display: flex;
          gap: 6px;
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 4px;
          border-radius: 999px;
          box-shadow: var(--shadow-sm);
        }
        .navbar-link {
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-500);
          transition: background 0.18s ease, color 0.18s ease;
        }
        .navbar-link:hover {
          color: var(--blue-700);
        }
        .navbar-link.is-active {
          background: var(--blue-600);
          color: white;
        }
        @media (max-width: 560px) {
          .navbar { padding: 16px; }
          .navbar-links { gap: 2px; }
          .navbar-link { padding: 7px 10px; font-size: 13px; }
        }
      `}</style>
    </header>
  );
}
