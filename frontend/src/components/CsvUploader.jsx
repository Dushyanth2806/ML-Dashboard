import { useRef, useState } from "react";
import Spinner from "./Spinner.jsx";
import ErrorBanner from "./ErrorBanner.jsx";

export default function CsvUploader({ onUpload, accept = ".csv", exampleHint }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | training | success | error
  const [message, setMessage] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setStatus("training");
    setMessage("");
    try {
      const successMessage = await onUpload(file);
      setStatus("success");
      setMessage(successMessage || "Dataset uploaded successfully.");
    } catch (err) {
      setStatus("error");
      setMessage(
        err?.response?.data?.error ||
          "Couldn't upload the dataset. Check the file and that the backend is running."
      );
    } finally {
      // allow re-uploading the same filename again
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="csv-uploader card">
      <div className="csv-uploader-row">
        <div>
          <p className="csv-uploader-label">Upload CSV dataset</p>
          {exampleHint && <p className="csv-uploader-hint">{exampleHint}</p>}
        </div>
        <label className="btn btn-primary csv-uploader-btn">
          {fileName ? "Choose a different file" : "Choose CSV file"}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="csv-uploader-input"
          />
        </label>
      </div>

      {fileName && status !== "idle" && (
        <div className="csv-uploader-status">
          {status === "training" && <Spinner label={`Training model on ${fileName}…`} />}
          {status === "success" && <p className="csv-uploader-success">✓ {message}</p>}
          {status === "error" && <ErrorBanner message={message} />}
        </div>
      )}

      <style>{`
        .csv-uploader {
          padding: 22px 24px;
        }
        .csv-uploader-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .csv-uploader-label {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink-700);
          margin-bottom: 4px;
        }
        .csv-uploader-hint {
          font-size: 13px;
          color: var(--ink-400);
          font-family: var(--font-mono);
        }
        .csv-uploader-btn {
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }
        .csv-uploader-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
        }
        .csv-uploader-status {
          margin-top: 16px;
        }
        .csv-uploader-success {
          font-size: 14px;
          font-weight: 600;
          color: #0a7a3d;
          background: #eafaf0;
          border: 1px solid #b7ebc9;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
}
