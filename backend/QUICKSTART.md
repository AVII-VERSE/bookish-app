# Quick Start Guide

Get the Medical Document Analysis API up and running in 5 minutes.

## Prerequisites

- Python 3.8+
- pip
- libmagic (system library)

## Installation

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python3 -m venv venv

# 3. Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Install system dependencies (Ubuntu/Debian)
sudo apt-get install libmagic1
# On macOS: brew install libmagic
```

## Start the Server

```bash
# Option 1: Using the run script
./run.sh

# Option 2: Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Option 3: Using make
make dev
```

The API will be available at:
- **Base URL**: http://localhost:8000
- **Interactive docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Test the API

### Using curl

**Text Analysis:**
```bash
curl -X POST http://localhost:8000/analysis/analyze \
  -F "text=Patient presents with hypertension. Prescribed Lisinopril 10mg daily."
```

**File Upload:**
```bash
curl -X POST http://localhost:8000/analysis/analyze \
  -F "file=@your_medical_report.pdf"
```

### Using Python

```python
import requests

# Text analysis
response = requests.post(
    "http://localhost:8000/analysis/analyze",
    data={"text": "Patient with diabetes. Metformin 500mg twice daily."}
)
print(response.json())

# File upload
with open("medical_report.pdf", "rb") as f:
    response = requests.post(
        "http://localhost:8000/analysis/analyze",
        files={"file": f}
    )
print(response.json())
```

### Using the Example Script

```bash
python example_usage.py
```

## Run Tests

```bash
# All tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=html

# Using make
make test
```

## Common Tasks

```bash
# Run tests
make test

# Clean cache files
make clean

# Start development server
make dev

# Run example script
make example
```

## Response Format

```json
{
  "success": true,
  "summary": "Medical document summary...",
  "medications": [
    {
      "name": "Medication Name",
      "dosage": "10mg",
      "frequency": "twice daily",
      "timing": "with meals",
      "duration": "30 days",
      "notes": null
    }
  ],
  "hospital_recommendations": [...],
  "alerts": [...],
  "metadata": {
    "duration_ms": 123.45,
    "source_type": "text",
    "file_size_bytes": 1234,
    "processed_at": "2024-01-15T10:30:00Z",
    "progress_states": [...]
  }
}
```

## Troubleshooting

### "No module named 'magic'"
Install libmagic system library:
```bash
# Ubuntu/Debian
sudo apt-get install libmagic1

# macOS
brew install libmagic
```

### Port 8000 already in use
Kill the process or use a different port:
```bash
# Find process
lsof -i :8000

# Kill it
kill -9 <PID>

# Or use different port
uvicorn app.main:app --port 8001
```

### Tests failing
Ensure virtual environment is activated and dependencies are installed:
```bash
source venv/bin/activate
pip install -r requirements.txt
pytest tests/ -v
```

## Next Steps

- Read the full documentation: [README.md](README.md)
- See integration examples: [INTEGRATION.md](INTEGRATION.md)
- Check implementation details: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- Explore API docs: http://localhost:8000/docs

## Support

For issues or questions:
1. Check the documentation in this directory
2. Review the test suite: `tests/test_analysis.py`
3. Explore the API docs: http://localhost:8000/docs
