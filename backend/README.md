# Document Parsing Pipeline

A comprehensive document ingestion module that normalizes inputs from pasted text, PDF uploads, and image uploads with OCR processing.

## Features

- **Multi-format Support**: Text files, PDF documents, and images (with OCR)
- **Text Normalization**: Whitespace cleaning, medication information extraction
- **MIME-type Detection**: Automatic file type identification with fallback
- **Error Handling**: Descriptive error messages for unsupported formats
- **Structured Output**: Rich metadata extraction and document analysis

## Installation

```bash
# Install Python dependencies
pip install -r requirements.txt

# For OCR functionality, install system dependencies:
# Ubuntu/Debian:
sudo apt-get install tesseract-ocr poppler-utils

# For MIME type detection, install libmagic:
sudo apt-get install libmagic1
```

## Usage

### Basic Usage

```python
from app.services import parse_document, create_upload_payload

# Parse a text document
with open("document.txt", "rb") as f:
    content = f.read()

payload = create_upload_payload(content, "document.txt")
result = parse_document(payload)

if result.success:
    print(f"Extracted {result.word_count} words")
    print(f"Text: {result.text[:200]}...")
    print(f"Medication blocks: {result.metadata.get('medication_blocks', [])}")
else:
    print(f"Error: {result.error_message}")
```

### Working with Different File Types

#### Text Files
```python
# Automatic text encoding detection and normalization
payload = create_upload_payload(text_content, "readme.txt")
result = parse_document(payload)
```

#### PDF Documents
```python
# Extract text from PDF using pdfplumber
payload = create_upload_payload(pdf_content, "report.pdf")
result = parse_document(payload)
```

#### Images (OCR)
```python
# Extract text from images using pytesseract + pdf2image
payload = create_upload_payload(image_content, "scan.png")
result = parse_document(payload)
```

### Advanced Usage

#### Custom Metadata
```python
payload = UploadPayload(
    content=content,
    filename="document.txt",
    mime_type="text/plain",
    metadata={"source": "user_upload", "batch_id": "123"}
)
result = parse_document(payload)
```

#### Batch Processing
```python
from app.services import parse_multiple_documents

payloads = [
    create_upload_payload(content1, "doc1.txt"),
    create_upload_payload(content2, "doc2.pdf"),
    create_upload_payload(content3, "doc3.png")
]

results = parse_multiple_documents(payloads)
```

## API Reference

### Core Functions

#### `parse_document(payload: UploadPayload) -> ParsedDocument`
Main parsing function that handles all document types.

**Returns:**
- `ParsedDocument` with fields:
  - `text`: Extracted and normalized text content
  - `metadata`: Document analysis and extraction metadata
  - `source_type`: "text", "pdf", "image", or "unknown"
  - `word_count`: Number of words in extracted text
  - `success`: Boolean indicating parsing success
  - `error_message`: Error description if parsing failed

#### `create_upload_payload(content: bytes, filename: str, mime_type: str = None, metadata: dict = None) -> UploadPayload`
Helper function to create upload payloads with automatic MIME type detection.

### Data Models

#### `UploadPayload`
- `content`: Raw file content as bytes
- `filename`: Original filename
- `mime_type`: MIME type of the file
- `metadata`: Additional metadata (optional)

#### `ParsedDocument`
- `text`: Extracted and normalized text
- `metadata`: Document metadata including:
  - `word_count`, `line_count`, `paragraph_count`
  - `medication_blocks`: Extracted medication information
  - `has_tables`, `has_lists`: Document structure analysis
  - `parsing_time_ms`: Processing time
- `source_type`: Type of source document
- `filename`: Original filename
- `success`: Whether parsing was successful
- `error_message`: Error message if failed

### Utility Functions

#### Text Processing
- `normalize_whitespace(text)`: Clean up extra spaces and line breaks
- `extract_medication_blocks(text)`: Find medication-related information
- `clean_text_content(text)`: Comprehensive text cleaning
- `extract_structured_info(text)`: Analyze document structure

#### File Validation
- `detect_mime_type(content, filename)`: Determine file type
- `validate_file_type(mime_type, filename)`: Check if file is supported
- `validate_file_size(content, max_size_mb)`: Check file size limits

## Supported File Types

| Extension | MIME Type | Source Type | Library Used |
|-----------|-----------|-------------|--------------|
| `.txt` | `text/plain` | text | Built-in decoding |
| `.pdf` | `application/pdf` | pdf | pdfplumber |
| `.jpg/.jpeg` | `image/jpeg` | image | pytesseract + pdf2image |
| `.png` | `image/png` | image | pytesseract + pdf2image |
| `.tiff/.tif` | `image/tiff` | image | pytesseract + pdf2image |
| `.bmp` | `image/bmp` | image | pytesseract + pdf2image |
| `.gif` | `image/gif` | image | pytesseract + pdf2image |

## Error Handling

The module provides descriptive error messages for various failure scenarios:

- **Unsupported file types**: "Unsupported file type: {mime_type}"
- **File size limits**: "File size ({size}MB) exceeds maximum allowed size"
- **Invalid PDF structure**: "Failed to parse PDF: {error}"
- **OCR processing failures**: "OCR processing failed: {error}"
- **Invalid image format**: "Failed to parse image: {error}"
- **Text encoding errors**: "Unable to decode text content with any supported encoding"

## Testing

Run the test suite:

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test classes
python -m pytest tests/test_document_parser.py::TestTextUtils -v
python -m pytest tests/test_document_parser.py::TestMimeUtils -v
python -m pytest tests/test_document_parser.py::TestDocumentParser -v
python -m pytest tests/test_document_parser.py::TestFixturesIntegration -v
```

Test fixtures are located in `tests/fixtures/`:
- `sample_text.txt`: Sample text document
- `sample.pdf`: Simple PDF with medication information
- `sample.png`: Basic PNG image
- `sample_with_text.png`: Image with readable text for OCR testing

## Dependencies

- `pdfplumber`: PDF text extraction
- `pdf2image`: Convert PDF pages to images
- `pytesseract`: OCR text extraction from images
- `Pillow`: Image processing
- `python-magic`: MIME type detection (optional, with fallback)
- `pydantic`: Data validation and serialization
- `pytest`: Testing framework

## Architecture

The module is organized into several components:

- **`app/models.py`**: Data models and type definitions
- **`app/services/document_parser.py`**: Main parsing orchestration
- **`app/parsers.py`**: Format-specific parsers
- **`app/text_utils.py`**: Text cleaning and normalization
- **`app/mime_utils.py`**: MIME type detection and validation

This separation ensures maintainability and allows for easy extension to support additional document formats.