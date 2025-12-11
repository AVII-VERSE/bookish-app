"""
Acceptance tests for the Medical Agent Service.

Verifies that the service meets all acceptance criteria:
- Accepts parsed document text
- Calls medical knowledge-base API (stubbed)
- Generates structured insights with all required components
- Produces deterministic, schema-compliant output
"""

import pytest
import json
from backend.app.schemas import ParsedDocument, AnalysisResult
from backend.app.services.medical_agent import analyze_document


class TestAcceptanceCriteria:
    """Test acceptance criteria for the medical agent service."""
    
    def test_accepts_parsed_document_text(self):
        """Verify the service accepts ParsedDocument as input."""
        parsed = ParsedDocument(
            text="Patient prescribed Metformin 500mg twice daily.",
            metadata={"test": "acceptance"}
        )
        
        result = analyze_document(parsed)
        
        assert result is not None
        assert isinstance(result, AnalysisResult)
    
    def test_calls_knowledge_base_api_for_cross_references(self):
        """Verify the service calls the knowledge base client for cross-references."""
        parsed = ParsedDocument(
            text="Patient on Warfarin and Amoxicillin.",
            metadata={}
        )
        
        result = analyze_document(parsed)
        
        assert result.additional_insights.red_flags is not None
        drug_interaction_found = any(
            "interaction" in flag.category.lower()
            for flag in result.additional_insights.red_flags
        )
        assert drug_interaction_found, "Knowledge base should identify drug interaction"
    
    def test_generates_prescription_summary(self):
        """Verify the service generates prescription summary."""
        parsed = ParsedDocument(
            text="""
            Prescriptions:
            1. Amoxicillin 500mg three times daily for 7 days
            2. Ibuprofen 400mg twice daily as needed
            """,
            metadata={}
        )
        
        result = analyze_document(parsed)
        
        assert result.prescription_summary is not None
        assert result.prescription_summary.total_medications > 0
        assert len(result.prescription_summary.items) > 0
        
        for item in result.prescription_summary.items:
            assert item.medication_name is not None
            assert item.dosage is not None
            assert item.frequency is not None
    
    def test_generates_medication_timing_schedule(self):
        """Verify the service generates medication timing schedule."""
        parsed = ParsedDocument(
            text="Metformin 1000mg twice daily with meals.",
            metadata={}
        )
        
        result = analyze_document(parsed)
        
        assert result.medication_timing is not None
        assert result.medication_timing.schedule is not None
        assert len(result.medication_timing.schedule) > 0
        
        for slot in result.medication_timing.schedule:
            assert slot.time is not None
            assert len(slot.medications) > 0
        
        assert result.medication_timing.general_instructions is not None
    
    def test_generates_hospital_doctor_suggestions(self):
        """Verify the service generates hospital and doctor suggestions."""
        parsed = ParsedDocument(
            text="""
            Patient on Metformin for diabetes.
            Blood work needed in 3 months.
            Follow up with specialist.
            """,
            metadata={}
        )
        
        result = analyze_document(parsed)
        
        assert result.suggestions is not None
        assert result.suggestions.doctors is not None
        assert result.suggestions.hospitals is not None
        
        if len(result.suggestions.doctors) > 0:
            doctor = result.suggestions.doctors[0]
            assert doctor.specialty is not None
            assert doctor.reason is not None
            assert doctor.priority in ["low", "medium", "high"]
        
        if len(result.suggestions.hospitals) > 0:
            hospital = result.suggestions.hospitals[0]
            assert hospital.facility_type is not None
            assert hospital.purpose is not None
            assert hospital.urgency in ["routine", "soon", "urgent"]
    
    def test_generates_additional_red_flag_insights(self):
        """Verify the service generates additional red-flag insights."""
        parsed = ParsedDocument(
            text="""
            URGENT: Patient experiencing severe symptoms.
            Patient allergic to Penicillin.
            Immediate attention required.
            """,
            metadata={}
        )
        
        result = analyze_document(parsed)
        
        assert result.additional_insights is not None
        assert result.additional_insights.red_flags is not None
        assert len(result.additional_insights.red_flags) > 0
        
        for flag in result.additional_insights.red_flags:
            assert flag.category is not None
            assert flag.description is not None
            assert flag.severity in ["low", "medium", "high", "critical"]
            assert flag.recommendation is not None
        
        assert result.additional_insights.general_advice is not None
    
    def test_produces_deterministic_output(self):
        """Verify the service produces deterministic output for the same input."""
        parsed = ParsedDocument(
            text="Lisinopril 10mg once daily for blood pressure.",
            metadata={"patient_id": "TEST123"}
        )
        
        result1 = analyze_document(parsed)
        result2 = analyze_document(parsed)
        result3 = analyze_document(parsed)
        
        assert result1.prescription_summary.total_medications == result2.prescription_summary.total_medications
        assert result2.prescription_summary.total_medications == result3.prescription_summary.total_medications
        
        assert len(result1.medication_timing.schedule) == len(result2.medication_timing.schedule)
        assert len(result2.medication_timing.schedule) == len(result3.medication_timing.schedule)
        
        json1 = result1.model_dump_json()
        json2 = result2.model_dump_json()
        json3 = result3.model_dump_json()
        
        assert json1 == json2 == json3, "Output should be deterministic"
    
    def test_produces_schema_compliant_output(self):
        """Verify the service produces schema-compliant output."""
        parsed = ParsedDocument(
            text="Atorvastatin 20mg once daily at bedtime.",
            metadata={}
        )
        
        result = analyze_document(parsed)
        
        result_dict = result.model_dump()
        
        assert "prescription_summary" in result_dict
        assert "medication_timing" in result_dict
        assert "suggestions" in result_dict
        assert "additional_insights" in result_dict
        
        assert "items" in result_dict["prescription_summary"]
        assert "total_medications" in result_dict["prescription_summary"]
        assert isinstance(result_dict["prescription_summary"]["total_medications"], int)
        
        assert "schedule" in result_dict["medication_timing"]
        assert isinstance(result_dict["medication_timing"]["schedule"], list)
        
        assert "doctors" in result_dict["suggestions"]
        assert "hospitals" in result_dict["suggestions"]
        assert isinstance(result_dict["suggestions"]["doctors"], list)
        assert isinstance(result_dict["suggestions"]["hospitals"], list)
        
        assert "red_flags" in result_dict["additional_insights"]
        assert isinstance(result_dict["additional_insights"]["red_flags"], list)
        
        json_str = result.model_dump_json()
        parsed_json = json.loads(json_str)
        assert parsed_json is not None, "Output should be valid JSON"
    
    def test_handles_complex_real_world_example(self):
        """Verify the service handles complex, real-world medical documents."""
        parsed = ParsedDocument(
            text="""
            MEDICAL PRESCRIPTION
            Patient: Jane Doe (DOB: 1975-05-15)
            Date: 2024-01-20
            Doctor: Dr. Smith, Internal Medicine
            
            CURRENT MEDICATIONS:
            1. Metformin 1000mg - Take twice daily with breakfast and dinner for diabetes
            2. Lisinopril 10mg - Take once daily in the morning for hypertension
            3. Atorvastatin 20mg - Take once daily at bedtime for high cholesterol
            4. Aspirin 81mg - Take once daily in the morning for cardiovascular protection
            5. Omeprazole 20mg - Take once daily before breakfast for GERD
            
            INSTRUCTIONS:
            - Monitor blood glucose levels daily, target range 80-130 mg/dL
            - Check blood pressure weekly, target <130/80 mmHg
            - Avoid grapefruit and grapefruit juice (interaction with Atorvastatin)
            - Take all medications with full glass of water
            
            FOLLOW-UP:
            - Schedule appointment with endocrinologist in 3 months
            - Lab work needed: HbA1c, lipid panel, kidney function tests
            - Follow up with cardiologist for annual check-up
            
            ALLERGIES:
            - Penicillin (rash)
            - Sulfa drugs (severe reaction)
            
            WARNINGS:
            - Patient on multiple medications - monitor for interactions
            - Check kidney function regularly due to Metformin and Lisinopril
            - Report any muscle pain (statin side effect) immediately
            """,
            metadata={
                "patient_id": "JD-1975",
                "doctor": "Dr. Smith",
                "date": "2024-01-20",
                "facility": "City Medical Center"
            }
        )
        
        result = analyze_document(parsed)
        
        assert result.prescription_summary.total_medications >= 3
        
        assert len(result.medication_timing.schedule) >= 2
        
        assert len(result.suggestions.doctors) >= 1
        specialist_found = any(
            spec in doc.specialty.lower()
            for doc in result.suggestions.doctors
            for spec in ["endocrinologist", "cardiologist", "general"]
        )
        assert specialist_found
        
        assert len(result.additional_insights.red_flags) >= 2
        
        has_allergy_flag = any(
            "allerg" in flag.category.lower()
            for flag in result.additional_insights.red_flags
        )
        assert has_allergy_flag, "Should detect allergy information"
        
        has_polypharmacy_flag = any(
            "poly" in flag.category.lower() or "multiple" in flag.description.lower()
            for flag in result.additional_insights.red_flags
        )
        assert has_polypharmacy_flag, "Should detect polypharmacy concern"
        
        json_output = result.model_dump_json(indent=2)
        assert len(json_output) > 100, "Should produce substantial output"
    
    def test_all_required_components_present(self):
        """Verify all four required components are present in the output."""
        parsed = ParsedDocument(
            text="Amoxicillin 500mg three times daily for bacterial infection.",
            metadata={}
        )
        
        result = analyze_document(parsed)
        
        assert result.prescription_summary is not None, "Component 1: Prescription summary must be present"
        assert result.medication_timing is not None, "Component 2: Medication timing schedule must be present"
        assert result.suggestions is not None, "Component 3: Hospital/doctor suggestions must be present"
        assert result.additional_insights is not None, "Component 4: Additional insights must be present"
        
        assert result.prescription_summary.items is not None
        assert result.medication_timing.schedule is not None
        assert result.suggestions.doctors is not None
        assert result.suggestions.hospitals is not None
        assert result.additional_insights.red_flags is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
