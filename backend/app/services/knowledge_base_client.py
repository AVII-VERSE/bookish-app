from typing import Dict, List, Optional
import json


class MedicalKnowledgeBaseClient:
    """Stubbed HTTP client for medical knowledge base API."""
    
    def __init__(self, base_url: str = "https://api.medical-kb.example.com"):
        self.base_url = base_url
        self._mock_data = self._initialize_mock_data()
    
    def _initialize_mock_data(self) -> Dict:
        """Initialize mock data for offline testing."""
        return {
            "medications": {
                "amoxicillin": {
                    "generic_name": "Amoxicillin",
                    "class": "Antibiotic",
                    "common_side_effects": ["Nausea", "Diarrhea", "Rash"],
                    "interactions": ["Warfarin", "Methotrexate"],
                    "precautions": ["Complete full course", "Take with food"]
                },
                "metformin": {
                    "generic_name": "Metformin",
                    "class": "Antidiabetic",
                    "common_side_effects": ["Nausea", "Diarrhea", "Abdominal pain"],
                    "interactions": ["Alcohol", "Contrast dyes"],
                    "precautions": ["Monitor blood sugar", "Take with meals"]
                },
                "lisinopril": {
                    "generic_name": "Lisinopril",
                    "class": "ACE Inhibitor",
                    "common_side_effects": ["Dizziness", "Cough", "Headache"],
                    "interactions": ["NSAIDs", "Potassium supplements"],
                    "precautions": ["Monitor blood pressure", "Check kidney function"]
                },
                "atorvastatin": {
                    "generic_name": "Atorvastatin",
                    "class": "Statin",
                    "common_side_effects": ["Muscle pain", "Liver enzyme elevation"],
                    "interactions": ["Grapefruit juice", "Fibrates"],
                    "precautions": ["Monitor liver function", "Report muscle pain"]
                }
            },
            "interactions": {
                "warfarin_amoxicillin": {
                    "severity": "moderate",
                    "description": "May increase anticoagulant effect"
                }
            }
        }
    
    def get_medication_info(self, medication_name: str) -> Optional[Dict]:
        """
        Get detailed information about a medication.
        
        Args:
            medication_name: Name of the medication
            
        Returns:
            Dictionary containing medication information or None if not found
        """
        normalized_name = medication_name.lower().strip()
        
        for key, data in self._mock_data["medications"].items():
            if key in normalized_name or normalized_name in key:
                return data
        
        return {
            "generic_name": medication_name,
            "class": "Unknown",
            "common_side_effects": [],
            "interactions": [],
            "precautions": ["Consult your doctor"]
        }
    
    def check_interactions(self, medications: List[str]) -> List[Dict]:
        """
        Check for drug interactions among a list of medications.
        
        Args:
            medications: List of medication names
            
        Returns:
            List of interaction warnings
        """
        interactions = []
        
        normalized_meds = [m.lower().strip() for m in medications]
        
        if "warfarin" in str(normalized_meds) and "amoxicillin" in str(normalized_meds):
            interactions.append({
                "medications": ["Warfarin", "Amoxicillin"],
                "severity": "moderate",
                "description": "May increase anticoagulant effect. Monitor INR closely.",
                "action": "Consult with prescribing physician"
            })
        
        if "metformin" in str(normalized_meds):
            for med in normalized_meds:
                if "contrast" in med or "dye" in med:
                    interactions.append({
                        "medications": ["Metformin", "Contrast dye"],
                        "severity": "high",
                        "description": "Risk of lactic acidosis. Discontinue metformin before procedure.",
                        "action": "Stop metformin 48 hours before contrast procedure"
                    })
        
        return interactions
    
    def get_specialty_recommendations(self, conditions: List[str]) -> List[Dict]:
        """
        Get specialist recommendations based on conditions or medications.
        
        Args:
            conditions: List of medical conditions or concerns
            
        Returns:
            List of specialist recommendations
        """
        recommendations = []
        conditions_str = " ".join(conditions).lower()
        
        if any(word in conditions_str for word in ["diabetes", "metformin", "blood sugar"]):
            recommendations.append({
                "specialty": "Endocrinologist",
                "reason": "Diabetes management and monitoring",
                "priority": "medium"
            })
        
        if any(word in conditions_str for word in ["heart", "blood pressure", "lisinopril", "atorvastatin"]):
            recommendations.append({
                "specialty": "Cardiologist",
                "reason": "Cardiovascular health monitoring",
                "priority": "medium"
            })
        
        if any(word in conditions_str for word in ["antibiotic", "infection", "amoxicillin"]):
            recommendations.append({
                "specialty": "General Practitioner",
                "reason": "Follow-up for infection treatment",
                "priority": "low"
            })
        
        return recommendations
    
    def identify_red_flags(self, text: str, medications: List[str]) -> List[Dict]:
        """
        Identify potential red flags in the medical document.
        
        Args:
            text: Full text of the document
            medications: List of medications
            
        Returns:
            List of red flag concerns
        """
        red_flags = []
        text_lower = text.lower()
        
        critical_keywords = ["severe", "emergency", "immediate", "urgent", "critical"]
        if any(keyword in text_lower for keyword in critical_keywords):
            red_flags.append({
                "category": "Urgency",
                "description": "Document contains urgent or critical terminology",
                "severity": "high",
                "recommendation": "Ensure immediate follow-up with healthcare provider"
            })
        
        allergy_keywords = ["allergy", "allergies", "allergic", "adverse reaction"]
        if any(keyword in text_lower for keyword in allergy_keywords):
            red_flags.append({
                "category": "Allergies",
                "description": "Allergies or adverse reactions mentioned",
                "severity": "high",
                "recommendation": "Verify current medications against known allergies"
            })
        
        if len(medications) > 5:
            red_flags.append({
                "category": "Polypharmacy",
                "description": f"Patient on {len(medications)} medications - potential for interactions",
                "severity": "medium",
                "recommendation": "Review medication list with pharmacist or physician"
            })
        
        contraindication_keywords = ["contraindicated", "should not", "avoid", "discontinue"]
        if any(keyword in text_lower for keyword in contraindication_keywords):
            red_flags.append({
                "category": "Contraindication",
                "description": "Potential contraindications mentioned in document",
                "severity": "high",
                "recommendation": "Review contraindications with prescribing physician immediately"
            })
        
        return red_flags
