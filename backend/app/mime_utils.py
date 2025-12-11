"""
MIME type detection and file validation utilities.
"""

import os
from typing import Optional, Tuple
from app.models import SUPPORTED_MIME_TYPES, SUPPORTED_EXTENSIONS, ParsingError

# Try to import magic, fall back to basic detection if not available
try:
    import magic
    MAGIC_AVAILABLE = True
except ImportError:
    MAGIC_AVAILABLE = False


def detect_mime_type(content: bytes, filename: str = "") -> str:
    """
    Detect MIME type of file content.
    Uses python-magic for content-based detection with filename fallback.
    """
    if MAGIC_AVAILABLE:
        try:
            # Try content-based detection first
            detected_mime = magic.from_buffer(content, mime=True)
            return detected_mime
        except Exception:
            pass
    
    # Fallback to filename-based detection
    if filename:
        _, ext = os.path.splitext(filename.lower())
        for supported_ext, file_type in SUPPORTED_EXTENSIONS.items():
            if ext == supported_ext:
                # Map extension back to MIME type
                mime_mapping = {
                    "text": "text/plain",
                    "pdf": "application/pdf",
                    "image": "image/jpeg"  # Default image type
                }
                return mime_mapping.get(file_type, "application/octet-stream")
    
    return "application/octet-stream"


def validate_file_type(mime_type: str, filename: str = "") -> Tuple[bool, str]:
    """
    Validate if file type is supported.
    Returns (is_valid, error_message)
    """
    # Check if MIME type is supported
    if mime_type in SUPPORTED_MIME_TYPES:
        return True, ""
    
    # Check if we can determine type from filename
    if filename:
        _, ext = os.path.splitext(filename.lower())
        if ext in SUPPORTED_EXTENSIONS:
            return True, ""
    
    return False, f"Unsupported file type: {mime_type} (filename: {filename})"


def get_source_type(mime_type: str, filename: str = "") -> str:
    """
    Determine source type from MIME type or filename extension.
    """
    # Try MIME type first
    if mime_type in SUPPORTED_MIME_TYPES:
        return SUPPORTED_MIME_TYPES[mime_type]
    
    # Fallback to filename
    if filename:
        _, ext = os.path.splitext(filename.lower())
        if ext in SUPPORTED_EXTENSIONS:
            return SUPPORTED_EXTENSIONS[ext]
    
    raise ParsingError(f"Cannot determine source type for MIME type: {mime_type}")


def validate_file_size(content: bytes, max_size_mb: int = 50) -> Tuple[bool, str]:
    """
    Validate file size is within acceptable limits.
    Default max size is 50MB.
    """
    size_mb = len(content) / (1024 * 1024)
    if size_mb > max_size_mb:
        return False, f"File size ({size_mb:.2f}MB) exceeds maximum allowed size ({max_size_mb}MB)"
    
    return True, ""