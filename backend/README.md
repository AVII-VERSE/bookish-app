# MEDIC-ROXX Backend

This is the backend service for MEDIC-ROXX, built with FastAPI.

## Prerequisites

- Python 3.10+
- Tesseract OCR

### Installing Tesseract

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
sudo apt-get install libtesseract-dev
```

**macOS:**
```bash
brew install tesseract
```

**Windows:**
Download the installer from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki).

## Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   
   Using Poetry (Recommended):
   ```bash
   pip install poetry
   poetry install
   ```

   Or using pip directly (if you prefer):
   ```bash
   pip install fastapi uvicorn crewai langchain pdfplumber pdf2image pytesseract pillow python-multipart httpx pydantic-settings
   ```

4. Configure environment:
   Copy `.env.example` to `.env` and fill in the values.
   ```bash
   cp .env.example .env
   ```

## Running the Server

Start the development server:

```bash
uvicorn app.main:app --reload
```

The server will start at `http://127.0.0.1:8000`.

- Health check: `http://127.0.0.1:8000/health`
- API Documentation: `http://127.0.0.1:8000/docs`

## Wiring to Frontend

The frontend is a Vite app. To connect the frontend to this backend:

1. Ensure the backend is running on port 8000.
2. Update the frontend API calls to point to `http://localhost:8000` (or configure a proxy in `vite.config.ts`).

Example proxy configuration in `vite.config.ts`:
```typescript
// In your vite.config.ts
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```
