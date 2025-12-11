from typing import Dict, List
import re
from langchain_core.prompts import PromptTemplate

from backend.app.schemas import (
    ParsedDocument,
    AnalysisResult,
    PrescriptionSummary,
    PrescriptionItem,
    MedicationTimingSchedule,
    MedicationTimingSlot,
    HospitalDoctorSuggestions,
    DoctorSuggestion,
    HospitalSuggestion,
    AdditionalInsights,
    RedFlagInsight,
)
from backend.app.services.knowledge_base_client import MedicalKnowledgeBaseClient


class MedicalAnalysisAgent:
    """
    Medical document analysis agent using LangChain for workflow orchestration.
    Analyzes parsed medical documents and generates structured insights.
    """
    
    def __init__(self, knowledge_base_client: MedicalKnowledgeBaseClient = None):
        """
        Initialize the medical analysis agent.
        
        Args:
            knowledge_base_client: Optional medical knowledge base client for cross-references
        """
        self.kb_client = knowledge_base_client or MedicalKnowledgeBaseClient()
        self._setup_prompts()
    
    def _setup_prompts(self):
        """Setup prompt templates for different analysis tasks."""
        
        self.prescription_extraction_prompt = PromptTemplate(
            input_variables=["document_text"],
            template="""Analyze the following medical document and extract all prescription information.
For each medication, identify:
- Medication name
- Dosage
- Frequency
- Duration (if mentioned)
- Special notes or instructions

Document:
{document_text}

Return the prescriptions in a structured format.
"""
        )
        
        self.timing_schedule_prompt = PromptTemplate(
            input_variables=["prescriptions", "document_text"],
            template="""Based on the following prescriptions, create a daily medication timing schedule.
Group medications by time of day (morning, afternoon, evening, night) and provide specific times.

Prescriptions:
{prescriptions}

Document context:
{document_text}

Create a detailed timing schedule.
"""
        )
        
        self.suggestions_prompt = PromptTemplate(
            input_variables=["document_text", "medications"],
            template="""Based on the medical document and medications, suggest:
1. Which medical specialists the patient should consult
2. Any hospital visits or tests needed
3. Priority level for each suggestion

Document:
{document_text}

Medications:
{medications}

Provide doctor and hospital suggestions.
"""
        )
        
        self.insights_prompt = PromptTemplate(
            input_variables=["document_text", "medications", "interactions"],
            template="""Analyze the medical document for red flags and important insights:
- Drug interactions
- Contraindications
- Urgency indicators
- Safety concerns
- Special precautions

Document:
{document_text}

Medications:
{medications}

Known interactions:
{interactions}

Identify all red flags and provide recommendations.
"""
        )
    
    def _extract_medications_from_text(self, text: str) -> List[str]:
        """
        Extract medication names from document text using pattern matching.
        
        Args:
            text: Document text
            
        Returns:
            List of medication names
        """
        medications = []
        text_lower = text.lower()
        
        common_medications = [
            "amoxicillin", "metformin", "lisinopril", "atorvastatin",
            "aspirin", "ibuprofen", "acetaminophen", "omeprazole",
            "levothyroxine", "amlodipine", "losartan", "gabapentin"
        ]
        
        for med in common_medications:
            if med in text_lower:
                medications.append(med.capitalize())
        
        medication_patterns = [
            r'\b([A-Z][a-z]+(?:ol|in|ide|one|ate|mine|pril|sartan|statin))\b',
            r'(?:^|\n|\. )([A-Z][a-z]{4,})\s+\d+\s*mg',
        ]
        
        for pattern in medication_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                if match not in medications:
                    medications.append(match)
        
        return medications if medications else ["Unknown Medication"]
    
    def _parse_prescription_details(self, text: str, medications: List[str]) -> List[PrescriptionItem]:
        """
        Parse detailed prescription information from text.
        
        Args:
            text: Document text
            medications: List of medication names
            
        Returns:
            List of PrescriptionItem objects
        """
        prescriptions = []
        
        for med in medications:
            dosage_match = re.search(
                rf'{med}[:\s]+(\d+\s*(?:mg|g|ml|mcg))',
                text,
                re.IGNORECASE
            )
            dosage = dosage_match.group(1) if dosage_match else "As prescribed"
            
            frequency_patterns = [
                r'(\d+\s*(?:times?|x)\s*(?:daily|per day|a day))',
                r'(once|twice|three times)\s*(?:daily|per day|a day)',
                r'(every\s+\d+\s+hours)',
            ]
            frequency = "As directed"
            for pattern in frequency_patterns:
                freq_match = re.search(pattern, text, re.IGNORECASE)
                if freq_match:
                    frequency = freq_match.group(1)
                    break
            
            duration_match = re.search(
                r'for\s+(\d+\s+(?:days?|weeks?|months?))',
                text,
                re.IGNORECASE
            )
            duration = duration_match.group(1) if duration_match else None
            
            med_info = self.kb_client.get_medication_info(med)
            notes = ", ".join(med_info.get("precautions", [])) if med_info else None
            
            prescriptions.append(PrescriptionItem(
                medication_name=med,
                dosage=dosage,
                frequency=frequency,
                duration=duration,
                notes=notes
            ))
        
        return prescriptions
    
    def _generate_timing_schedule(
        self,
        prescriptions: List[PrescriptionItem]
    ) -> MedicationTimingSchedule:
        """
        Generate a medication timing schedule from prescriptions.
        
        Args:
            prescriptions: List of prescription items
            
        Returns:
            MedicationTimingSchedule object
        """
        schedule_slots = {}
        
        for prescription in prescriptions:
            frequency = prescription.frequency.lower()
            med_label = f"{prescription.medication_name} {prescription.dosage}"
            
            if "once" in frequency or "1" in frequency:
                times = ["08:00 AM"]
            elif "twice" in frequency or "2" in frequency:
                times = ["08:00 AM", "08:00 PM"]
            elif "three times" in frequency or "3" in frequency or "thrice" in frequency:
                times = ["08:00 AM", "02:00 PM", "08:00 PM"]
            elif "four times" in frequency or "4" in frequency:
                times = ["08:00 AM", "12:00 PM", "04:00 PM", "08:00 PM"]
            elif "every" in frequency:
                hours_match = re.search(r'(\d+)\s*hours?', frequency)
                if hours_match:
                    hours = int(hours_match.group(1))
                    if hours == 6:
                        times = ["06:00 AM", "12:00 PM", "06:00 PM", "12:00 AM"]
                    elif hours == 8:
                        times = ["08:00 AM", "04:00 PM", "12:00 AM"]
                    elif hours == 12:
                        times = ["08:00 AM", "08:00 PM"]
                    else:
                        times = ["08:00 AM"]
                else:
                    times = ["08:00 AM"]
            else:
                times = ["08:00 AM"]
            
            for time in times:
                if time not in schedule_slots:
                    schedule_slots[time] = []
                schedule_slots[time].append(med_label)
        
        schedule = [
            MedicationTimingSlot(
                time=time,
                medications=meds,
                instructions="Take with water" if "AM" in time else "Take before bedtime" if "PM" in time else None
            )
            for time, meds in sorted(schedule_slots.items())
        ]
        
        return MedicationTimingSchedule(
            schedule=schedule,
            general_instructions="Follow prescribed schedule consistently. Take with food unless otherwise directed."
        )
    
    def _generate_suggestions(
        self,
        text: str,
        medications: List[str]
    ) -> HospitalDoctorSuggestions:
        """
        Generate hospital and doctor suggestions.
        
        Args:
            text: Document text
            medications: List of medications
            
        Returns:
            HospitalDoctorSuggestions object
        """
        specialty_recommendations = self.kb_client.get_specialty_recommendations(
            medications + [text]
        )
        
        doctors = [
            DoctorSuggestion(
                specialty=rec["specialty"],
                reason=rec["reason"],
                priority=rec["priority"]
            )
            for rec in specialty_recommendations
        ]
        
        hospitals = []
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["test", "lab", "blood work", "screening"]):
            hospitals.append(HospitalSuggestion(
                facility_type="Laboratory",
                purpose="Diagnostic tests and blood work",
                urgency="routine"
            ))
        
        if any(word in text_lower for word in ["x-ray", "mri", "ct scan", "imaging"]):
            hospitals.append(HospitalSuggestion(
                facility_type="Imaging Center",
                purpose="Medical imaging and diagnostics",
                urgency="soon"
            ))
        
        if any(word in text_lower for word in ["emergency", "urgent", "immediate"]):
            hospitals.append(HospitalSuggestion(
                facility_type="Emergency Department",
                purpose="Urgent medical attention",
                urgency="urgent"
            ))
        
        return HospitalDoctorSuggestions(doctors=doctors, hospitals=hospitals)
    
    def _generate_insights(
        self,
        text: str,
        medications: List[str]
    ) -> AdditionalInsights:
        """
        Generate additional insights and red flags.
        
        Args:
            text: Document text
            medications: List of medications
            
        Returns:
            AdditionalInsights object
        """
        red_flags_data = self.kb_client.identify_red_flags(text, medications)
        interactions_data = self.kb_client.check_interactions(medications)
        
        red_flags = [
            RedFlagInsight(
                category=flag["category"],
                description=flag["description"],
                severity=flag["severity"],
                recommendation=flag["recommendation"]
            )
            for flag in red_flags_data
        ]
        
        for interaction in interactions_data:
            red_flags.append(RedFlagInsight(
                category="Drug Interaction",
                description=f"Interaction between {', '.join(interaction['medications'])}: {interaction['description']}",
                severity=interaction["severity"],
                recommendation=interaction["action"]
            ))
        
        general_advice_parts = []
        if medications:
            general_advice_parts.append("Store all medications in a cool, dry place away from children.")
        if any("antibiotic" in text.lower() for _ in [1]):
            general_advice_parts.append("Complete the full course of antibiotics even if symptoms improve.")
        general_advice_parts.append("Keep a list of all medications and share with all healthcare providers.")
        
        return AdditionalInsights(
            red_flags=red_flags,
            general_advice=" ".join(general_advice_parts) if general_advice_parts else None
        )
    
    def analyze_document(self, parsed: ParsedDocument) -> AnalysisResult:
        """
        Main analysis workflow that processes a parsed medical document.
        
        Args:
            parsed: ParsedDocument containing the text and metadata
            
        Returns:
            AnalysisResult with all structured insights
        """
        text = parsed.text
        
        medications = self._extract_medications_from_text(text)
        
        prescriptions = self._parse_prescription_details(text, medications)
        
        prescription_summary = PrescriptionSummary(
            items=prescriptions,
            total_medications=len(prescriptions)
        )
        
        medication_timing = self._generate_timing_schedule(prescriptions)
        
        suggestions = self._generate_suggestions(text, medications)
        
        additional_insights = self._generate_insights(text, medications)
        
        return AnalysisResult(
            prescription_summary=prescription_summary,
            medication_timing=medication_timing,
            suggestions=suggestions,
            additional_insights=additional_insights
        )


def analyze_document(parsed: ParsedDocument) -> AnalysisResult:
    """
    Convenience function to analyze a parsed medical document.
    
    Args:
        parsed: ParsedDocument containing the text and metadata
        
    Returns:
        AnalysisResult with all structured insights
    """
    agent = MedicalAnalysisAgent()
    return agent.analyze_document(parsed)
