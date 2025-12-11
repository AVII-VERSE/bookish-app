import pytest
from unittest.mock import Mock, patch

from backend.app.schemas import ParsedDocument, AnalysisResult
from backend.app.services.medical_agent import MedicalAnalysisAgent, analyze_document
from backend.app.services.knowledge_base_client import MedicalKnowledgeBaseClient


class TestMedicalKnowledgeBaseClient:
    """Tests for the medical knowledge base client."""
    
    def test_get_medication_info_found(self):
        client = MedicalKnowledgeBaseClient()
        info = client.get_medication_info("Amoxicillin")
        
        assert info is not None
        assert info["generic_name"] == "Amoxicillin"
        assert info["class"] == "Antibiotic"
        assert len(info["common_side_effects"]) > 0
    
    def test_get_medication_info_not_found(self):
        client = MedicalKnowledgeBaseClient()
        info = client.get_medication_info("UnknownMedication123")
        
        assert info is not None
        assert info["generic_name"] == "UnknownMedication123"
        assert info["class"] == "Unknown"
    
    def test_check_interactions_warfarin_amoxicillin(self):
        client = MedicalKnowledgeBaseClient()
        interactions = client.check_interactions(["Warfarin", "Amoxicillin"])
        
        assert len(interactions) > 0
        assert any("Warfarin" in str(i["medications"]) for i in interactions)
    
    def test_check_interactions_no_interactions(self):
        client = MedicalKnowledgeBaseClient()
        interactions = client.check_interactions(["Aspirin"])
        
        assert isinstance(interactions, list)
    
    def test_get_specialty_recommendations_diabetes(self):
        client = MedicalKnowledgeBaseClient()
        recommendations = client.get_specialty_recommendations(["diabetes", "metformin"])
        
        assert len(recommendations) > 0
        assert any(rec["specialty"] == "Endocrinologist" for rec in recommendations)
    
    def test_identify_red_flags_urgency(self):
        client = MedicalKnowledgeBaseClient()
        text = "This is an urgent case requiring immediate attention."
        red_flags = client.identify_red_flags(text, [])
        
        assert len(red_flags) > 0
        assert any(flag["category"] == "Urgency" for flag in red_flags)
    
    def test_identify_red_flags_allergy(self):
        client = MedicalKnowledgeBaseClient()
        text = "Patient has allergic reaction to penicillin."
        red_flags = client.identify_red_flags(text, [])
        
        assert len(red_flags) > 0
        assert any(flag["category"] == "Allergies" for flag in red_flags)
    
    def test_identify_red_flags_polypharmacy(self):
        client = MedicalKnowledgeBaseClient()
        medications = ["Med1", "Med2", "Med3", "Med4", "Med5", "Med6"]
        red_flags = client.identify_red_flags("Normal text", medications)
        
        assert len(red_flags) > 0
        assert any(flag["category"] == "Polypharmacy" for flag in red_flags)


class TestMedicalAnalysisAgent:
    """Tests for the medical analysis agent."""
    
    def test_initialization(self):
        agent = MedicalAnalysisAgent()
        assert agent.kb_client is not None
        assert agent.prescription_extraction_prompt is not None
    
    def test_initialization_with_custom_client(self):
        custom_client = MedicalKnowledgeBaseClient()
        agent = MedicalAnalysisAgent(knowledge_base_client=custom_client)
        assert agent.kb_client == custom_client
    
    def test_extract_medications_from_text(self):
        agent = MedicalAnalysisAgent()
        text = "Patient prescribed Amoxicillin 500mg and Metformin 1000mg."
        
        medications = agent._extract_medications_from_text(text)
        
        assert len(medications) > 0
        assert "Amoxicillin" in medications
        assert "Metformin" in medications
    
    def test_extract_medications_empty_text(self):
        agent = MedicalAnalysisAgent()
        text = "No medications mentioned here."
        
        medications = agent._extract_medications_from_text(text)
        
        assert len(medications) >= 1
    
    def test_parse_prescription_details(self):
        agent = MedicalAnalysisAgent()
        text = "Amoxicillin 500mg three times daily for 7 days."
        medications = ["Amoxicillin"]
        
        prescriptions = agent._parse_prescription_details(text, medications)
        
        assert len(prescriptions) == 1
        assert prescriptions[0].medication_name == "Amoxicillin"
        assert "500" in prescriptions[0].dosage
        assert prescriptions[0].duration == "7 days"
    
    def test_generate_timing_schedule_once_daily(self):
        agent = MedicalAnalysisAgent()
        from backend.app.schemas import PrescriptionItem
        
        prescriptions = [
            PrescriptionItem(
                medication_name="Medication A",
                dosage="100mg",
                frequency="once daily",
                duration="30 days"
            )
        ]
        
        schedule = agent._generate_timing_schedule(prescriptions)
        
        assert len(schedule.schedule) == 1
        assert schedule.schedule[0].time == "08:00 AM"
        assert len(schedule.schedule[0].medications) == 1
    
    def test_generate_timing_schedule_twice_daily(self):
        agent = MedicalAnalysisAgent()
        from backend.app.schemas import PrescriptionItem
        
        prescriptions = [
            PrescriptionItem(
                medication_name="Medication B",
                dosage="50mg",
                frequency="twice daily",
                duration="14 days"
            )
        ]
        
        schedule = agent._generate_timing_schedule(prescriptions)
        
        assert len(schedule.schedule) == 2
        times = [slot.time for slot in schedule.schedule]
        assert "08:00 AM" in times
        assert "08:00 PM" in times
    
    def test_generate_timing_schedule_three_times_daily(self):
        agent = MedicalAnalysisAgent()
        from backend.app.schemas import PrescriptionItem
        
        prescriptions = [
            PrescriptionItem(
                medication_name="Medication C",
                dosage="200mg",
                frequency="three times daily",
                duration="10 days"
            )
        ]
        
        schedule = agent._generate_timing_schedule(prescriptions)
        
        assert len(schedule.schedule) == 3
    
    def test_generate_suggestions_with_labs(self):
        agent = MedicalAnalysisAgent()
        text = "Patient needs blood work and lab tests."
        medications = ["Metformin"]
        
        suggestions = agent._generate_suggestions(text, medications)
        
        assert len(suggestions.doctors) >= 0
        assert len(suggestions.hospitals) >= 1
        assert any(h.facility_type == "Laboratory" for h in suggestions.hospitals)
    
    def test_generate_suggestions_emergency(self):
        agent = MedicalAnalysisAgent()
        text = "Emergency situation requiring immediate attention."
        medications = []
        
        suggestions = agent._generate_suggestions(text, medications)
        
        assert len(suggestions.hospitals) >= 1
        assert any(h.urgency == "urgent" for h in suggestions.hospitals)
    
    def test_generate_insights_with_interactions(self):
        agent = MedicalAnalysisAgent()
        text = "Patient taking multiple medications."
        medications = ["Warfarin", "Amoxicillin"]
        
        insights = agent._generate_insights(text, medications)
        
        assert insights.red_flags is not None
        assert len(insights.red_flags) >= 1
    
    def test_analyze_document_simple(self):
        agent = MedicalAnalysisAgent()
        parsed = ParsedDocument(
            text="Patient prescribed Amoxicillin 500mg three times daily for 7 days.",
            metadata={"source": "test"}
        )
        
        result = agent.analyze_document(parsed)
        
        assert isinstance(result, AnalysisResult)
        assert result.prescription_summary is not None
        assert result.medication_timing is not None
        assert result.suggestions is not None
        assert result.additional_insights is not None
    
    def test_analyze_document_complex(self):
        agent = MedicalAnalysisAgent()
        parsed = ParsedDocument(
            text="""
            Patient: John Doe
            Date: 2024-01-15
            
            Prescriptions:
            1. Metformin 1000mg twice daily for diabetes management
            2. Lisinopril 10mg once daily for blood pressure
            3. Atorvastatin 20mg once daily at bedtime
            
            Patient has allergic reaction to Penicillin.
            Blood work needed in 3 months.
            Follow up with cardiologist.
            """,
            metadata={"patient_id": "12345"}
        )
        
        result = agent.analyze_document(parsed)
        
        assert isinstance(result, AnalysisResult)
        assert result.prescription_summary.total_medications >= 1
        assert len(result.medication_timing.schedule) >= 1
        assert len(result.suggestions.doctors) >= 0
        assert len(result.additional_insights.red_flags) >= 1
    
    def test_analyze_document_with_red_flags(self):
        agent = MedicalAnalysisAgent()
        parsed = ParsedDocument(
            text="""
            URGENT: Patient experiencing severe chest pain.
            Emergency medication prescribed.
            Immediate follow-up required.
            Patient allergic to sulfa drugs.
            """,
            metadata={}
        )
        
        result = agent.analyze_document(parsed)
        
        assert len(result.additional_insights.red_flags) >= 2
        assert any(flag.category == "Urgency" for flag in result.additional_insights.red_flags)
        assert any(flag.category == "Allergies" for flag in result.additional_insights.red_flags)
    
    def test_analyze_document_deterministic_output(self):
        agent = MedicalAnalysisAgent()
        parsed = ParsedDocument(
            text="Amoxicillin 500mg three times daily for 7 days.",
            metadata={}
        )
        
        result1 = agent.analyze_document(parsed)
        result2 = agent.analyze_document(parsed)
        
        assert result1.prescription_summary.total_medications == result2.prescription_summary.total_medications
        assert len(result1.medication_timing.schedule) == len(result2.medication_timing.schedule)
    
    def test_analyze_document_schema_compliance(self):
        agent = MedicalAnalysisAgent()
        parsed = ParsedDocument(
            text="Lisinopril 10mg once daily.",
            metadata={}
        )
        
        result = agent.analyze_document(parsed)
        
        result_dict = result.model_dump()
        assert "prescription_summary" in result_dict
        assert "medication_timing" in result_dict
        assert "suggestions" in result_dict
        assert "additional_insights" in result_dict
        
        assert "items" in result_dict["prescription_summary"]
        assert "total_medications" in result_dict["prescription_summary"]
        assert "schedule" in result_dict["medication_timing"]
        assert "doctors" in result_dict["suggestions"]
        assert "hospitals" in result_dict["suggestions"]
        assert "red_flags" in result_dict["additional_insights"]


class TestConvenienceFunction:
    """Tests for the convenience function."""
    
    def test_analyze_document_function(self):
        parsed = ParsedDocument(
            text="Metformin 500mg twice daily.",
            metadata={}
        )
        
        result = analyze_document(parsed)
        
        assert isinstance(result, AnalysisResult)
        assert result.prescription_summary is not None
    
    def test_analyze_document_function_creates_new_agent(self):
        parsed1 = ParsedDocument(text="Test 1", metadata={})
        parsed2 = ParsedDocument(text="Test 2", metadata={})
        
        result1 = analyze_document(parsed1)
        result2 = analyze_document(parsed2)
        
        assert isinstance(result1, AnalysisResult)
        assert isinstance(result2, AnalysisResult)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
