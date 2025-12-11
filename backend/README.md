# Medical Agent Service Backend

This backend service provides medical document analysis using LangChain workflow orchestration.

## Features

- **Prescription Summary**: Extracts and summarizes all medications with dosage, frequency, and duration
- **Medication Timing Schedule**: Generates a daily schedule for taking medications
- **Hospital/Doctor Suggestions**: Recommends specialists and facilities based on document content
- **Red Flag Insights**: Identifies drug interactions, contraindications, and safety concerns

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```python
from backend.app.schemas import ParsedDocument
from backend.app.services.medical_agent import analyze_document

# Create a parsed document
parsed_doc = ParsedDocument(
    text="""
    Patient prescribed:
    - Metformin 1000mg twice daily for diabetes
    - Lisinopril 10mg once daily for blood pressure
    
    Follow up with endocrinologist in 3 months.
    Blood work needed.
    """,
    metadata={"patient_id": "12345", "date": "2024-01-15"}
)

# Analyze the document
result = analyze_document(parsed_doc)

# Access structured results
print(f"Total medications: {result.prescription_summary.total_medications}")
print(f"Red flags found: {len(result.additional_insights.red_flags)}")

# Get timing schedule
for slot in result.medication_timing.schedule:
    print(f"{slot.time}: {', '.join(slot.medications)}")

# Get doctor suggestions
for doctor in result.suggestions.doctors:
    print(f"{doctor.specialty}: {doctor.reason} (Priority: {doctor.priority})")
```

## Architecture

### Components

1. **Schemas** (`app/schemas.py`): Pydantic models for type-safe data structures
   - `ParsedDocument`: Input document model
   - `AnalysisResult`: Complete analysis output model
   - Supporting models for prescriptions, timing, suggestions, and insights

2. **Medical Agent** (`app/services/medical_agent.py`): Main analysis service
   - Uses LangChain for workflow orchestration
   - Deterministic analysis using pattern matching and rule-based logic
   - Integrates with knowledge base for cross-referencing

3. **Knowledge Base Client** (`app/services/knowledge_base_client.py`): Stubbed HTTP client
   - Provides medication information
   - Checks drug interactions
   - Identifies red flags and safety concerns
   - Fully mocked for offline testing

### LangChain Integration

The service uses LangChain chains for workflow management:
- Prescription extraction chain
- Timing schedule generation chain
- Suggestions generation chain
- Insights analysis chain

Currently uses `FakeListLLM` for deterministic testing, but can be easily swapped with real LLMs (OpenAI, Anthropic, etc.) by modifying the `_setup_chains` method.

## Testing

Run the test suite:

```bash
# Run all tests
pytest backend/tests/test_medical_agent.py -v

# Run with coverage
pytest backend/tests/test_medical_agent.py -v --cov=backend/app --cov-report=html
```

All tests use mocked knowledge base client for offline verification.

## Extending the Service

### Adding Real LLM Integration

Replace the `FakeListLLM` in `medical_agent.py`:

```python
from langchain_openai import ChatOpenAI

def _setup_chains(self):
    llm = ChatOpenAI(model="gpt-4", temperature=0)
    self.prescription_chain = LLMChain(llm=llm, prompt=self.prescription_extraction_prompt)
    # ... setup other chains
```

### Adding Real HTTP Client

Modify `knowledge_base_client.py` to make actual HTTP requests:

```python
import httpx

def get_medication_info(self, medication_name: str):
    response = httpx.get(f"{self.base_url}/medications/{medication_name}")
    return response.json()
```

### Custom Prompt Templates

Modify prompts in `_setup_prompts()` method to customize analysis behavior.

## Schema Compliance

All outputs are strictly typed using Pydantic models and guaranteed to be schema-compliant. The `AnalysisResult` model includes:

- `prescription_summary`: All medications with details
- `medication_timing`: Daily schedule with timing slots
- `suggestions`: Doctor and hospital recommendations
- `additional_insights`: Red flags and safety warnings

## Deterministic Output

The service is designed to produce deterministic results for the same input:
- Pattern-based medication extraction
- Rule-based timing schedule generation
- Keyword-driven red flag detection
- Mock data for knowledge base queries

This ensures consistent, testable behavior for offline development and testing.
