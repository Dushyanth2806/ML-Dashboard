// Generates (or reuses) a per-browser session id, sent to the backend with
// every upload/predict call so multiple users' uploaded datasets and trained
// models don't collide in the backend's in-memory store.
const STORAGE_KEY = "ml-dashboard-session-id";

export function getSessionId() {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
