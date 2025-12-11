from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class Medication(BaseModel):
    name: str = Field(..., description="Name of the medication")
    dosage: str = Field(..., description="Dosage information")
    frequency: str = Field(..., description="How often to take the medication")
    timing: Optional[str] = Field(None, description="Specific timing instructions (e.g., 'with meals', 'before bed')")
    duration: Optional[str] = Field(None, description="How long to take the medication")
    notes: Optional[str] = Field(None, description="Additional notes or warnings")


class HospitalRecommendation(BaseModel):
    specialty: str = Field(..., description="Medical specialty or department")
    reason: str = Field(..., description="Reason for the recommendation")
    urgency: Literal["low", "medium", "high", "critical"] = Field(..., description="Level of urgency")
    notes: Optional[str] = Field(None, description="Additional notes")


class Alert(BaseModel):
    level: Literal["info", "warning", "danger", "critical"] = Field(..., description="Alert severity level")
    message: str = Field(..., description="Alert message")
    category: Optional[str] = Field(None, description="Category of the alert (e.g., 'drug interaction', 'allergy')")


class ProgressState(BaseModel):
    stage: str = Field(..., description="Current processing stage")
    progress: int = Field(..., ge=0, le=100, description="Progress percentage")
    message: str = Field(..., description="Human-readable progress message")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProcessingMetadata(BaseModel):
    duration_ms: float = Field(..., description="Processing duration in milliseconds")
    source_type: Literal["pdf", "image", "text"] = Field(..., description="Type of input source")
    file_size_bytes: Optional[int] = Field(None, description="Size of the uploaded file in bytes")
    page_count: Optional[int] = Field(None, description="Number of pages processed (for PDFs)")
    processed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    progress_states: List[ProgressState] = Field(default_factory=list, description="List of progress states during processing")


class AnalysisResponse(BaseModel):
    success: bool = Field(..., description="Whether the analysis was successful")
    summary: str = Field(..., description="Summary of the medical document")
    medications: List[Medication] = Field(default_factory=list, description="List of identified medications")
    hospital_recommendations: List[HospitalRecommendation] = Field(default_factory=list, description="Hospital visit recommendations")
    alerts: List[Alert] = Field(default_factory=list, description="Important alerts and warnings")
    metadata: ProcessingMetadata = Field(..., description="Processing metadata")
    error: Optional[str] = Field(None, description="Error message if the analysis failed")


class AnalysisError(BaseModel):
    success: bool = Field(default=False)
    error: str = Field(..., description="User-friendly error message")
    error_code: Optional[str] = Field(None, description="Machine-readable error code")
    details: Optional[str] = Field(None, description="Additional error details for debugging")
