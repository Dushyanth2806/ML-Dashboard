import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatasetTable from "../components/DatasetTable.jsx";
import GenericDataTable from "../components/GenericDataTable.jsx";
import ResultCard from "../components/ResultCard.jsx";
import PredictionForm from "../components/PredictionForm.jsx";
import PredictionCard from "../components/PredictionCard.jsx";
import GraphViewer from "../components/GraphViewer.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import Spinner from "../components/Spinner.jsx";
import CsvUploader from "../components/CsvUploader.jsx";
import MetricsPanel from "../components/MetricsPanel.jsx";
import DynamicPredictionForm from "../components/DynamicPredictionForm.jsx";
import {
  getSampleData,
  predictSalary,
  getGraphUrl,
  uploadSalaryCsv,
  predictSalaryCustom,
  getSalaryGraphUrl,
} from "../api.js";

export default function LinearRegression() {
  const [dataset, setDataset] = useState([]);
  const [datasetStatus, setDatasetStatus] = useState("loading"); // loading | waking | ready | error
  const [datasetErrorMsg, setDatasetErrorMsg] = useState("");
  const [prediction, setPrediction] = useState(null); // { salary, experience }
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictError, setPredictError] = useState("");
  const [graphSrc, setGraphSrc] = useState(getGraphUrl());
  const [graphError, setGraphError] = useState(false);

  // ---- Custom uploaded dataset state (Feature 1) ----
  const [customColumns, setCustomColumns] = useState(null); // { feature_column, target_column }
  const [customPreview, setCustomPreview] = useState(null);
  const [customMetrics, setCustomMetrics] = useState(null);
  const [customPrediction, setCustomPrediction] = useState(null);
  const [customPredictError, setCustomPredictError] = useState("");
  const [isCustomPredicting, setIsCustomPredicting] = useState(false);
  const [customGraphSrc, setCustomGraphSrc] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Free-tier backends spin down after inactivity — if the first response
    // hasn't arrived within a few seconds, tell the user why, instead of
    // letting it look broken for up to a minute.
    const wakeTimer = setTimeout(() => {
      if (isMounted) setDatasetStatus("waking");
    }, 4000);

    getSampleData()
      .then((res) => {
        if (!isMounted) return;
        setDataset(res.data.data);
        setDatasetStatus("ready");
      })
      .catch((err) => {
        if (!isMounted) return;
        setDatasetErrorMsg(
          err.code === "ECONNABORTED"
            ? "The backend took too long to respond. Free-tier instances can take up to a minute to wake up — please refresh in a moment."
            : "Couldn't load the sample dataset. Check that the backend is running."
        );
        setDatasetStatus("error");
      })
      .finally(() => clearTimeout(wakeTimer));

    return () => {
      isMounted = false;
      clearTimeout(wakeTimer);
    };
  }, []);

  const handlePredict = async (experience) => {
    setIsPredicting(true);
    setPredictError("");
    setPrediction(null);
    try {
      const res = await predictSalary(experience);
      setPrediction({ salary: res.data.salary, experience });
    } catch (err) {
      setPredictError(
        "Couldn't reach the prediction service. Make sure the backend is running and try again."
      );
    } finally {
      setIsPredicting(false);
    }
  };

  const handleCustomUpload = async (file) => {
    const res = await uploadSalaryCsv(file); // throws on failure — CsvUploader handles the error UI
    setCustomColumns({
      feature_column: res.data.feature_column,
      target_column: res.data.target_column,
    });
    setCustomPreview(res.data.preview);
    setCustomMetrics(res.data.metrics);
    setCustomPrediction(null);
    setCustomPredictError("");
    setCustomGraphSrc(getSalaryGraphUrl());
    return res.data.message;
  };

  const handleCustomPredict = async (values) => {
    setIsCustomPredicting(true);
    setCustomPredictError("");
    setCustomPrediction(null);
    try {
      const value = values[customColumns.feature_column];
      const res = await predictSalaryCustom(value);
      setCustomPrediction({ value: res.data.prediction, input: value });
    } catch (err) {
      setCustomPredictError(
        err?.response?.data?.error ||
          "Couldn't reach the prediction service. Make sure the backend is running and try again."
      );
    } finally {
      setIsCustomPredicting(false);
    }
  };

  return (
    <div>
      <Link to="/supervised" className="back-link">
        ← Supervised Learning
      </Link>
      <div className="eyebrow">Linear Regression</div>
      <h1 className="page-title">Linear Regression</h1>
      <p className="page-subtitle">
        A supervised algorithm that fits a straight line through data to predict a continuous
        value.
      </p>

      {/* ---- 1. Introduction ---- */}
      <section className="lr-section">
        <h2>What is it, and when is it used?</h2>
        <p className="lr-copy">
          Linear Regression models the relationship between an input variable and a continuous
          output by fitting the straight line that best matches the observed data. It's a good
          fit whenever the output is expected to change roughly proportionally with the input —
          forecasting sales from ad spend, estimating salary from experience, or predicting
          house prices from square footage.
        </p>
        <div className="lr-formula card mono">y = mx + c</div>
        <p className="lr-formula-caption">
          <span className="mono">m</span> is the slope, <span className="mono">c</span> is the
          intercept — both learned from the training data.
        </p>
      </section>

      {/* ---- 2. Sample Dataset ---- */}
      <section className="lr-section">
        <h2>Sample Dataset</h2>
        <p className="lr-copy">Years of experience mapped to salary — the data the model was trained on.</p>
        {datasetStatus === "loading" && <Spinner label="Loading dataset…" />}
        {datasetStatus === "waking" && (
          <Spinner label="Waking up the backend — free tier can take up to a minute…" />
        )}
        {datasetStatus === "error" && <ErrorBanner message={datasetErrorMsg} />}
        {datasetStatus === "ready" && <DatasetTable rows={dataset} />}
      </section>

      {/* ---- 3 & 4. Input Form + Prediction Result ---- */}
      <section className="lr-section">
        <h2>Try it yourself</h2>
        <p className="lr-copy">Enter years of experience to get a predicted salary from the trained model.</p>
        <div className="lr-predict-grid">
          <PredictionForm onSubmit={handlePredict} isLoading={isPredicting} />
          <div className="lr-result-slot">
            {predictError && <ErrorBanner message={predictError} />}
            {prediction && !predictError && (
              <PredictionCard salary={prediction.salary} experience={prediction.experience} />
            )}
            {!prediction && !predictError && (
              <div className="lr-result-placeholder card">
                <p>Your predicted salary will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---- 5. Graph ---- */}
      <section className="lr-section">
        <h2>Regression Graph</h2>
        <p className="lr-copy">
          Blue points are the training data; the red line is the model's fit.
        </p>
        <GraphViewer key={graphSrc} src={graphSrc} onError={() => setGraphError(true)} />
        {graphError && (
          <div style={{ marginTop: 12 }}>
            <ErrorBanner message="Couldn't load the regression graph from the backend." />
          </div>
        )}
      </section>

      {/* ---- NEW: Upload your own dataset ---- */}
      <section className="lr-section lr-upload-section">
        <div className="eyebrow">Bring your own data</div>
        <h2 style={{ marginTop: 10 }}>Upload Your Own Dataset</h2>
        <p className="lr-copy">
          Upload a two-column CSV — one input feature and one numeric target — to train a fresh
          Linear Regression model on your own data instead of the built-in sample.
        </p>

        <CsvUploader
          onUpload={handleCustomUpload}
          exampleHint="Expected format: Experience,Salary (header row + numeric columns)"
        />

        {customPreview && (
          <>
            <h3 className="lr-subheading">Uploaded Dataset Preview</h3>
            <GenericDataTable
              columns={[customColumns.feature_column, customColumns.target_column]}
              rows={customPreview}
            />

            <h3 className="lr-subheading">Try a Prediction</h3>
            <div className="lr-predict-grid">
              <DynamicPredictionForm
                fields={[customColumns.feature_column]}
                onSubmit={handleCustomPredict}
                isLoading={isCustomPredicting}
                submitLabel="Predict Salary"
              />
              <div className="lr-result-slot">
                {customPredictError && <ErrorBanner message={customPredictError} />}
                {customPrediction && !customPredictError && (
                  <ResultCard
                    label={`Predicted ${customColumns.target_column} for ${customColumns.feature_column} = ${customPrediction.input}`}
                    value={customPrediction.value}
                  />
                )}
                {!customPrediction && !customPredictError && (
                  <div className="lr-result-placeholder card">
                    <p>Your predicted {customColumns.target_column.toLowerCase()} will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            <h3 className="lr-subheading">Model Evaluation</h3>
            <MetricsPanel metrics={customMetrics} />

            <h3 className="lr-subheading">Regression Graph</h3>
            {customGraphSrc && (
              <GraphViewer key={customGraphSrc} src={customGraphSrc} onError={() => {}} />
            )}
          </>
        )}
      </section>

      {/* ---- Cross-link to the other Linear Regression use case ---- */}
      <section className="lr-section">
        <Link to="/stock-prediction" className="lr-crosslink card">
          <div>
            <p className="lr-crosslink-title">Also try: Stock Price Prediction</p>
            <p className="lr-crosslink-copy">
              The same Linear Regression approach, applied to historical Open/High/Low/Volume
              data to predict a closing price.
            </p>
          </div>
          <span aria-hidden="true">→</span>
        </Link>
      </section>

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
        .lr-section {
          margin-top: 40px;
        }
        .lr-section h2 {
          font-size: 20px;
          margin-bottom: 10px;
        }
        .lr-copy {
          margin-bottom: 16px;
          max-width: 640px;
        }
        .lr-formula {
          display: inline-block;
          font-size: 20px;
          padding: 14px 26px;
          margin-bottom: 8px;
          color: var(--blue-700);
        }
        .lr-formula-caption {
          font-size: 13px;
          color: var(--ink-400);
        }
        .lr-predict-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 20px;
          align-items: stretch;
        }
        .lr-result-slot {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .lr-result-placeholder {
          padding: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }
        .lr-result-placeholder p {
          font-size: 14px;
        }
        .lr-upload-section {
          padding-top: 32px;
          border-top: 1px dashed var(--border-strong);
        }
        .lr-subheading {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink-700);
          margin: 28px 0 12px;
        }
        .lr-crosslink {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 26px;
        }
        .lr-crosslink-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink-900);
          margin-bottom: 4px;
        }
        .lr-crosslink-copy {
          font-size: 13px;
          max-width: 520px;
        }
        .lr-crosslink span {
          font-size: 20px;
          color: var(--blue-600);
          flex-shrink: 0;
        }
        @media (max-width: 720px) {
          .lr-predict-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
