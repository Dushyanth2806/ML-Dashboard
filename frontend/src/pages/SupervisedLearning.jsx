import AlgorithmCard from "../components/AlgorithmCard.jsx";
import ComingSoonCard from "../components/ComingSoonCard.jsx";

const DotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 18 10 8 14 13 20 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const COMING_SOON_ALGORITHMS = [
  "Logistic Regression",
  "Decision Trees",
  "Random Forest",
  "Gradient Boosting (XGBoost)",
  "SVM",
  "KNN",
  "Naive Bayes",
  "Neural Networks / MLP",
];

export default function SupervisedLearning() {
  return (
    <div>
      <div className="eyebrow">Supervised Learning</div>
      <h1 className="page-title">Supervised Learning Algorithms</h1>
      <p className="page-subtitle">
        Models trained on labeled examples. Linear Regression is fully interactive below —
        the rest are on the way.
      </p>

      <div className="supervised-featured">
        <AlgorithmCard
          to="/supervised/linear-regression"
          accent="blue"
          icon={<DotIcon />}
          title="Linear Regression"
          description="Predict salary from years of experience with a live model."
        />
      </div>

      <h2 className="section-heading">More algorithms</h2>
      <div className="coming-soon-grid">
        {COMING_SOON_ALGORITHMS.map((name) => (
          <ComingSoonCard key={name} icon={<DotIcon />} title={name} />
        ))}
      </div>

      <style>{`
        .supervised-featured {
          margin: 28px 0 36px;
        }
        .section-heading {
          font-size: 18px;
          margin-bottom: 16px;
          color: var(--ink-700);
        }
        .coming-soon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
      `}</style>
    </div>
  );
}
