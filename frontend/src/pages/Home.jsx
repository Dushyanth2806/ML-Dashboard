import AlgorithmCard from "../components/AlgorithmCard.jsx";
import PathsVisual from "../components/PathsVisual.jsx";

export default function Home() {
  return (
    <div className="home-page">
      <div className="eyebrow">Machine Learning Dashboard</div>
      <h1 className="page-title">Machine Learning Algorithms Dashboard</h1>
      <p className="page-subtitle">
        Two families of algorithms, one dashboard. Pick a branch to explore how each one
        turns data into a decision.
      </p>

      <div className="home-visual-wrap card">
        <PathsVisual />
      </div>

      <div className="home-cards">
        <AlgorithmCard
          to="/supervised"
          accent="blue"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M4 18 10 8 14 13 20 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="4" cy="18" r="1.8" fill="currentColor" />
              <circle cx="10" cy="8" r="1.8" fill="currentColor" />
              <circle cx="14" cy="13" r="1.8" fill="currentColor" />
              <circle cx="20" cy="5" r="1.8" fill="currentColor" />
            </svg>
          }
          title="Supervised Learning"
          description="Learn from labeled data — regression and classification models."
        />
        <AlgorithmCard
          to="/unsupervised"
          accent="sky"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="7" cy="7" r="2.4" fill="currentColor" />
              <circle cx="7" cy="12.5" r="2.4" fill="currentColor" opacity="0.7" />
              <circle cx="16" cy="8" r="2.4" fill="currentColor" opacity="0.55" />
              <circle cx="17" cy="16" r="2.4" fill="currentColor" />
              <circle cx="12" cy="18" r="2.4" fill="currentColor" opacity="0.7" />
            </svg>
          }
          title="Unsupervised Learning"
          description="Find structure in unlabeled data — clustering and dimensionality reduction."
        />
      </div>

      <style>{`
        .home-visual-wrap {
          margin: 32px 0 28px;
          padding: 22px 26px 14px;
        }
        .home-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }
        @media (max-width: 640px) {
          .home-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
