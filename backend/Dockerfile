FROM python:3.11.9-slim

WORKDIR /app

# System libs matplotlib/pandas sometimes need for wheel builds
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=5000
EXPOSE 5000

# Shell form (not exec-array form) so $PORT is expanded at container start —
# Render/Railway/Fly all inject PORT dynamically and it won't be 5000 in production.
CMD gunicorn app:app --bind 0.0.0.0:$PORT
