import { useState } from "react";
import Spinner from "./Spinner.jsx";

export default function GraphViewer({ src, onError }) {
  const [status, setStatus] = useState("loading"); // loading | ready | error

  return (
    <div className="graph-viewer card">
      {status !== "ready" && (
        <div className="graph-placeholder">
          {status === "loading" && <Spinner label="Rendering graph…" />}
          {status === "error" && (
            <p className="graph-error">Couldn't load the regression graph from the backend.</p>
          )}
        </div>
      )}
      <img
        src={src}
        alt="Scatter plot of years of experience vs. salary with the fitted regression line"
        className={`graph-image ${status === "ready" ? "is-visible" : ""}`}
        onLoad={() => setStatus("ready")}
        onError={() => {
          setStatus("error");
          onError?.();
        }}
      />

      <style>{`
        .graph-viewer {
          padding: 18px;
          position: relative;
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .graph-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .graph-error {
          font-size: 14px;
          color: #b42318;
          text-align: center;
          padding: 0 24px;
        }
        .graph-image {
          width: 100%;
          border-radius: 12px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .graph-image.is-visible {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
