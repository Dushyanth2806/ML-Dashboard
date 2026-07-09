export default function ErrorBanner({ message }) {
  return (
    <div className="error-banner">
      <span className="error-icon" aria-hidden="true">
        !
      </span>
      <p>{message}</p>

      <style>{`
        .error-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 18px;
          border-radius: var(--radius-sm);
          background: #fdf2f1;
          border: 1px solid #f3c6c1;
        }
        .error-icon {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #b42318;
          color: white;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .error-banner p {
          font-size: 14px;
          color: #7a271a;
        }
      `}</style>
    </div>
  );
}
