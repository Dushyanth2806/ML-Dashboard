import axios from "axios";
import { getSessionId } from "./session.js";

// Set VITE_API_BASE_URL in Vercel's Environment Variables when deploying, e.g.
// VITE_API_BASE_URL=https://ml-dashboard-j5lv.onrender.com
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ml-dashboard-j5lv.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  // Render's free tier spins down after inactivity and can take 50s+ to wake up.
  // 60s gives the first ("cold start") request room to succeed instead of
  // timing out and showing a false "backend unavailable" error.
  timeout: 60000,
});

export const getSampleData = () => api.get("/sample-data");

export const predictSalary = (experience) =>
  api.post("/predict", { experience });

export const getGraphUrl = () => `${API_BASE_URL}/graph?t=${Date.now()}`;

// ---------------------------------------------------------------------------
// Feature 1 — CSV upload + custom Linear Regression for salary prediction
// ---------------------------------------------------------------------------
export const uploadSalaryCsv = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("session_id", getSessionId());
  return api.post("/upload-salary-data", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const predictSalaryCustom = (value) =>
  api.post("/predict-salary", { session_id: getSessionId(), value });

export const getSalaryGraphUrl = () =>
  `${API_BASE_URL}/salary-graph/${getSessionId()}?t=${Date.now()}`;

// ---------------------------------------------------------------------------
// Feature 2 — CSV upload + Linear Regression for stock closing-price prediction
// ---------------------------------------------------------------------------
export const uploadStockCsv = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("session_id", getSessionId());
  return api.post("/upload-stock-data", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const predictStock = (features) =>
  api.post("/predict-stock", { session_id: getSessionId(), features });

export const getStockGraphUrl = () =>
  `${API_BASE_URL}/stock-graph/${getSessionId()}?t=${Date.now()}`;

export default api;
