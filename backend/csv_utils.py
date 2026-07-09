"""
CSV parsing and validation helpers shared by the salary and stock upload
endpoints. Keeping this separate from app.py so both endpoints validate
uploads the same way and error messages stay consistent.
"""

import pandas as pd

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
# Minimum rows required before we'll train a model. Kept high enough (10)
# that the train/test split used for evaluation metrics has at least a
# couple of rows on each side — R²/MAE/etc. on a 1-row test set are not
# meaningful.
MIN_ROWS_FOR_TRAINING = 10


class CsvValidationError(Exception):
    """Raised when an uploaded CSV fails validation. Message is user-facing."""


def read_csv_from_file_storage(file_storage):
    """Validate and parse a Flask `request.files[...]` upload into a DataFrame."""
    if not file_storage or file_storage.filename == "":
        raise CsvValidationError("No file was uploaded.")

    if not file_storage.filename.lower().endswith(".csv"):
        raise CsvValidationError("Only .csv files are supported.")

    file_storage.stream.seek(0, 2)  # seek to end to measure size
    size = file_storage.stream.tell()
    file_storage.stream.seek(0)

    if size == 0:
        raise CsvValidationError("The uploaded file is empty.")
    if size > MAX_FILE_SIZE_BYTES:
        raise CsvValidationError("File is too large. Please upload a CSV under 5 MB.")

    try:
        df = pd.read_csv(file_storage.stream)
    except Exception as exc:  # noqa: BLE001 — surfacing parser errors to the user is the point
        raise CsvValidationError(f"Couldn't parse the CSV file: {exc}") from exc

    if df.empty:
        raise CsvValidationError("The uploaded CSV has no data rows.")
    if len(df.columns) < 2:
        raise CsvValidationError("The CSV must have at least two columns.")

    df.columns = [str(c).strip() for c in df.columns]
    return df


def coerce_numeric_columns(df, columns):
    """
    Coerce the given columns to numeric, dropping any row where coercion
    fails for at least one of them. Returns (cleaned_df, dropped_row_count).
    """
    cleaned = df.copy()
    for col in columns:
        cleaned[col] = pd.to_numeric(cleaned[col], errors="coerce")

    before = len(cleaned)
    cleaned = cleaned.dropna(subset=columns).reset_index(drop=True)
    dropped = before - len(cleaned)
    return cleaned, dropped


def detect_numeric_columns(df, exclude=()):
    """
    Return the subset of df's columns that are (or can be coerced to be)
    at least 90% numeric, excluding any column names in `exclude`.
    Used to auto-detect usable feature/target columns in datasets with
    mixed types (e.g. a stock CSV with a non-numeric Date column).
    """
    numeric_cols = []
    for col in df.columns:
        if col in exclude:
            continue
        coerced = pd.to_numeric(df[col], errors="coerce")
        non_null_ratio = coerced.notna().mean()
        if non_null_ratio >= 0.9:
            numeric_cols.append(col)
    return numeric_cols
