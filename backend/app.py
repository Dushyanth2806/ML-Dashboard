"""
Machine Learning Algorithms Dashboard — Backend
Flask API serving a sample dataset, a Linear Regression prediction endpoint,
a matplotlib-generated regression graph, and (new) CSV-upload-driven Linear
Regression for both a custom salary dataset and stock closing-price
prediction.

Endpoints (original, unchanged):
    GET  /sample-data    -> returns the built-in sample dataset
    POST /predict        -> { "experience": <float> } -> { "salary": <float> }
    GET  /graph           -> PNG regression graph for the built-in dataset
    GET  /health          -> simple health check (useful for Render)

Endpoints (new — CSV upload features):
    POST /upload-salary-data     -> upload a 2-column CSV, trains a model
    POST /predict-salary         -> predict using the uploaded salary model
    GET  /salary-graph/<sid>     -> PNG regression graph for the uploaded data

    POST /upload-stock-data      -> upload a stock CSV, trains a model
    POST /predict-stock          -> predict closing price from feature values
    GET  /stock-graph/<sid>      -> PNG actual-vs-predicted graph
"""

import io
import os

import matplotlib
matplotlib.use("Agg")  # headless rendering, required on servers with no display
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

from csv_utils import (
    MIN_ROWS_FOR_TRAINING,
    CsvValidationError,
    coerce_numeric_columns,
    detect_numeric_columns,
    read_csv_from_file_storage,
)
from session_store import get_entry, set_entry

app = Flask(__name__)

# ---------------------------------------------------------------------------
# CORS: restrict to known frontend origins instead of allowing "*".
# Set ALLOWED_ORIGINS on the host as a comma-separated list, e.g.
#   ALLOWED_ORIGINS=https://ml-dashboard-cyan.vercel.app,http://localhost:5173
# Falls back to the known Vercel deployment + local dev if not set.
# ---------------------------------------------------------------------------
DEFAULT_ORIGINS = "https://ml-dashboard-cyan.vercel.app,http://localhost:5173"
allowed_origins = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")
    if origin.strip()
]
CORS(app, resources={r"/*": {"origins": allowed_origins}})

# Reject oversized uploads before they're even read into memory.
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5 MB


@app.errorhandler(413)
def request_too_large(_err):
    return jsonify({"error": "File is too large. Please upload a CSV under 5 MB."}), 413


def _get_session_id():
    """Session id is sent as a form field on uploads and a JSON field on predicts."""
    session_id = request.form.get("session_id") or (request.get_json(silent=True) or {}).get(
        "session_id"
    )
    if not session_id:
        return None
    return str(session_id)[:128]  # basic sanity cap on length

# ---------------------------------------------------------------------------
# Sample dataset — Years of Experience vs. Salary
# ---------------------------------------------------------------------------
SAMPLE_DATA = pd.DataFrame(
    {
        "experience": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "salary": [30000, 35000, 40000, 50000, 60000, 65000, 70000, 80000, 90000, 100000],
    }
)

# ---------------------------------------------------------------------------
# Train the model once at startup
# ---------------------------------------------------------------------------
X = SAMPLE_DATA[["experience"]].values
y = SAMPLE_DATA["salary"].values

model = LinearRegression()
model.fit(X, y)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/sample-data", methods=["GET"])
def sample_data():
    """Return the dataset used to train the Linear Regression model."""
    records = SAMPLE_DATA.to_dict(orient="records")
    return jsonify({"data": records})


@app.route("/predict", methods=["POST"])
def predict():
    """Predict salary for a given years-of-experience value."""
    payload = request.get_json(silent=True) or {}

    if "experience" not in payload:
        return jsonify({"error": "Missing 'experience' field in request body."}), 400

    try:
        experience = float(payload["experience"])
    except (TypeError, ValueError):
        return jsonify({"error": "'experience' must be a number."}), 400

    if experience < 0:
        return jsonify({"error": "'experience' must be a non-negative number."}), 400

    prediction = model.predict(np.array([[experience]]))
    salary = round(float(prediction[0]), 2)

    return jsonify({"salary": salary})


@app.route("/graph", methods=["GET"])
def graph():
    """Return a PNG of the training data scatter plot with the regression line."""
    fig, ax = plt.subplots(figsize=(7, 4.5), dpi=150)

    # Scatter of the real data points (blue)
    ax.scatter(
        SAMPLE_DATA["experience"],
        SAMPLE_DATA["salary"],
        color="#2563EB",
        s=55,
        label="Training data",
        zorder=3,
        edgecolors="white",
        linewidths=0.6,
    )

    # Regression line across the observed range (red)
    x_line = np.linspace(SAMPLE_DATA["experience"].min(), SAMPLE_DATA["experience"].max(), 100)
    y_line = model.predict(x_line.reshape(-1, 1))
    ax.plot(x_line, y_line, color="#DC2626", linewidth=2.2, label="Regression line", zorder=2)

    ax.set_xlabel("Years of Experience")
    ax.set_ylabel("Salary (₹)")
    ax.set_title("Linear Regression — Experience vs. Salary")
    ax.grid(True, linestyle="--", alpha=0.35)
    ax.legend(frameon=False)
    fig.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png", transparent=False, facecolor="white")
    plt.close(fig)
    buf.seek(0)

    return send_file(buf, mimetype="image/png")


def _fig_to_png_bytes(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", transparent=False, facecolor="white")
    plt.close(fig)
    buf.seek(0)
    return buf.getvalue()


def _train_with_holdout(X, y, test_size=0.2, random_state=42):
    """
    Split, fit on the training portion, evaluate on the held-out portion,
    then refit a fresh model on ALL the data for the best real-world
    prediction quality. Returns (final_model, metrics_dict, eval_data) where
    eval_data holds the test split's true/predicted values for graphing.
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    eval_model = LinearRegression()
    eval_model.fit(X_train, y_train)
    y_pred_test = eval_model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred_test)
    mse = mean_squared_error(y_test, y_pred_test)
    rmse = float(np.sqrt(mse))
    r2 = r2_score(y_test, y_pred_test)

    metrics = {
        "r2_score": round(float(r2), 4),
        "mae": round(float(mae), 4),
        "mse": round(float(mse), 4),
        "rmse": round(float(rmse), 4),
        "accuracy_percent": round(float(r2) * 100, 2),
    }

    # Refit on the full dataset so predictions use every row the user gave us.
    final_model = LinearRegression()
    final_model.fit(X, y)

    eval_data = {"y_test": y_test, "y_pred_test": y_pred_test}
    return final_model, metrics, eval_data


# ---------------------------------------------------------------------------
# FEATURE 1 — CSV upload + Linear Regression for a custom salary dataset
# ---------------------------------------------------------------------------
@app.route("/upload-salary-data", methods=["POST"])
def upload_salary_data():
    session_id = _get_session_id()
    if not session_id:
        return jsonify({"error": "Missing session_id."}), 400

    try:
        df = read_csv_from_file_storage(request.files.get("file"))
    except CsvValidationError as exc:
        return jsonify({"error": str(exc)}), 400

    # First column is the feature (X), second is the target (Y) — matches
    # the brief's "Experience,Salary" example, but works with any column
    # names since we use position rather than name.
    feature_col, target_col = df.columns[0], df.columns[1]
    df = df[[feature_col, target_col]]

    df, dropped = coerce_numeric_columns(df, [feature_col, target_col])
    if len(df) < MIN_ROWS_FOR_TRAINING:
        return (
            jsonify(
                {
                    "error": (
                        f"Need at least {MIN_ROWS_FOR_TRAINING} valid numeric rows to train "
                        f"a model (found {len(df)} after cleaning)."
                    )
                }
            ),
            400,
        )

    X = df[[feature_col]].values
    y = df[target_col].values

    model, metrics, _eval = _train_with_holdout(X, y)
    set_entry(session_id, "salary_model", model)
    set_entry(session_id, "salary_columns", (feature_col, target_col))

    # Cache the regression graph (scatter of all uploaded points + fitted line).
    fig, ax = plt.subplots(figsize=(7, 4.5), dpi=150)
    ax.scatter(
        df[feature_col], df[target_col], color="#2563EB", s=55, label="Uploaded data",
        zorder=3, edgecolors="white", linewidths=0.6,
    )
    x_line = np.linspace(df[feature_col].min(), df[feature_col].max(), 100)
    y_line = model.predict(x_line.reshape(-1, 1))
    ax.plot(x_line, y_line, color="#DC2626", linewidth=2.2, label="Regression line", zorder=2)
    ax.set_xlabel(feature_col)
    ax.set_ylabel(target_col)
    ax.set_title(f"Linear Regression — {feature_col} vs. {target_col}")
    ax.grid(True, linestyle="--", alpha=0.35)
    ax.legend(frameon=False)
    fig.tight_layout()
    set_entry(session_id, "salary_graph", _fig_to_png_bytes(fig))

    return jsonify(
        {
            "message": "Dataset uploaded successfully.",
            "feature_column": feature_col,
            "target_column": target_col,
            "row_count": len(df),
            "dropped_rows": int(dropped),
            "preview": df.head(15).to_dict(orient="records"),
            "metrics": metrics,
        }
    )


@app.route("/predict-salary", methods=["POST"])
def predict_salary_custom():
    payload = request.get_json(silent=True) or {}
    session_id = str(payload.get("session_id") or "")[:128]
    if not session_id:
        return jsonify({"error": "Missing session_id."}), 400

    model = get_entry(session_id, "salary_model")
    columns = get_entry(session_id, "salary_columns")
    if model is None or columns is None:
        return jsonify({"error": "Upload a dataset first before predicting."}), 400

    feature_col, target_col = columns
    if "value" not in payload:
        return jsonify({"error": "Missing 'value' field in request body."}), 400

    try:
        value = float(payload["value"])
    except (TypeError, ValueError):
        return jsonify({"error": "'value' must be a number."}), 400

    prediction = model.predict(np.array([[value]]))
    return jsonify(
        {
            "prediction": round(float(prediction[0]), 2),
            "feature_column": feature_col,
            "target_column": target_col,
        }
    )


@app.route("/salary-graph/<session_id>", methods=["GET"])
def salary_graph(session_id):
    png_bytes = get_entry(session_id, "salary_graph")
    if png_bytes is None:
        return jsonify({"error": "No graph available. Upload a dataset first."}), 404
    return send_file(io.BytesIO(png_bytes), mimetype="image/png")


# ---------------------------------------------------------------------------
# FEATURE 2 — CSV upload + Linear Regression for stock closing-price prediction
# ---------------------------------------------------------------------------
@app.route("/upload-stock-data", methods=["POST"])
def upload_stock_data():
    session_id = _get_session_id()
    if not session_id:
        return jsonify({"error": "Missing session_id."}), 400

    try:
        df = read_csv_from_file_storage(request.files.get("file"))
    except CsvValidationError as exc:
        return jsonify({"error": str(exc)}), 400

    # Target: prefer a column literally named "Close" (case-insensitive);
    # otherwise fall back to the last numeric column in the file.
    lower_map = {c.lower(): c for c in df.columns}
    target_col = lower_map.get("close")

    numeric_cols = detect_numeric_columns(df)
    if target_col is None:
        if not numeric_cols:
            return (
                jsonify(
                    {
                        "error": (
                            "Couldn't find a 'Close' column or any numeric column to use as "
                            "the prediction target."
                        )
                    }
                ),
                400,
            )
        target_col = numeric_cols[-1]

    feature_cols = [c for c in numeric_cols if c != target_col]
    if not feature_cols:
        return (
            jsonify(
                {
                    "error": (
                        "Couldn't detect numeric feature columns — make sure your CSV has "
                        "numeric columns (e.g. Open, High, Low, Volume) besides the target."
                    )
                }
            ),
            400,
        )

    df, dropped = coerce_numeric_columns(df, feature_cols + [target_col])
    if len(df) < MIN_ROWS_FOR_TRAINING:
        return (
            jsonify(
                {
                    "error": (
                        f"Need at least {MIN_ROWS_FOR_TRAINING} valid numeric rows to train "
                        f"a model (found {len(df)} after cleaning)."
                    )
                }
            ),
            400,
        )

    X = df[feature_cols].values
    y = df[target_col].values

    model, metrics, eval_data = _train_with_holdout(X, y)
    set_entry(session_id, "stock_model", model)
    set_entry(session_id, "stock_columns", (feature_cols, target_col))

    # Cache a two-panel graph: actual-vs-predicted scatter (with a y=x
    # reference line) and a sequential line chart comparing the two, both
    # computed on the held-out test split so it reflects real generalization
    # rather than the model just recalling its own training rows.
    y_test = eval_data["y_test"]
    y_pred_test = eval_data["y_pred_test"]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4.5), dpi=150)

    ax1.scatter(y_test, y_pred_test, color="#2563EB", s=45, edgecolors="white", linewidths=0.6, zorder=3)
    lo, hi = min(y_test.min(), y_pred_test.min()), max(y_test.max(), y_pred_test.max())
    ax1.plot([lo, hi], [lo, hi], color="#DC2626", linewidth=2, linestyle="--", label="Perfect prediction")
    ax1.set_xlabel(f"Actual {target_col}")
    ax1.set_ylabel(f"Predicted {target_col}")
    ax1.set_title("Actual vs. Predicted")
    ax1.grid(True, linestyle="--", alpha=0.35)
    ax1.legend(frameon=False)

    idx = np.arange(len(y_test))
    ax2.plot(idx, y_test, color="#2563EB", marker="o", markersize=4, linewidth=1.6, label="Actual")
    ax2.plot(idx, y_pred_test, color="#DC2626", marker="o", markersize=4, linewidth=1.6, label="Predicted")
    ax2.set_xlabel("Test sample index")
    ax2.set_ylabel(target_col)
    ax2.set_title("Actual vs. Predicted (test set)")
    ax2.grid(True, linestyle="--", alpha=0.35)
    ax2.legend(frameon=False)

    fig.tight_layout()
    set_entry(session_id, "stock_graph", _fig_to_png_bytes(fig))

    return jsonify(
        {
            "message": "Dataset uploaded successfully.",
            "feature_columns": feature_cols,
            "target_column": target_col,
            "row_count": len(df),
            "dropped_rows": int(dropped),
            "preview": df.head(15).to_dict(orient="records"),
            "metrics": metrics,
        }
    )


@app.route("/predict-stock", methods=["POST"])
def predict_stock():
    payload = request.get_json(silent=True) or {}
    session_id = str(payload.get("session_id") or "")[:128]
    if not session_id:
        return jsonify({"error": "Missing session_id."}), 400

    model = get_entry(session_id, "stock_model")
    columns = get_entry(session_id, "stock_columns")
    if model is None or columns is None:
        return jsonify({"error": "Upload a dataset first before predicting."}), 400

    feature_cols, target_col = columns
    features = payload.get("features")
    if not isinstance(features, dict):
        return jsonify({"error": "Missing 'features' object in request body."}), 400

    missing = [c for c in feature_cols if c not in features]
    if missing:
        return jsonify({"error": f"Missing values for: {', '.join(missing)}"}), 400

    try:
        ordered_values = [float(features[c]) for c in feature_cols]
    except (TypeError, ValueError):
        return jsonify({"error": "All feature values must be numbers."}), 400

    prediction = model.predict(np.array([ordered_values]))
    return jsonify(
        {
            "prediction": round(float(prediction[0]), 2),
            "feature_columns": feature_cols,
            "target_column": target_col,
        }
    )


@app.route("/stock-graph/<session_id>", methods=["GET"])
def stock_graph(session_id):
    png_bytes = get_entry(session_id, "stock_graph")
    if png_bytes is None:
        return jsonify({"error": "No graph available. Upload a dataset first."}), 404
    return send_file(io.BytesIO(png_bytes), mimetype="image/png")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
