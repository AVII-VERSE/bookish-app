# Medical Document Analysis API

FastAPI-based backend for analyzing medical documents (PDF, images, text) and extracting structured medical information.

## Features

- **Multi-format support**: PDF, images (PNG, JPEG, etc.), and raw text
- **Medical information extraction**:
  - Medications with dosage and timing
  - Hospital recommendations by specialty
  - Critical alerts and warnings
  - Medical summary generation
- **Progress tracking**: Real-time progress states during processing
- **Error handling**: User-friendly error messages
- **Comprehensive testing**: Full test coverage for happy path and error cases

## Setup

1. Install Python 3.8 or higher

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install system dependencies (for python-magic):
   ```bash
   # Ubuntu/Debian
   sudo apt-get install libmagic1
   
   # macOS
   brew install libmagic
   ```

## Running the Server

Start the development server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- Main API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### POST /analysis/analyze

Analyzes a medical document and returns structured information.

**Request:**
- Form data with either:
  - `file`: Multipart file upload (PDF or image)
  - `text`: Raw text content

**Response:**
```json
{
  "success": true,
  "summary": "Medical document summary...",
  "medications": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "twice daily",
      "timing": "with meals",
      "duration": "30 days",
      "notes": null
    }
  ],
  "hospital_recommendations": [
    {
      "specialty": "Endocrinology",
      "reason": "Based on mentioned diabetes-related concerns",
      "urgency": "medium",
      "notes": "Please consult with a healthcare provider"
    }
  ],
  "alerts": [
    {
      "level": "warning",
      "message": "Important: Allergy mentioned - ...",
      "category": "allergy"
    }
  ],
  "metadata": {
    "duration_ms": 123.45,
    "source_type": "pdf",
    "file_size_bytes": 12345,
    "page_count": 2,
    "processed_at": "2024-01-15T10:30:00",
    "progress_states": [
      {
        "stage": "validation",
        "progress": 10,
        "message": "Input validated successfully",
        "timestamp": "2024-01-15T10:30:00"
      }
    ]
  },
  "error": null
}
```

### GET /analysis/health

Health check endpoint.

## Running Tests

Run all tests:
```bash
pytest tests/ -v
```

Run with coverage:
```bash
pytest tests/ --cov=app --cov-report=html
```

## Architecture

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── routers/
│   │   └── analysis.py      # Analysis endpoints
│   ├── services/
│   │   ├── document_parser.py  # Document parsing logic
│   │   └── medical_agent.py    # Medical analysis logic
│   └── models/
│       └── analysis.py      # Pydantic models
├── tests/
│   └── test_analysis.py     # Comprehensive tests
└── requirements.txt         # Python dependencies
```

## Error Codes

- `MISSING_INPUT`: No file or text provided
- `MULTIPLE_INPUTS`: Both file and text provided
- `PARSE_ERROR`: Error parsing document
- `TEXT_VALIDATION_ERROR`: Invalid text input
- `ANALYSIS_ERROR`: Error during medical analysis
- `INTERNAL_ERROR`: Unexpected server error

## Development

The API uses:
- **FastAPI**: Modern, fast web framework
- **Pydantic**: Data validation using Python type hints
- **PyPDF2**: PDF parsing
- **Pillow**: Image processing
- **python-magic**: File type detection

## Notes

- Maximum file size: 10 MB
- Maximum text length: 100,000 characters
- OCR for images is not yet implemented (placeholder response provided)
- This is a demonstration API and should not be used for actual medical decisions
