// Signature visual: the two halves literally show what separates the two
// branches of ML. Left — points already carry a label (color), and the job
// is to fit a line through them. Right — points carry no label at all, and
// the job is to discover the groups (color) that the algorithm assigns.
export default function PathsVisual() {
  return (
    <svg
      className="paths-visual"
      viewBox="0 0 640 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Diagram contrasting supervised learning, which fits a line to labeled points, with unsupervised learning, which discovers clusters in unlabeled points"
    >
      {/* divider */}
      <line x1="320" y1="10" x2="320" y2="190" stroke="#E2E9F3" strokeWidth="1.5" strokeDasharray="4 6" />

      {/* ---- LEFT: supervised — labeled points fit to a line ---- */}
      <line x1="30" y1="150" x2="290" y2="45" stroke="#DC2626" strokeWidth="2" opacity="0.8" />
      {[
        [40, 145, "#2054D6"],
        [80, 128, "#2054D6"],
        [120, 118, "#0EA5C4"],
        [160, 95, "#2054D6"],
        [200, 80, "#0EA5C4"],
        [240, 65, "#2054D6"],
        [275, 50, "#0EA5C4"],
      ].map(([cx, cy, fill], i) => (
        <circle key={`sup-${i}`} cx={cx} cy={cy} r="6" fill={fill} stroke="white" strokeWidth="1.5" />
      ))}
      <text x="30" y="185" className="paths-label" fill="#5B6C8A">
        Supervised — labels known, fit the line
      </text>

      {/* ---- RIGHT: unsupervised — unlabeled points, discovered clusters ---- */}
      {[
        [370, 60, "#2054D6"],
        [390, 45, "#2054D6"],
        [405, 70, "#2054D6"],
        [380, 80, "#2054D6"],
      ].map(([cx, cy, fill], i) => (
        <circle key={`cl1-${i}`} cx={cx} cy={cy} r="6" fill={fill} stroke="white" strokeWidth="1.5" />
      ))}
      {[
        [500, 130, "#0EA5C4"],
        [520, 150, "#0EA5C4"],
        [535, 120, "#0EA5C4"],
        [510, 165, "#0EA5C4"],
      ].map(([cx, cy, fill], i) => (
        <circle key={`cl2-${i}`} cx={cx} cy={cy} r="6" fill={fill} stroke="white" strokeWidth="1.5" />
      ))}
      {[
        [590, 60, "#D98B1F"],
        [605, 40, "#D98B1F"],
        [615, 75, "#D98B1F"],
      ].map(([cx, cy, fill], i) => (
        <circle key={`cl3-${i}`} cx={cx} cy={cy} r="6" fill={fill} stroke="white" strokeWidth="1.5" />
      ))}
      <ellipse cx="390" cy="64" rx="38" ry="30" stroke="#2054D6" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.5" />
      <ellipse cx="516" cy="145" rx="35" ry="32" stroke="#0EA5C4" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.5" />
      <ellipse cx="603" cy="58" rx="30" ry="28" stroke="#D98B1F" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.5" />
      <text x="360" y="185" className="paths-label" fill="#5B6C8A">
        Unsupervised — no labels, discover the groups
      </text>

      <style>{`
        .paths-label {
          font-family: var(--font-mono);
          font-size: 11px;
        }
      `}</style>
    </svg>
  );
}
