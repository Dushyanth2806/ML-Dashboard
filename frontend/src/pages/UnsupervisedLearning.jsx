import ComingSoonCard from "../components/ComingSoonCard.jsx";

const ClusterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="7" cy="8" r="2.2" fill="currentColor" />
    <circle cx="7" cy="14" r="2.2" fill="currentColor" opacity="0.7" />
    <circle cx="16" cy="10" r="2.2" fill="currentColor" opacity="0.55" />
    <circle cx="17" cy="17" r="2.2" fill="currentColor" />
  </svg>
);

const ALGORITHMS = ["K-Means", "Hierarchical Clustering", "PCA", "DBSCAN", "Autoencoders"];

export default function UnsupervisedLearning() {
  return (
    <div>
      <div className="eyebrow">Unsupervised Learning</div>
      <h1 className="page-title">Unsupervised Learning Algorithms</h1>
      <p className="page-subtitle">
        Models that discover structure in unlabeled data. These are on the way — check back soon.
      </p>

      <div className="coming-soon-grid">
        {ALGORITHMS.map((name) => (
          <ComingSoonCard key={name} icon={<ClusterIcon />} title={name} />
        ))}
      </div>

      <style>{`
        .coming-soon-grid {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
      `}</style>
    </div>
  );
}
