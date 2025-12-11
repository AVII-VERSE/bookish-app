from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import analysis_router

app = FastAPI(
    title="Medical Document Analysis API",
    description="API for analyzing medical documents (PDF, images, text) and extracting structured medical information",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis_router)


@app.get("/")
async def root():
    return {
        "message": "Medical Document Analysis API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/analysis/health"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "api"
    }
