from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ParsedDocument(BaseModel):
    """Represents a parsed medical document."""
    
    text: str = Field(..., description="The full text content of the parsed document")
    metadata: Optional[dict] = Field(default=None, description="Additional metadata about the document")


class PrescriptionItem(BaseModel):
    """Represents a single prescription item."""
    
    medication_name: str = Field(..., description="Name of the medication")
    dosage: str = Field(..., description="Dosage information")
    frequency: str = Field(..., description="Frequency of administration")
    duration: Optional[str] = Field(None, description="Duration of treatment")
    notes: Optional[str] = Field(None, description="Additional notes about the prescription")


class PrescriptionSummary(BaseModel):
    """Summary of all prescriptions in the document."""
    
    items: List[PrescriptionItem] = Field(default_factory=list, description="List of prescription items")
    total_medications: int = Field(..., description="Total number of medications")


class MedicationTimingSlot(BaseModel):
    """Represents a medication timing slot."""
    
    time: str = Field(..., description="Time of day for medication (e.g., '08:00 AM')")
    medications: List[str] = Field(default_factory=list, description="List of medications to take at this time")
    instructions: Optional[str] = Field(None, description="Special instructions for this timing")


class MedicationTimingSchedule(BaseModel):
    """Complete medication timing schedule."""
    
    schedule: List[MedicationTimingSlot] = Field(default_factory=list, description="List of timing slots")
    general_instructions: Optional[str] = Field(None, description="General instructions for all medications")


class DoctorSuggestion(BaseModel):
    """Represents a doctor suggestion."""
    
    specialty: str = Field(..., description="Medical specialty")
    reason: str = Field(..., description="Reason for consultation")
    priority: str = Field(..., description="Priority level: high, medium, or low")


class HospitalSuggestion(BaseModel):
    """Represents a hospital or facility suggestion."""
    
    facility_type: str = Field(..., description="Type of facility (e.g., hospital, clinic, lab)")
    purpose: str = Field(..., description="Purpose of visit")
    urgency: str = Field(..., description="Urgency level: urgent, soon, or routine")


class HospitalDoctorSuggestions(BaseModel):
    """Hospital and doctor suggestions."""
    
    doctors: List[DoctorSuggestion] = Field(default_factory=list, description="List of doctor suggestions")
    hospitals: List[HospitalSuggestion] = Field(default_factory=list, description="List of hospital suggestions")


class RedFlagInsight(BaseModel):
    """Represents a red flag insight."""
    
    category: str = Field(..., description="Category of the red flag")
    description: str = Field(..., description="Description of the concern")
    severity: str = Field(..., description="Severity level: critical, high, medium, or low")
    recommendation: str = Field(..., description="Recommended action")


class AdditionalInsights(BaseModel):
    """Additional red-flag insights and warnings."""
    
    red_flags: List[RedFlagInsight] = Field(default_factory=list, description="List of red flag insights")
    general_advice: Optional[str] = Field(None, description="General medical advice")


class AnalysisResult(BaseModel):
    """Complete analysis result from the medical agent."""
    
    prescription_summary: PrescriptionSummary = Field(..., description="Summary of all prescriptions")
    medication_timing: MedicationTimingSchedule = Field(..., description="Medication timing schedule")
    suggestions: HospitalDoctorSuggestions = Field(..., description="Hospital and doctor suggestions")
    additional_insights: AdditionalInsights = Field(..., description="Additional red-flag insights")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "prescription_summary": {
                    "items": [
                        {
                            "medication_name": "Amoxicillin",
                            "dosage": "500mg",
                            "frequency": "3 times daily",
                            "duration": "7 days",
                            "notes": "Take with food"
                        }
                    ],
                    "total_medications": 1
                },
                "medication_timing": {
                    "schedule": [
                        {
                            "time": "08:00 AM",
                            "medications": ["Amoxicillin 500mg"],
                            "instructions": "Take with breakfast"
                        }
                    ],
                    "general_instructions": "Take all medications with food"
                },
                "suggestions": {
                    "doctors": [
                        {
                            "specialty": "General Practitioner",
                            "reason": "Follow-up consultation",
                            "priority": "medium"
                        }
                    ],
                    "hospitals": []
                },
                "additional_insights": {
                    "red_flags": [],
                    "general_advice": "Complete the full course of antibiotics"
                }
            }
        }
    )
