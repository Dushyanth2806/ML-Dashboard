export default function PredictionCard({ salary, experience }) {
  const formatted = Number(salary).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="prediction-card">
      <p className="prediction-eyebrow">
        Predicted salary at {experience} {Number(experience) === 1 ? "year" : "years"} of experience
      </p>
      <p className="prediction-value mono">₹{formatted}</p>

      <style>{`
        .prediction-card {
          padding: 26px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--blue-600), var(--blue-700));
          color: white;
          box-shadow: var(--shadow-lg);
        }
        .prediction-eyebrow {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }
        .prediction-value {
          font-size: clamp(28px, 4vw, 36px);
          font-weight: 600;
          color: white;
        }
      `}</style>
    </div>
  );
}
