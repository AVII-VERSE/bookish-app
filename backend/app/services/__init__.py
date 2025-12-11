"""
Document Ingestion Module

A module for parsing documents from various input sources including:
- Plain text files
- PDF documents  
- Images (with OCR processing)

Features:
- MIME-type detection and validation
- Text normalization and cleaning
- Support for multiple document formats
- Comprehensive error handling
- Structured metadata extraction
"""

from .document_parser import (
    parse_document,
    parse_multiple_documents,
    create_upload_payload,
)

from ..models import (
    UploadPayload,
    ParsedDocument,
    ParsingError,
    SUPPORTED_MIME_TYPES,
    SUPPORTED_EXTENSIONS,
)

from ..text_utils import (
    normalize_whitespace,
    extract_medication_blocks,
    clean_text_content,
    extract_structured_info,
    post_process_text,
)

from ..mime_utils import (
    detect_mime_type,
    validate_file_type,
    get_source_type,
    validate_file_size,
)

__all__ = [
    # Main parsing functions
    'parse_document',
    'parse_multiple_documents', 
    'create_upload_payload',
    
    # Data models
    'UploadPayload',
    'ParsedDocument', 
    'ParsingError',
    
    # Utilities
    'normalize_whitespace',
    'extract_medication_blocks',
    'clean_text_content',
    'extract_structured_info',
    'post_process_text',
    'detect_mime_type',
    'validate_file_type', 
    'get_source_type',
    'validate_file_size',
    
    # Constants
    'SUPPORTED_MIME_TYPES',
    'SUPPORTED_EXTENSIONS',
]