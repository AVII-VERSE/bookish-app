#!/usr/bin/env python3
"""
Example usage of the Medical Document Analysis API.

This script demonstrates how to use the API with different input types.
"""

import requests
import json


API_URL = "http://localhost:8000/analysis/analyze"


def analyze_text_example():
    """Example of analyzing raw text."""
    print("=" * 80)
    print("Example 1: Analyzing Raw Text")
    print("=" * 80)
    
    medical_text = """
    MEDICAL REPORT
    
    Patient: John Doe
    Date: 2024-01-15
    
    DIAGNOSIS: Type 2 Diabetes Mellitus, Hypertension
    
    MEDICATIONS:
    1. Metformin 500mg - Take twice daily with meals for blood sugar control
    2. Lisinopril 10mg - Take once daily in the morning for blood pressure
    3. Aspirin 81mg - Take once daily for cardiovascular protection
    
    RECOMMENDATIONS:
    - Follow-up with endocrinology in 3 months
    - Monitor blood glucose levels daily
    - Schedule cardiology consultation for chest pain evaluation
    
    WARNINGS:
    - Patient has documented allergy to Penicillin
    - Avoid alcohol while taking Metformin
    - Check blood pressure weekly
    """
    
    response = requests.post(
        API_URL,
        data={"text": medical_text}
    )
    
    if response.status_code == 200:
        result = response.json()
        print("\n✓ Analysis successful!")
        print(f"\nSummary: {result['summary']}")
        print(f"\nMedications found: {len(result['medications'])}")
        for med in result['medications']:
            print(f"  - {med['name']}: {med['dosage']} {med['frequency']}")
        
        print(f"\nHospital Recommendations: {len(result['hospital_recommendations'])}")
        for rec in result['hospital_recommendations']:
            print(f"  - {rec['specialty']} ({rec['urgency']} urgency): {rec['reason']}")
        
        print(f"\nAlerts: {len(result['alerts'])}")
        for alert in result['alerts']:
            print(f"  - [{alert['level'].upper()}] {alert['message'][:80]}...")
        
        print(f"\nProcessing time: {result['metadata']['duration_ms']:.2f}ms")
        print(f"Progress stages: {len(result['metadata']['progress_states'])}")
    else:
        print(f"\n✗ Error: {response.status_code}")
        print(response.json())


def analyze_file_example(file_path):
    """Example of analyzing a file (PDF or image)."""
    print("\n" + "=" * 80)
    print(f"Example 2: Analyzing File: {file_path}")
    print("=" * 80)
    
    try:
        with open(file_path, 'rb') as f:
            files = {'file': (file_path, f)}
            response = requests.post(API_URL, files=files)
        
        if response.status_code == 200:
            result = response.json()
            print("\n✓ Analysis successful!")
            print(f"\nSource type: {result['metadata']['source_type']}")
            print(f"File size: {result['metadata']['file_size_bytes']} bytes")
            if result['metadata']['page_count']:
                print(f"Pages: {result['metadata']['page_count']}")
            
            print(f"\nSummary: {result['summary'][:200]}...")
            print(f"\nMedications: {len(result['medications'])}")
            print(f"Recommendations: {len(result['hospital_recommendations'])}")
            print(f"Alerts: {len(result['alerts'])}")
            print(f"\nProcessing time: {result['metadata']['duration_ms']:.2f}ms")
        else:
            print(f"\n✗ Error: {response.status_code}")
            print(response.json())
    
    except FileNotFoundError:
        print(f"\n✗ File not found: {file_path}")
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")


def check_health():
    """Check if the API is running."""
    print("Checking API health...")
    try:
        response = requests.get("http://localhost:8000/analysis/health", timeout=2)
        if response.status_code == 200:
            print("✓ API is running and healthy\n")
            return True
        else:
            print("✗ API returned non-200 status\n")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to API. Is it running?")
        print("  Start it with: cd backend && ./run.sh\n")
        return False
    except Exception as e:
        print(f"✗ Error: {str(e)}\n")
        return False


def main():
    """Run all examples."""
    print("\n" + "=" * 80)
    print("Medical Document Analysis API - Usage Examples")
    print("=" * 80 + "\n")
    
    if not check_health():
        return
    
    # Example 1: Analyze text
    analyze_text_example()
    
    # Example 2: Analyze file (if you have a sample file)
    # Uncomment and provide a valid file path:
    # analyze_file_example("sample_medical_report.pdf")
    
    print("\n" + "=" * 80)
    print("Examples completed!")
    print("=" * 80 + "\n")
    print("For more information, see:")
    print("  - API Docs: http://localhost:8000/docs")
    print("  - Integration Guide: backend/INTEGRATION.md")
    print("  - README: backend/README.md")


if __name__ == "__main__":
    main()
