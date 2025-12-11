import re
from typing import List, Dict, Any
from ..models.analysis import (
    Medication,
    HospitalRecommendation,
    Alert,
)


class MedicalAgentError(Exception):
    pass


class MedicalAgent:
    
    URGENCY_KEYWORDS = {
        "critical": ["emergency", "urgent", "immediate", "critical", "asap", "stat"],
        "high": ["soon", "important", "significant", "serious", "severe"],
        "medium": ["recommended", "advised", "suggested", "follow-up"],
        "low": ["optional", "if needed", "as needed", "prn"]
    }
    
    WARNING_KEYWORDS = [
        "allergy", "allergic", "contraindication", "warning", "caution",
        "side effect", "adverse", "interaction", "avoid", "do not"
    ]
    
    CRITICAL_CONDITIONS = [
        "chest pain", "difficulty breathing", "severe bleeding", "stroke",
        "heart attack", "seizure", "unconscious", "severe pain"
    ]

    @staticmethod
    def extract_summary(text: str) -> str:
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        if not lines:
            return "No content available for summary."
        
        summary_indicators = ["summary", "diagnosis", "chief complaint", "impression", "assessment"]
        summary_section = []
        in_summary = False
        
        for i, line in enumerate(lines):
            line_lower = line.lower()
            if any(indicator in line_lower for indicator in summary_indicators):
                in_summary = True
                if ':' in line:
                    summary_section.append(line.split(':', 1)[1].strip())
                continue
            
            if in_summary:
                if line.isupper() or (i > 0 and len(line) < 50 and line.endswith(':')):
                    break
                summary_section.append(line)
                if len(summary_section) >= 5:
                    break
        
        if summary_section:
            summary = " ".join(summary_section[:3])
        else:
            summary = " ".join(lines[:3])
        
        if len(summary) > 500:
            summary = summary[:497] + "..."
        
        return summary or "Medical document processed. Please review the detailed analysis below."

    @staticmethod
    def extract_medications(text: str) -> List[Medication]:
        medications = []
        lines = text.split('\n')
        
        medication_section = False
        medication_keywords = ["medication", "prescription", "drug", "rx:", "treatment plan"]
        
        common_medications = [
            "aspirin", "ibuprofen", "acetaminophen", "paracetamol", "metformin",
            "lisinopril", "amlodipine", "metoprolol", "atorvastatin", "simvastatin",
            "omeprazole", "levothyroxine", "albuterol", "gabapentin", "losartan",
            "hydrochlorothiazide", "insulin", "warfarin", "prednisone", "amoxicillin"
        ]
        
        dosage_pattern = re.compile(r'\d+\s*(?:mg|mcg|g|ml|units?|tablets?|capsules?)', re.IGNORECASE)
        frequency_pattern = re.compile(
            r'(?:once|twice|three times?|four times?|\d+\s*times?)\s*(?:daily|per day|a day|daily|weekly|monthly)|'
            r'(?:q\d+h|qd|bid|tid|qid|prn)',
            re.IGNORECASE
        )
        
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            if any(keyword in line_lower for keyword in medication_keywords):
                medication_section = True
                continue
            
            if medication_section and (line.strip() == '' or line.isupper()):
                if i > 0 and len(medications) > 0:
                    medication_section = False
                continue
            
            has_medication = any(med in line_lower for med in common_medications)
            has_dosage = dosage_pattern.search(line)
            
            if has_medication or (medication_section and has_dosage):
                dosage_match = dosage_pattern.search(line)
                frequency_match = frequency_pattern.search(line)
                
                name_part = line.split('-')[0].split(':')[-1].strip()
                if dosage_match:
                    name_part = line[:dosage_match.start()].strip()
                    name_part = re.sub(r'^\W+|\W+$', '', name_part)
                
                medication = Medication(
                    name=name_part[:100] if name_part else "Unspecified medication",
                    dosage=dosage_match.group(0) if dosage_match else "As prescribed",
                    frequency=frequency_match.group(0) if frequency_match else "As directed",
                    timing=None,
                    duration=None,
                    notes=None
                )
                
                if "with food" in line_lower or "with meal" in line_lower:
                    medication.timing = "with meals"
                elif "before bed" in line_lower or "bedtime" in line_lower:
                    medication.timing = "before bed"
                elif "morning" in line_lower:
                    medication.timing = "in the morning"
                
                if "days" in line_lower:
                    duration_match = re.search(r'(\d+)\s*days?', line_lower)
                    if duration_match:
                        medication.duration = f"{duration_match.group(1)} days"
                elif "weeks" in line_lower:
                    duration_match = re.search(r'(\d+)\s*weeks?', line_lower)
                    if duration_match:
                        medication.duration = f"{duration_match.group(1)} weeks"
                
                medications.append(medication)
                
                if len(medications) >= 20:
                    break
        
        return medications

    @staticmethod
    def extract_hospital_recommendations(text: str) -> List[HospitalRecommendation]:
        recommendations = []
        text_lower = text.lower()
        
        specialties = {
            "cardiology": ["heart", "cardiac", "cardio", "chest pain", "blood pressure"],
            "neurology": ["brain", "neuro", "headache", "migraine", "seizure", "stroke"],
            "orthopedics": ["bone", "joint", "fracture", "orthopedic", "sprain"],
            "gastroenterology": ["stomach", "digestive", "gastro", "intestin", "liver"],
            "pulmonology": ["lung", "respiratory", "breathing", "pulmonary", "asthma"],
            "endocrinology": ["diabetes", "thyroid", "hormone", "endocrine"],
            "dermatology": ["skin", "rash", "dermat"],
            "general medicine": ["follow-up", "check-up", "routine", "physical exam"]
        }
        
        for specialty, keywords in specialties.items():
            if any(keyword in text_lower for keyword in keywords):
                urgency = "medium"
                reason = f"Based on mentioned {keywords[0]}-related concerns"
                
                for urgency_level, urgency_keywords in MedicalAgent.URGENCY_KEYWORDS.items():
                    if any(uk in text_lower for uk in urgency_keywords):
                        urgency = urgency_level
                        break
                
                if specialty == "general medicine" and urgency == "medium":
                    urgency = "low"
                
                recommendations.append(
                    HospitalRecommendation(
                        specialty=specialty.title(),
                        reason=reason,
                        urgency=urgency,
                        notes="Please consult with a healthcare provider for proper evaluation"
                    )
                )
        
        follow_up_pattern = re.compile(
            r'follow[- ]up|return|revisit|see (?:doctor|physician)|schedule (?:appointment|visit)',
            re.IGNORECASE
        )
        
        if follow_up_pattern.search(text) and not any(r.specialty == "General Medicine" for r in recommendations):
            urgency = "low"
            if any(keyword in text_lower for keyword in MedicalAgent.URGENCY_KEYWORDS["high"]):
                urgency = "high"
            elif any(keyword in text_lower for keyword in MedicalAgent.URGENCY_KEYWORDS["critical"]):
                urgency = "critical"
            
            recommendations.append(
                HospitalRecommendation(
                    specialty="General Medicine",
                    reason="Follow-up appointment recommended",
                    urgency=urgency,
                    notes="Please schedule a follow-up visit as advised by your healthcare provider"
                )
            )
        
        return recommendations[:10]

    @staticmethod
    def extract_alerts(text: str) -> List[Alert]:
        alerts = []
        text_lower = text.lower()
        
        for condition in MedicalAgent.CRITICAL_CONDITIONS:
            if condition in text_lower:
                alerts.append(
                    Alert(
                        level="critical",
                        message=f"Document mentions {condition}. Seek immediate medical attention if experiencing these symptoms.",
                        category="critical_condition"
                    )
                )
        
        for warning_keyword in MedicalAgent.WARNING_KEYWORDS:
            if warning_keyword in text_lower:
                level = "danger" if warning_keyword in ["allergy", "contraindication", "avoid", "do not"] else "warning"
                
                context_start = max(0, text_lower.find(warning_keyword) - 50)
                context_end = min(len(text), text_lower.find(warning_keyword) + 100)
                context = text[context_start:context_end].strip()
                
                if len(context) > 150:
                    context = context[:147] + "..."
                
                alerts.append(
                    Alert(
                        level=level,
                        message=f"Important: {warning_keyword.title()} mentioned - {context}",
                        category=warning_keyword.replace(" ", "_")
                    )
                )
        
        drug_interaction_pattern = re.compile(r'drug interaction|medication interaction|interaction with', re.IGNORECASE)
        if drug_interaction_pattern.search(text):
            alerts.append(
                Alert(
                    level="danger",
                    message="Potential drug interaction noted. Consult your pharmacist or doctor before taking multiple medications.",
                    category="drug_interaction"
                )
            )
        
        if "expired" in text_lower or "expiration" in text_lower:
            alerts.append(
                Alert(
                    level="warning",
                    message="Check medication expiration dates. Do not use expired medications.",
                    category="expiration"
                )
            )
        
        return alerts[:15]

    @staticmethod
    async def analyze_medical_document(text: str) -> Dict[str, Any]:
        if not text or len(text.strip()) < 10:
            raise MedicalAgentError("Insufficient content for medical analysis. Please provide a more detailed document.")
        
        try:
            summary = MedicalAgent.extract_summary(text)
            medications = MedicalAgent.extract_medications(text)
            recommendations = MedicalAgent.extract_hospital_recommendations(text)
            alerts = MedicalAgent.extract_alerts(text)
            
            if not any([medications, recommendations, alerts]):
                alerts.append(
                    Alert(
                        level="info",
                        message="No specific medical information (medications, recommendations, or warnings) was detected in the document. Please ensure the document contains relevant medical content.",
                        category="no_data"
                    )
                )
            
            return {
                "summary": summary,
                "medications": medications,
                "hospital_recommendations": recommendations,
                "alerts": alerts
            }
        
        except Exception as e:
            raise MedicalAgentError(f"Error analyzing medical document: {str(e)}")
