#!/bin/bash

echo "Starting Medical Document Analysis API..."
echo "API will be available at: http://localhost:8000"
echo "API docs at: http://localhost:8000/docs"
echo ""

cd "$(dirname "$0")"

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
