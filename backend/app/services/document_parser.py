"""
Main document parsing service that orchestrates the parsing pipeline.
"""

import logging
from datetime import datetime
from typing import Dict, Any

from app.models import UploadPayload, ParsedDocument, ParsingError
from app.mime_utils import detect_mime_type, validate_file_type, validate_file_size, get_source_type
from app.parsers import parse_text_content, parse_pdf_content, parse_image_content
from app.text_utils import extract_structured_info

logger = logging.getLogger(__name__)


def parse_document(payload: UploadPayload) -> ParsedDocument:
    """
    Main function to parse documents from uploaded content.
    
    Args:
        payload: UploadPayload containing file content, filename, and metadata
        
    Returns:
        ParsedDocument with extracted text and metadata
        
    Raises:
        ParsingError: If parsing fails with descriptive error message
    """
    start_time = datetime.now()
    
    try:
        # Validate file size
        is_valid_size, size_error = validate_file_size(payload.content)
        if not is_valid_size:
            return ParsedDocument(
                text="",
                metadata={"error": size_error, "validation_step": "file_size"},
                source_type=get_source_type(payload.mime_type, payload.filename),
                filename=payload.filename,
                word_count=0,
                success=False,
                error_message=size_error
            )
        
        # Validate file type
        is_valid_type, type_error = validate_file_type(payload.mime_type, payload.filename)
        if not is_valid_type:
            # Try to get source type from filename even if MIME type is unknown
            try:
                source_type = get_source_type(payload.mime_type, payload.filename)
            except ParsingError:
                source_type = "unknown"
            
            return ParsedDocument(
                text="",
                metadata={"error": type_error, "validation_step": "file_type"},
                source_type=source_type,
                filename=payload.filename,
                word_count=0,
                success=False,
                error_message=type_error
            )
        
        # Detect actual MIME type if not provided or if we want to verify
        detected_mime = detect_mime_type(payload.content, payload.filename)
        if detected_mime != payload.mime_type:
            logger.info(f"MIME type mismatch: provided {payload.mime_type}, detected {detected_mime}")
        
        # Determine source type
        source_type = get_source_type(detected_mime, payload.filename)
        
        # Parse content based on source type
        extracted_text = ""
        
        if source_type == "text":
            extracted_text = parse_text_content(payload.content)
        elif source_type == "pdf":
            extracted_text = parse_pdf_content(payload.content)
        elif source_type == "image":
            extracted_text = parse_image_content(payload.content)
        else:
            raise ParsingError(f"Unsupported source type: {source_type}")
        
        # Extract additional metadata
        structured_info = extract_structured_info(extracted_text)
        
        # Create metadata
        metadata = {
            "original_mime_type": payload.mime_type,
            "detected_mime_type": detected_mime,
            "parsing_time_ms": int((datetime.now() - start_time).total_seconds() * 1000),
            **structured_info,
            **(payload.metadata or {})
        }
        
        # Create and return parsed document
        return ParsedDocument(
            text=extracted_text,
            metadata=metadata,
            source_type=source_type,
            filename=payload.filename,
            word_count=len(extracted_text.split()) if extracted_text else 0,
            success=True,
            error_message=None
        )
        
    except ParsingError as e:
        # Re-raise parsing errors with context
        logger.error(f"Parsing failed for {payload.filename}: {e.message}")
        return ParsedDocument(
            text="",
            metadata={"error": e.message, "error_type": e.error_type, "parsing_step": "extraction"},
            source_type=get_source_type(payload.mime_type, payload.filename),
            filename=payload.filename,
            word_count=0,
            success=False,
            error_message=e.message
        )
        
    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected error parsing {payload.filename}: {str(e)}")
        return ParsedDocument(
            text="",
            metadata={"error": str(e), "error_type": "UNEXPECTED_ERROR"},
            source_type=get_source_type(payload.mime_type, payload.filename),
            filename=payload.filename,
            word_count=0,
            success=False,
            error_message=f"Unexpected error: {str(e)}"
        )


def parse_multiple_documents(payloads: list[UploadPayload]) -> list[ParsedDocument]:
    """
    Parse multiple documents in batch.
    
    Args:
        payloads: List of UploadPayload objects
        
    Returns:
        List of ParsedDocument objects
    """
    results = []
    for payload in payloads:
        result = parse_document(payload)
        results.append(result)
    
    return results


def create_upload_payload(
    content: bytes, 
    filename: str, 
    mime_type: str = None,
    metadata: Dict[str, Any] = None
) -> UploadPayload:
    """
    Helper function to create UploadPayload with automatic MIME type detection.
    
    Args:
        content: File content as bytes
        filename: Original filename
        mime_type: Optional MIME type (will be detected if not provided)
        metadata: Optional additional metadata
        
    Returns:
        UploadPayload object
    """
    if mime_type is None:
        mime_type = detect_mime_type(content, filename)
    
    return UploadPayload(
        content=content,
        filename=filename,
        mime_type=mime_type,
        metadata=metadata
    )