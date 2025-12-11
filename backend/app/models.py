"""
Data models for document parsing pipeline.
"""

from typing import Dict, Any, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime


class UploadPayload(BaseModel):
    """Payload for document upload."""
    
    content: bytes = Field(..., description="Raw file content as bytes")
    filename: str = Field(..., description="Original filename")
    mime_type: str = Field(..., description="MIME type of the file")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Additional metadata")


class ParsedDocument(BaseModel):
    """Result of document parsing."""
    
    text: str = Field(..., description="Extracted and normalized text")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Document metadata")
    source_type: Literal["text", "pdf", "image", "unknown"] = Field(..., description="Type of source document")
    filename: str = Field(..., description="Original filename")
    extracted_at: datetime = Field(default_factory=datetime.now, description="Timestamp of extraction")
    word_count: int = Field(..., description="Number of words in extracted text")
    success: bool = Field(..., description="Whether parsing was successful")
    error_message: Optional[str] = Field(default=None, description="Error message if parsing failed")


class ParsingError(Exception):
    """Custom exception for parsing errors."""
    
    def __init__(self, message: str, error_type: str = "PARSING_ERROR"):
        self.message = message
        self.error_type = error_type
        super().__init__(self.message)


# Supported file types
SUPPORTED_MIME_TYPES = {
    "text/plain": "text",
    "application/pdf": "pdf", 
    "image/jpeg": "image",
    "image/png": "image",
    "image/tiff": "image",
    "image/bmp": "image",
    "image/gif": "image",
}

SUPPORTED_EXTENSIONS = {
    ".txt": "text",
    ".pdf": "pdf",
    ".jpg": "image",
    ".jpeg": "image", 
    ".png": "image",
    ".tiff": "image",
    ".tif": "image",
    ".bmp": "image",
    ".gif": "image",
}