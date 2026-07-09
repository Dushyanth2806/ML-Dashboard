import { useState } from "react";
import { Link } from "react-router-dom";
import CsvUploader from "../components/CsvUploader.jsx";
import GenericDataTable from "../components/GenericDataTable.jsx";
import DynamicPredictionForm from "../components/DynamicPredictionForm.jsx";
import ResultCard from "../components/ResultCard.jsx";
import MetricsPanel from "../components/MetricsPanel.jsx";
import GraphViewer from "../components/GraphViewer.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { uploadStockCsv, predictStock, getStockGraphUrl } from "../api.js";

export default function StockPrediction() {
  const [columns, setColumns] = useState(null); // { feature_columns, target_column }
  const [preview, setPreview] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [graphSrc, setGraphSrc] = useState(null);
  const [graphError, setGraphError] = useState(false);

  const [prediction, setPrediction] = useState(null);
  const [predictError, setPredictError] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);

  const handleUpload = async (file) => {
    const res = await uploadStockCsv(file); // throws on failure — CsvUploader shows the error
    setColumns({
      feature_columns: res.data.feature_columns,
      target_column: res.data.target_column,
    });
    setPreview(res.data.preview);
    setMetrics(res.data.metrics);
    setPrediction(null);
    setPredictError("");
    setGraphError(false);
    setGraphSrc(getStockGraphUrl());
    return res.data.message;
  };

  const handlePredict = async (values) => {
    setIsPredicting(true);
    setPredictError("");
    setPrediction(null);
    try {
      const res = await predictStock(values);
      setPrediction(res.data.prediction);
    } catch (err) {
      setPredictError(
        err?.response?.data?.error ||
          "Couldn't reach the prediction service. Make sure the backend is running and try again."
      );
    } finally {
      setIsPredicting(false);
    }
  };

  const previewColumns = preview && preview.length > 0 ? Object.keys(preview[0]) : [];

  return (
    <div>
      <Link to="/supervised" className="back-link">
        ← Supervised Learning
      </Link>
      <div className="eyebrow">Linear Regression · Stock Prediction</div>
      <h1 className="page-title">Stock Price Prediction</h1>
      <p className="page-subtitle">
        Upload historical stock data and train a Linear Regression model to predict a closing
        price from the day's other numbers.
      </p>

      {/* ---- Upload ---- */}
      <section className="stock-section">
        <h2>Upload Historical Stock Data</h2>
        <p className="stock-copy">
          Expected columns: a date column (ignored for training) plus numeric columns such as
          Open, High, Low, Close, and Volume. The last numeric column — or a column literally
          named "Close" — is used as the prediction target automatically.
        </p>
        <CsvUploader
          onUpload={handleUpload}
          exampleHint="Expected format: Date,Open,High,Low,Close,Volume"
        />
      </section>

      {preview && (
        <>
          {/* ---- Preview ---- */}
          <section className="stock-section">
            <h2>Uploaded Data Preview</h2>
            <GenericDataTable columns={previewColumns} rows={preview} />
          </section>

          {/* ---- Predict ---- */}
          <section className="stock-section">
            <h2>Predict {columns.target_column}</h2>
            <p className="stock-copy">
              Enter values for {columns.feature_columns.join(", ")} to predict the{" "}
              {columns.target_column.toLowerCase()}.
            </p>
            <div className="stock-predict-grid">
              <DynamicPredictionForm
                fields={columns.feature_columns}
                onSubmit={handlePredict}
                isLoading={isPredicting}
                submitLabel={`Predict ${columns.target_column}`}
              />
              <div className="stock-result-slot">
                {predictError && <ErrorBanner message={predictError} />}
                {prediction !== null && !predictError && (
                  <ResultCard
                    label={`Predicted ${columns.target_column}`}
                    value={prediction}
                    prefix="$"
                  />
                )}
                {prediction === null && !predictError && (
                  <div className="stock-result-placeholder card">
                    <p>Your predicted {columns.target_column.toLowerCase()} will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ---- Metrics / Accuracy ---- */}
          <section className="stock-section">
            <h2>Model Evaluation</h2>
            <p className="stock-copy">Prediction Accuracy, shown using the R² Score.</p>
            <MetricsPanel metrics={metrics} />
          </section>

          {/* ---- Graphs ---- */}
          <section className="stock-section">
            <h2>Actual vs. Predicted</h2>
            <p className="stock-copy">
              Left: actual vs. predicted closing price on held-out test data (closer to the
              dashed line is better). Right: the same comparison as a sequential line chart.
            </p>
            {graphSrc && (
              <GraphViewer key={graphSrc} src={graphSrc} onError={() => setGraphError(true)} />
            )}
            {graphError && (
              <div style={{ marginTop: 12 }}>
                <ErrorBanner message="Couldn't load the graph from the backend." />
              </div>
            )}
          </section>
        </>
      )}

      <style>{`
        .back-link {
          display: inline-block;
          font-size: 13px;
          color: var(--ink-500);
          margin-bottom: 18px;
        }
        .back-link:hover {
          color: var(--blue-600);
        }
        .stock-section {
          margin-top: 40px;
        }
        .stock-section h2 {
          font-size: 20px;
          margin-bottom: 10px;
        }
        .stock-copy {
          margin-bottom: 16px;
          max-width: 680px;
        }
        .stock-predict-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 20px;
          align-items: stretch;
        }
        .stock-result-slot {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .stock-result-placeholder {
          padding: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }
        .stock-result-placeholder p {
          font-size: 14px;
        }
        @media (max-width: 720px) {
          .stock-predict-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
