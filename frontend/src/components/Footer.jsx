export default function Footer() {
  return (
    <footer className="footer">
      <p>
        Built with React &amp; Flask ·{" "}
        <span className="mono">scikit-learn</span> under the hood
      </p>
      <style>{`
        .footer {
          text-align: center;
          padding: 28px 24px 36px;
          border-top: 1px solid var(--border);
        }
        .footer p {
          font-size: 13px;
          color: var(--ink-400);
        }
      `}</style>
    </footer>
  );
}
