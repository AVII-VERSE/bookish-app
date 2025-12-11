# API Reference

Quick reference for the Medical Document Analysis API.

## Base URL

```
http://localhost:8000
```

## Endpoints

### POST /analysis/analyze

Analyzes medical documents and extracts structured information.

**Request:**

One of:
- Form field `file`: PDF or image file (multipart/form-data)
- Form field `text`: Raw text content

**Example with curl:**

```bash
# Text
curl -X POST http://localhost:8000/analysis/analyze \
  -F "text=Patient presents with hypertension. Prescribed Lisinopril 10mg daily."

# PDF
curl -X POST http://localhost:8000/analysis/analyze \
  -F "file=@medical_report.pdf"

# Image
curl -X POST http://localhost:8000/analysis/analyze \
  -F "file=@prescription.png"
```

**Response (200 OK):**

```json
{
  "success": true,
  "summary": "Medical document summary...",
  "medications": [
    {
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "once daily",
      "timing": "in the morning",
      "duration": null,
      "notes": null
    }
  ],
  "hospital_recommendations": [
    {
      "specialty": "Cardiology",
      "reason": "Based on mentioned heart-related concerns",
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
    "source_type": "text",
    "file_size_bytes": 1234,
    "page_count": null,
    "processed_at": "2024-01-15T10:30:00Z",
    "progress_states": [
      {
        "stage": "validation",
        "progress": 10,
        "message": "Input validated successfully",
        "timestamp": "2024-01-15T10:30:00Z"
      },
      {
        "stage": "complete",
        "progress": 100,
        "message": "Analysis complete and ready",
        "timestamp": "2024-01-15T10:30:05Z"
      }
    ]
  },
  "error": null
}
```

**Error Response (400/500):**

```json
{
  "success": false,
  "error": "User-friendly error message",
  "error_code": "PARSE_ERROR",
  "details": null
}
```

### GET /analysis/health

Health check for the analysis service.

**Response:**
```json
{
  "status": "healthy",
  "service": "analysis",
  "version": "1.0.0"
}
```

### GET /health

General health check.

**Response:**
```json
{
  "status": "healthy",
  "service": "api"
}
```

### GET /

API information.

**Response:**
```json
{
  "message": "Medical Document Analysis API",
  "version": "1.0.0",
  "docs": "/docs",
  "health": "/analysis/health"
}
```

## Response Models

### Medication
```typescript
{
  name: string;           // Medication name
  dosage: string;         // Dosage (e.g., "10mg")
  frequency: string;      // How often (e.g., "twice daily")
  timing?: string;        // When to take (e.g., "with meals")
  duration?: string;      // How long (e.g., "30 days")
  notes?: string;         // Additional notes
}
```

### HospitalRecommendation
```typescript
{
  specialty: string;                          // Medical specialty
  reason: string;                             // Why recommended
  urgency: "low" | "medium" | "high" | "critical";
  notes?: string;                             // Additional info
}
```

### Alert
```typescript
{
  level: "info" | "warning" | "danger" | "critical";
  message: string;        // Alert message
  category?: string;      // Alert category
}
```

### ProgressState
```typescript
{
  stage: string;          // Stage identifier
  progress: number;       // 0-100
  message: string;        // User-friendly message
  timestamp: string;      // ISO datetime
}
```

### ProcessingMetadata
```typescript
{
  duration_ms: number;                        // Processing time
  source_type: "pdf" | "image" | "text";     // Input type
  file_size_bytes?: number;                   // File size
  page_count?: number;                        // PDF pages
  processed_at: string;                       // ISO datetime
  progress_states: ProgressState[];           // Progress tracking
}
```

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `MISSING_INPUT` | No file or text provided | 400 |
| `MULTIPLE_INPUTS` | Both file and text provided | 400 |
| `PARSE_ERROR` | Document parsing failed | 400 |
| `TEXT_VALIDATION_ERROR` | Invalid text input | 400 |
| `ANALYSIS_ERROR` | Medical analysis failed | 400 |
| `INTERNAL_ERROR` | Unexpected server error | 500 |

## Progress Stages

The API returns progress states showing processing stages:

1. **validation** (10%) - Input validated
2. **parsing** (20%) - Parsing document
3. **parsing_complete** (40%) - Parsing finished
4. **analysis** (50%) - Analyzing content
5. **analysis_complete** (90%) - Analysis finished
6. **complete** (100%) - Ready

## Supported File Types

- **PDF**: `.pdf` (text-based only)
- **Images**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.tiff`, `.webp`
- **Text**: Raw text (up to 100,000 characters)

## Limitations

- Maximum file size: 10 MB
- Maximum text length: 100,000 characters
- OCR not yet implemented for images
- PDFs must contain extractable text

## Interactive Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## TypeScript/JavaScript Example

```typescript
async function analyzeDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8000/analysis/analyze', {
    method: 'POST',
    body: formData,
  });
  
  return await response.json();
}

async function analyzeText(text: string) {
  const formData = new FormData();
  formData.append('text', text);
  
  const response = await fetch('http://localhost:8000/analysis/analyze', {
    method: 'POST',
    body: formData,
  });
  
  return await response.json();
}
```

## Python Example

```python
import requests

# Analyze text
response = requests.post(
    'http://localhost:8000/analysis/analyze',
    data={'text': 'Medical document text...'}
)
result = response.json()

# Analyze file
with open('medical_report.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/analysis/analyze',
        files={'file': f}
    )
result = response.json()
```

## CORS

CORS is enabled for all origins in development. Update `app/main.py` for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
