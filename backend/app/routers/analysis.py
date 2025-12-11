import time
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.responses import JSONResponse

from ..models.analysis import (
    AnalysisResponse,
    AnalysisError,
    ProcessingMetadata,
    ProgressState,
)
from ..services.document_parser import DocumentParser, DocumentParserError
from ..services.medical_agent import MedicalAgent, MedicalAgentError

router = APIRouter(prefix="/analysis", tags=["analysis"])


def create_progress_state(stage: str, progress: int, message: str) -> ProgressState:
    return ProgressState(
        stage=stage,
        progress=progress,
        message=message
    )


def create_error_response(error_message: str, error_code: Optional[str] = None, status_code: int = 400) -> JSONResponse:
    error_response = AnalysisError(
        success=False,
        error=error_message,
        error_code=error_code,
        details=None
    )
    return JSONResponse(
        status_code=status_code,
        content=error_response.model_dump()
    )


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_document(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    start_time = time.time()
    progress_states = []
    
    try:
        if not file and not text:
            return create_error_response(
                "Please provide either a file (PDF/image) or text content for analysis.",
                error_code="MISSING_INPUT"
            )
        
        if file and text:
            return create_error_response(
                "Please provide either a file OR text content, not both.",
                error_code="MULTIPLE_INPUTS"
            )
        
        progress_states.append(create_progress_state("validation", 10, "Input validated successfully"))
        
        extracted_text = ""
        source_type = "text"
        file_size = None
        page_count = None
        
        if file:
            progress_states.append(create_progress_state("parsing", 20, f"Parsing uploaded file: {file.filename}"))
            
            try:
                file_content = await file.read()
                
                extracted_text, source_type, file_size, page_count = await DocumentParser.parse_document(
                    file_content=file_content,
                    filename=file.filename,
                    content_type=file.content_type
                )
                
                progress_states.append(create_progress_state(
                    "parsing_complete",
                    40,
                    f"Successfully parsed {source_type.upper()} document"
                ))
                
            except DocumentParserError as e:
                return create_error_response(str(e), error_code="PARSE_ERROR")
            except Exception as e:
                return create_error_response(
                    f"An unexpected error occurred while processing the file: {str(e)}",
                    error_code="UNEXPECTED_PARSE_ERROR",
                    status_code=500
                )
        
        else:
            progress_states.append(create_progress_state("parsing", 20, "Processing text input"))
            
            try:
                extracted_text = await DocumentParser.parse_text(text)
                source_type = "text"
                file_size = len(text.encode('utf-8'))
                
                progress_states.append(create_progress_state(
                    "parsing_complete",
                    40,
                    "Text input validated successfully"
                ))
                
            except DocumentParserError as e:
                return create_error_response(str(e), error_code="TEXT_VALIDATION_ERROR")
        
        progress_states.append(create_progress_state(
            "analysis",
            50,
            "Analyzing medical content with AI agent"
        ))
        
        try:
            analysis_result = await MedicalAgent.analyze_medical_document(extracted_text)
            
            progress_states.append(create_progress_state(
                "analysis_complete",
                90,
                "Medical analysis completed successfully"
            ))
            
        except MedicalAgentError as e:
            return create_error_response(str(e), error_code="ANALYSIS_ERROR")
        except Exception as e:
            return create_error_response(
                f"An unexpected error occurred during medical analysis: {str(e)}",
                error_code="UNEXPECTED_ANALYSIS_ERROR",
                status_code=500
            )
        
        progress_states.append(create_progress_state(
            "complete",
            100,
            "Analysis complete and ready"
        ))
        
        end_time = time.time()
        duration_ms = (end_time - start_time) * 1000
        
        metadata = ProcessingMetadata(
            duration_ms=duration_ms,
            source_type=source_type,
            file_size_bytes=file_size,
            page_count=page_count,
            progress_states=progress_states
        )
        
        response = AnalysisResponse(
            success=True,
            summary=analysis_result["summary"],
            medications=analysis_result["medications"],
            hospital_recommendations=analysis_result["hospital_recommendations"],
            alerts=analysis_result["alerts"],
            metadata=metadata,
            error=None
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        return create_error_response(
            f"An unexpected server error occurred: {str(e)}",
            error_code="INTERNAL_ERROR",
            status_code=500
        )


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "analysis",
        "version": "1.0.0"
    }
