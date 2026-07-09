"""
In-memory store for uploaded datasets, trained models, and cached graph images.

NOTE ON SCOPE: this keeps everything in a plain Python dict inside the
process, keyed by a client-generated session id. That's the right amount of
complexity for a single-instance demo/portfolio deployment (one Render web
service, one gunicorn worker). It is NOT safe across multiple workers or
replicas, since each process would hold its own copy of the store and a
user's session could land on a different worker between requests. If you
scale this beyond a single worker, replace this module with a shared store
(Redis, a database table) keyed the same way.
"""

from threading import Lock

_lock = Lock()
_STORE = {}  # session_id -> { "salary": {...}, "stock": {...} }


def get_entry(session_id, key):
    """Return the stored dict for (session_id, key), or None if not present."""
    with _lock:
        return _STORE.get(session_id, {}).get(key)


def set_entry(session_id, key, value):
    """Store `value` under (session_id, key), creating the session if needed."""
    with _lock:
        _STORE.setdefault(session_id, {})[key] = value
