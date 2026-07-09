import { useState } from "react";
import Spinner from "./Spinner.jsx";

export default function DynamicPredictionForm({ fields, onSubmit, isLoading, submitLabel = "Predict" }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f, ""])));
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = {};
    for (const field of fields) {
      const raw = values[field];
      const num = Number(raw);
      if (raw === "" || Number.isNaN(num)) {
        setError(`Enter a valid number for "${field}".`);
        return;
      }
      parsed[field] = num;
    }
    setError("");
    onSubmit(parsed);
  };

  return (
    <form className="dyn-form card" onSubmit={handleSubmit}>
      <div className="dyn-form-grid">
        {fields.map((field) => (
          <div key={field} className="dyn-form-field">
            <label className="dyn-form-label" htmlFor={`dyn-${field}`}>
              {field}
            </label>
            <input
              id={`dyn-${field}`}
              type="number"
              step="any"
              inputMode="decimal"
              value={values[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="dyn-form-input mono"
              placeholder="0"
            />
          </div>
        ))}
      </div>

      <button type="submit" className="btn btn-primary dyn-form-submit" disabled={isLoading}>
        {isLoading ? <Spinner label="Predicting…" /> : submitLabel}
      </button>

      {error && <p className="dyn-form-error">{error}</p>}

      <style>{`
        .dyn-form {
          padding: 26px;
        }
        .dyn-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }
        .dyn-form-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--ink-700);
          margin-bottom: 6px;
        }
        .dyn-form-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-strong);
          font-size: 14px;
          color: var(--ink-900);
          background: var(--bg);
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .dyn-form-input:focus {
          outline: none;
          border-color: var(--blue-500);
          box-shadow: 0 0 0 3px var(--blue-100);
        }
        .dyn-form-submit {
          width: 100%;
        }
        .dyn-form-error {
          margin-top: 10px;
          font-size: 13px;
          color: #b42318;
        }
      `}</style>
    </form>
  );
}
