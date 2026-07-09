# Machine Learning Algorithms Dashboard

A dashboard for exploring ML algorithms. **Linear Regression** is fully implemented end to end
(React frontend + Flask backend + scikit-learn model); every other algorithm is a "Coming Soon"
placeholder card, as scoped.

```
ml-dashboard/
├── frontend/   React (Vite) — deploy to Vercel
└── backend/    Flask API   — deploy to Render
```

## Features

- **Home** — two large cards: Supervised Learning, Unsupervised Learning
- **Supervised Learning** — Linear Regression (fully working) + 8 "Coming Soon" cards
- **Unsupervised Learning** — 5 "Coming Soon" cards
- **Linear Regression** page — intro & formula, sample dataset table, prediction form wired to
  the Flask API, and a matplotlib-generated regression graph (blue points, red fitted line).
  Also includes a **CSV upload section**: upload your own two-column dataset, the backend
  trains a fresh model on it, and you get a prediction form, R²/MAE/MSE/RMSE metrics, an
  accuracy summary, and a regression graph for your own data — all without touching the
  built-in sample dataset above it.
- **Stock Price Prediction** page (new) — upload historical OHLCV-style stock data, the backend
  auto-detects the target column (a literal "Close" column, or the last numeric column) and the
  numeric feature columns, trains a Linear Regression model, and gives you a prediction form,
  evaluation metrics, an accuracy summary, and an actual-vs-predicted graph (scatter +
  sequential line chart) computed on a held-out test split.

### New backend endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/upload-salary-data` | POST | Upload a 2-column CSV, train a custom salary model |
| `/predict-salary` | POST | Predict using the uploaded salary model |
| `/salary-graph/<session_id>` | GET | Regression graph for the uploaded salary data |
| `/upload-stock-data` | POST | Upload a stock CSV, auto-detect columns, train a model |
| `/predict-stock` | POST | Predict closing price from feature values |
| `/stock-graph/<session_id>` | GET | Actual-vs-predicted graph for the uploaded stock data |

**Session model:** each browser generates a random session id (stored in `localStorage`) that's
sent with every upload/predict call. The backend keeps uploaded datasets and trained models in
an in-memory dict keyed by that id — simple and sufficient for a single-instance demo
deployment, but not safe across multiple gunicorn workers/replicas (see the docstring in
`backend/session_store.py` for the upgrade path if you ever need that).

## Run locally

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
python app.py
```

Runs on `http://localhost:5000`. Endpoints: `GET /sample-data`, `POST /predict`, `GET /graph`,
`GET /health`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # points at http://localhost:5000 by default
npm run dev
```

Runs on `http://localhost:5173`.

## Deploy

**Backend → Render**
1. Push `backend/` to a Git repo (or the whole monorepo, with Render's root directory set to
   `backend`).
2. Render will pick up `render.yaml` automatically (or set build command
   `pip install -r requirements.txt` and start command `gunicorn app:app --bind 0.0.0.0:$PORT`
   manually).
3. Note the resulting URL, e.g. `https://ml-dashboard-backend.onrender.com`.

**Frontend → Vercel**
1. Import `frontend/` as the project root in Vercel.
2. Framework preset: Vite. Build command `npm run build`, output directory `dist` (Vercel
   detects this automatically).
3. Add an environment variable `VITE_API_BASE_URL` set to your Render backend URL.
4. Deploy — `vercel.json` handles client-side routing for React Router.

## Notes

- CORS is enabled on the Flask side (`flask-cors`) so the deployed frontend can call the
  deployed backend from a different origin.
- The regression model trains once at startup on the bundled sample dataset — no persistence
  layer needed for this scope.
- Only Linear Regression is implemented, per the project brief; all other algorithm cards are
  intentionally inert "Coming Soon" placeholders.
