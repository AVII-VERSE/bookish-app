import pytest
import io
from fastapi.testclient import TestClient
from PyPDF2 import PdfWriter
from PIL import Image

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app

client = TestClient(app)


def create_test_pdf_with_text(text: str) -> bytes:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    
    y_position = 750
    for line in text.split('\n'):
        c.drawString(100, y_position, line)
        y_position -= 20
        if y_position < 50:
            c.showPage()
            y_position = 750
    
    c.save()
    buffer.seek(0)
    return buffer.read()


def create_test_image() -> bytes:
    img = Image.new('RGB', (800, 600), color='white')
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    return buffer.read()


class TestAnalysisEndpoint:
    
    def test_health_check(self):
        response = client.get("/analysis/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        assert "Medical Document Analysis API" in response.json()["message"]
    
    def test_analyze_with_no_input(self):
        response = client.post("/analysis/analyze")
        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "provide either a file" in data["error"].lower()
    
    def test_analyze_with_both_file_and_text(self):
        test_text = "Some medical text"
        test_image = create_test_image()
        
        response = client.post(
            "/analysis/analyze",
            data={"text": test_text},
            files={"file": ("test.png", test_image, "image/png")}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "either a file or text" in data["error"].lower()
    
    def test_analyze_with_text_input_happy_path(self):
        medical_text = """
        MEDICAL REPORT
        
        Patient: John Doe
        Date: 2024-01-15
        
        DIAGNOSIS: Type 2 Diabetes Mellitus
        
        MEDICATIONS:
        1. Metformin 500mg - Take twice daily with meals
        2. Aspirin 81mg - Take once daily in the morning
        
        RECOMMENDATIONS:
        - Follow-up with endocrinology in 3 months
        - Monitor blood glucose levels daily
        
        WARNINGS:
        - Allergy to Penicillin noted
        - Avoid alcohol while taking Metformin
        """
        
        response = client.post(
            "/analysis/analyze",
            data={"text": medical_text}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert data["summary"] is not None
        assert len(data["summary"]) > 0
        
        assert "medications" in data
        assert len(data["medications"]) >= 1
        
        assert "hospital_recommendations" in data
        assert "alerts" in data
        
        assert "metadata" in data
        metadata = data["metadata"]
        assert metadata["source_type"] == "text"
        assert metadata["duration_ms"] > 0
        assert metadata["file_size_bytes"] > 0
        
        assert "progress_states" in metadata
        assert len(metadata["progress_states"]) > 0
        assert metadata["progress_states"][-1]["progress"] == 100
    
    def test_analyze_with_empty_text(self):
        response = client.post(
            "/analysis/analyze",
            data={"text": "   "}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "empty" in data["error"].lower()
    
    def test_analyze_with_image_file(self):
        test_image = create_test_image()
        
        response = client.post(
            "/analysis/analyze",
            files={"file": ("medical_report.png", test_image, "image/png")}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert data["metadata"]["source_type"] == "image"
        assert data["metadata"]["file_size_bytes"] > 0
        
        has_info_alert = any(
            alert["level"] == "info" and "no specific medical information" in alert["message"].lower()
            for alert in data["alerts"]
        )
        assert has_info_alert or len(data["summary"]) > 0
    
    def test_analyze_medications_extraction(self):
        medical_text = """
        PRESCRIPTION
        
        1. Lisinopril 10mg - Take once daily in the morning for blood pressure
        2. Atorvastatin 20mg - Take once daily at bedtime for cholesterol
        3. Metformin 850mg - Take twice daily with meals for 30 days
        """
        
        response = client.post(
            "/analysis/analyze",
            data={"text": medical_text}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        medications = data["medications"]
        assert len(medications) >= 1
        
        for med in medications:
            assert "name" in med
            assert "dosage" in med
            assert "frequency" in med
    
    def test_analyze_alerts_extraction(self):
        medical_text = """
        PATIENT ALERT
        
        WARNING: Patient has documented allergy to Penicillin
        CAUTION: Drug interaction possible with current medications
        NOTE: Severe bleeding reported - seek immediate attention
        """
        
        response = client.post(
            "/analysis/analyze",
            data={"text": medical_text}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        alerts = data["alerts"]
        assert len(alerts) >= 1
        
        alert_levels = [alert["level"] for alert in alerts]
        assert any(level in ["warning", "danger", "critical"] for level in alert_levels)
    
    def test_analyze_hospital_recommendations_extraction(self):
        medical_text = """
        RECOMMENDATIONS
        
        1. Urgent cardiology consultation for chest pain evaluation
        2. Follow-up with primary care in 2 weeks
        3. Immediate neurology referral for stroke symptoms
        """
        
        response = client.post(
            "/analysis/analyze",
            data={"text": medical_text}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        recommendations = data["hospital_recommendations"]
        assert len(recommendations) >= 1
        
        for rec in recommendations:
            assert "specialty" in rec
            assert "reason" in rec
            assert "urgency" in rec
            assert rec["urgency"] in ["low", "medium", "high", "critical"]
    
    def test_analyze_progress_states(self):
        medical_text = "Patient presents with mild headache. Prescribed Ibuprofen 400mg."
        
        response = client.post(
            "/analysis/analyze",
            data={"text": medical_text}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        progress_states = data["metadata"]["progress_states"]
        assert len(progress_states) > 0
        
        stages = [ps["stage"] for ps in progress_states]
        assert "validation" in stages
        assert "complete" in stages
        
        progresses = [ps["progress"] for ps in progress_states]
        assert 0 in progresses or 10 in progresses
        assert 100 in progresses
        
        for ps in progress_states:
            assert 0 <= ps["progress"] <= 100
            assert len(ps["message"]) > 0
    
    def test_analyze_with_minimal_medical_content(self):
        medical_text = "Patient visited today."
        
        response = client.post(
            "/analysis/analyze",
            data={"text": medical_text}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        
        has_info_alert = any(
            alert["level"] == "info" and "no specific medical information" in alert["message"].lower()
            for alert in data["alerts"]
        )
        assert has_info_alert or len(data["medications"]) == 0
    
    def test_analyze_response_structure(self):
        medical_text = "Medical report with diagnosis and treatment plan."
        
        response = client.post(
            "/analysis/analyze",
            data={"text": medical_text}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        required_fields = [
            "success", "summary", "medications", "hospital_recommendations",
            "alerts", "metadata"
        ]
        for field in required_fields:
            assert field in data
        
        metadata = data["metadata"]
        required_metadata_fields = [
            "duration_ms", "source_type", "file_size_bytes", "processed_at", "progress_states"
        ]
        for field in required_metadata_fields:
            assert field in metadata


class TestErrorHandling:
    
    def test_too_large_text(self):
        large_text = "A" * 200000
        
        response = client.post(
            "/analysis/analyze",
            data={"text": large_text}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "too long" in data["error"].lower()
    
    def test_unsupported_file_type(self):
        fake_file = b"This is not a valid image or PDF"
        
        response = client.post(
            "/analysis/analyze",
            files={"file": ("test.txt", fake_file, "text/plain")}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "unsupported" in data["error"].lower()
    
    def test_empty_file(self):
        empty_file = b""
        
        response = client.post(
            "/analysis/analyze",
            files={"file": ("empty.pdf", empty_file, "application/pdf")}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "empty" in data["error"].lower()


class TestPDFAnalysis:
    
    @pytest.mark.skipif(
        not hasattr(sys.modules.get('reportlab', None), 'pdfgen'),
        reason="reportlab not installed"
    )
    def test_analyze_with_pdf_file(self):
        medical_text = """
        MEDICAL REPORT
        Patient: Jane Smith
        Diagnosis: Hypertension
        Medication: Lisinopril 10mg daily
        """
        
        try:
            pdf_content = create_test_pdf_with_text(medical_text)
            
            response = client.post(
                "/analysis/analyze",
                files={"file": ("medical_report.pdf", pdf_content, "application/pdf")}
            )
            
            assert response.status_code == 200
            data = response.json()
            
            assert data["success"] is True
            assert data["metadata"]["source_type"] == "pdf"
            assert data["metadata"]["page_count"] is not None
            assert data["metadata"]["page_count"] >= 1
            
        except ImportError:
            pytest.skip("reportlab not available for PDF generation")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
