import { useState } from "react";
import Spinner from "./Spinner.jsx";

export default function PredictionForm({ onSubmit, isLoading }) {
  const [experience, setExperience] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(experience);

    if (experience.trim() === "" || Number.isNaN(value)) {
      setValidationError("Enter a valid number of years.");
      return;
    }
    if (value < 0) {
      setValidationError("Years of experience can't be negative.");
      return;
    }

    setValidationError("");
    onSubmit(value);
  };

  return (
    <form className="predict-form card" onSubmit={handleSubmit}>
      <label htmlFor="experience-input" className="predict-label">
        Years of Experience
      </label>
      <div className="predict-row">
        <input
          id="experience-input"
          type="number"
          min="0"
          step="0.1"
          inputMode="decimal"
          placeholder="e.g. 4.5"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="predict-input mono"
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? <Spinner label="Predicting…" /> : "Predict Salary"}
        </button>
      </div>
      {validationError && <p className="predict-error">{validationError}</p>}

      <style>{`
        .predict-form {
          padding: 26px;
        }
        .predict-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-700);
          margin-bottom: 10px;
        }
        .predict-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .predict-input {
          flex: 1;
          min-width: 160px;
          padding: 13px 16px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border-strong);
          font-size: 15px;
          color: var(--ink-900);
          background: var(--bg);
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .predict-input:focus {
          outline: none;
          border-color: var(--blue-500);
          box-shadow: 0 0 0 3px var(--blue-100);
        }
        .predict-error {
          margin-top: 10px;
          font-size: 13px;
          color: #b42318;
        }
      `}</style>
    </form>
  );
}
