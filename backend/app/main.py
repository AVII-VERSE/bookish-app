from fastapi import FastAPI
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MEDICAL_KB_API_URL: str = ""
    MEDICAL_KB_API_KEY: str = ""
    OCR_LANGUAGE: str = "eng"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

app = FastAPI(title="MEDIC-ROXX Backend")

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "config": {
            "ocr_language": settings.OCR_LANGUAGE,
            "has_kb_api_url": bool(settings.MEDICAL_KB_API_URL),
            "has_kb_api_key": bool(settings.MEDICAL_KB_API_KEY),
        }
    }

@app.get("/")
async def root():
    return {"message": "Welcome to MEDIC-ROXX Backend"}
