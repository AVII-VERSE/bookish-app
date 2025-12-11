# Backend Integration Guide

This document describes how to integrate the Medical Document Analysis API with the Bookish frontend.

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Install system dependencies (if needed):**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install libmagic1
   ```

3. **Start the server:**
   ```bash
   ./run.sh
   # Or manually:
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Test the API:**
   ```bash
   pytest tests/ -v
   ```

## API Endpoints

### POST /analysis/analyze

Analyzes medical documents (PDF, images, or text) and returns structured medical information.

#### Request Format

**Option 1: File Upload (PDF or Image)**
```bash
curl -X POST http://localhost:8000/analysis/analyze \
  -F "file=@medical_report.pdf"
```

**Option 2: Text Input**
```bash
curl -X POST http://localhost:8000/analysis/analyze \
  -F "text=Patient presents with hypertension. Prescribed Lisinopril 10mg daily."
```

#### Response Format

```json
{
  "success": true,
  "summary": "Patient presents with hypertension...",
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
    "source_type": "pdf",
    "file_size_bytes": 12345,
    "page_count": 2,
    "processed_at": "2024-01-15T10:30:00Z",
    "progress_states": [
      {
        "stage": "validation",
        "progress": 10,
        "message": "Input validated successfully",
        "timestamp": "2024-01-15T10:30:00Z"
      },
      {
        "stage": "parsing",
        "progress": 20,
        "message": "Parsing uploaded file: medical_report.pdf",
        "timestamp": "2024-01-15T10:30:01Z"
      },
      {
        "stage": "parsing_complete",
        "progress": 40,
        "message": "Successfully parsed PDF document",
        "timestamp": "2024-01-15T10:30:02Z"
      },
      {
        "stage": "analysis",
        "progress": 50,
        "message": "Analyzing medical content with AI agent",
        "timestamp": "2024-01-15T10:30:03Z"
      },
      {
        "stage": "analysis_complete",
        "progress": 90,
        "message": "Medical analysis completed successfully",
        "timestamp": "2024-01-15T10:30:04Z"
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

#### Error Response Format

```json
{
  "success": false,
  "error": "User-friendly error message",
  "error_code": "PARSE_ERROR",
  "details": null
}
```

## Frontend Integration

### TypeScript/React Example

```typescript
// Define types
interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  timing?: string;
  duration?: string;
  notes?: string;
}

interface HospitalRecommendation {
  specialty: string;
  reason: string;
  urgency: "low" | "medium" | "high" | "critical";
  notes?: string;
}

interface Alert {
  level: "info" | "warning" | "danger" | "critical";
  message: string;
  category?: string;
}

interface ProgressState {
  stage: string;
  progress: number;
  message: string;
  timestamp: string;
}

interface AnalysisMetadata {
  duration_ms: number;
  source_type: "pdf" | "image" | "text";
  file_size_bytes?: number;
  page_count?: number;
  processed_at: string;
  progress_states: ProgressState[];
}

interface AnalysisResponse {
  success: boolean;
  summary: string;
  medications: Medication[];
  hospital_recommendations: HospitalRecommendation[];
  alerts: Alert[];
  metadata: AnalysisMetadata;
  error?: string;
}

// API function for file upload
async function analyzeFile(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8000/analysis/analyze', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// API function for text input
async function analyzeText(text: string): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('text', text);
  
  const response = await fetch('http://localhost:8000/analysis/analyze', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Usage in a React component
function MedicalDocumentAnalyzer() {
  const [analyzing, setAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeFile(file);
      
      if (analysis.success) {
        setResult(analysis);
      } else {
        setError(analysis.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileUpload}
        disabled={analyzing}
      />
      
      {analyzing && <div>Analyzing document...</div>}
      
      {result && (
        <div>
          <h2>Analysis Results</h2>
          <p>{result.summary}</p>
          
          {result.medications.length > 0 && (
            <div>
              <h3>Medications</h3>
              <ul>
                {result.medications.map((med, idx) => (
                  <li key={idx}>
                    {med.name} - {med.dosage} - {med.frequency}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {result.alerts.length > 0 && (
            <div>
              <h3>Alerts</h3>
              {result.alerts.map((alert, idx) => (
                <div key={idx} className={`alert-${alert.level}`}>
                  {alert.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

## Progress Tracking

The API includes progress states in the response metadata that can be used to show real-time progress to users:

```typescript
function ProgressIndicator({ progressStates }: { progressStates: ProgressState[] }) {
  const latestState = progressStates[progressStates.length - 1];
  
  return (
    <div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${latestState.progress}%` }}
        />
      </div>
      <p>{latestState.message}</p>
    </div>
  );
}
```

## Error Handling

The API returns user-friendly error messages with error codes:

| Error Code | Description | User Action |
|------------|-------------|-------------|
| `MISSING_INPUT` | No file or text provided | Provide input |
| `MULTIPLE_INPUTS` | Both file and text provided | Choose one input type |
| `PARSE_ERROR` | Document parsing failed | Check file format/content |
| `TEXT_VALIDATION_ERROR` | Invalid text input | Check text length/content |
| `ANALYSIS_ERROR` | Medical analysis failed | Try different content |
| `INTERNAL_ERROR` | Server error | Retry or contact support |

## Supported File Types

- **PDF**: `.pdf` (text-based PDFs only, OCR not yet supported)
- **Images**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.tiff`, `.webp` (OCR placeholder)
- **Text**: Raw text input (up to 100,000 characters)

## Limitations

- Maximum file size: 10 MB
- Maximum text length: 100,000 characters
- OCR for images not yet implemented (placeholder response provided)
- PDF must contain extractable text (not scanned images)

## CORS Configuration

The API is configured to allow all origins for development. For production, update the CORS settings in `app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Update this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Deployment

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y libmagic1 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t medical-analysis-api .
docker run -p 8000:8000 medical-analysis-api
```

### Environment Variables

Currently, no environment variables are required. For future enhancements (e.g., OCR API keys), use:

```bash
export OCR_API_KEY="your-key-here"
```

## Testing

Run the test suite:

```bash
# All tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=html

# Specific test
pytest tests/test_analysis.py::TestAnalysisEndpoint::test_analyze_with_text_input_happy_path -v
```

## Future Enhancements

1. **OCR Support**: Implement OCR for image documents using Tesseract or cloud OCR APIs
2. **WebSocket Streaming**: Real-time progress updates via WebSocket
3. **Batch Processing**: Support for multiple document uploads
4. **Medical NLP**: Integration with medical NLP libraries for better extraction
5. **Database Storage**: Persist analysis results
6. **Authentication**: Add API key or OAuth authentication
7. **Rate Limiting**: Add request rate limiting for production use

## Troubleshooting

### Import Error: No module named 'magic'

Install libmagic:
```bash
# Ubuntu/Debian
sudo apt-get install libmagic1

# macOS
brew install libmagic
```

### PDF Parsing Returns Empty Text

The PDF likely contains scanned images. Convert to text-based PDF or implement OCR.

### Server Won't Start

Check if port 8000 is already in use:
```bash
lsof -i :8000
kill -9 <PID>
```

## Support

For issues or questions, please refer to:
- API Documentation: http://localhost:8000/docs
- Test Suite: `tests/test_analysis.py`
- Backend README: `backend/README.md`
