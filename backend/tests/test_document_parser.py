"""
Unit tests for the document parsing pipeline.
"""

import pytest
import io
import os
from unittest.mock import Mock, patch, mock_open

# Import the modules we want to test
import sys
sys.path.insert(0, '/home/engine/project/backend')

from app.models import UploadPayload, ParsedDocument, ParsingError
from app.services.document_parser import parse_document, create_upload_payload
from app.text_utils import normalize_whitespace, extract_medication_blocks, clean_text_content
from app.mime_utils import detect_mime_type, validate_file_type, get_source_type


class TestTextUtils:
    """Test text cleaning and transformation utilities."""
    
    def test_normalize_whitespace(self):
        """Test whitespace normalization."""
        text_with_extra_spaces = "This    has    extra    spaces\n\n\n\nand    multiple    newlines"
        expected = "This has extra spaces\n\nand multiple newlines"
        result = normalize_whitespace(text_with_extra_spaces)
        assert result == expected
    
    def test_normalize_whitespace_empty(self):
        """Test whitespace normalization with empty text."""
        assert normalize_whitespace("") == ""
        assert normalize_whitespace(None) == ""
    
    def test_extract_medication_blocks(self):
        """Test medication information extraction."""
        text = """
        Medication: Take 500mg of Aspirin twice daily with food.
        Dosage: 1 tablet every 8 hours as needed for pain.
        Prescription: Amoxicillin 250mg capsules.
        """
        blocks = extract_medication_blocks(text)
        assert len(blocks) >= 1
        assert any("medication" in block['content'].lower() for block in blocks)
    
    def test_clean_text_content(self):
        """Test comprehensive text cleaning."""
        dirty_text = "___\n\nThis    has    extra    spaces\n\n   \n\n12345\n\n   Page 1\n\n===    clean text    ===\n\n"
        cleaned = clean_text_content(dirty_text)
        assert "___" not in cleaned
        assert "12345" not in cleaned
        assert "Page 1" not in cleaned
        assert "clean text" in cleaned.lower()


class TestMimeUtils:
    """Test MIME type detection and validation utilities."""
    
    def test_validate_file_type_valid(self):
        """Test validation of supported file types."""
        # Test text file
        is_valid, error = validate_file_type("text/plain", "test.txt")
        assert is_valid
        assert error == ""
        
        # Test PDF file
        is_valid, error = validate_file_type("application/pdf", "test.pdf")
        assert is_valid
        assert error == ""
        
        # Test image file
        is_valid, error = validate_file_type("image/png", "test.png")
        assert is_valid
        assert error == ""
    
    def test_validate_file_type_invalid(self):
        """Test validation of unsupported file types."""
        is_valid, error = validate_file_type("application/zip", "test.zip")
        assert not is_valid
        assert "Unsupported file type" in error
    
    def test_get_source_type(self):
        """Test source type determination."""
        assert get_source_type("text/plain") == "text"
        assert get_source_type("application/pdf") == "pdf"
        assert get_source_type("image/png") == "image"
    
    def test_validate_file_size(self):
        """Test file size validation."""
        from app.mime_utils import validate_file_size
        
        # Test small file (should pass)
        small_content = b"test content"
        is_valid, error = validate_file_size(small_content)
        assert is_valid
        assert error == ""
        
        # Test large file (would exceed limit, but we're using small test data)
        large_content = b"x" * (60 * 1024 * 1024)  # 60MB
        is_valid, error = validate_file_size(large_content, max_size_mb=50)
        assert not is_valid
        assert "exceeds maximum allowed size" in error


class TestDocumentParser:
    """Test the main document parsing functionality."""
    
    def test_create_upload_payload(self):
        """Test UploadPayload creation with auto-detection."""
        content = b"test content"
        filename = "test.txt"
        
        payload = create_upload_payload(content, filename)
        assert payload.content == content
        assert payload.filename == filename
        assert payload.mime_type == "text/plain"
    
    def test_parse_text_document_success(self):
        """Test successful parsing of text document."""
        content = b"This is a test document.\nIt has multiple lines.\n\nMedication: Take 500mg of Aspirin."
        filename = "test.txt"
        mime_type = "text/plain"
        
        payload = UploadPayload(
            content=content,
            filename=filename,
            mime_type=mime_type
        )
        
        result = parse_document(payload)
        
        assert result.success
        assert result.source_type == "text"
        assert result.filename == filename
        assert "test document" in result.text
        assert "Aspirin" in result.text
        assert result.word_count > 0
        assert result.error_message is None
    
    def test_parse_text_document_encoding_fallback(self):
        """Test parsing with different text encodings."""
        content = b"Test with special characters: \xe4\xf6\xfc"
        filename = "test.txt"
        mime_type = "text/plain"
        
        payload = UploadPayload(
            content=content,
            filename=filename,
            mime_type=mime_type
        )
        
        result = parse_document(payload)
        # Should fall back to latin-1 encoding
        assert result.success
        assert result.source_type == "text"
    
    def test_parse_unsupported_file_type(self):
        """Test parsing with unsupported file type."""
        content = b"PK\x03\x04"  # ZIP file signature
        filename = "test.zip"
        mime_type = "application/zip"
        
        payload = UploadPayload(
            content=content,
            filename=filename,
            mime_type=mime_type
        )
        
        result = parse_document(payload)
        
        assert not result.success
        assert "Unsupported file type" in result.error_message
        assert result.word_count == 0
    
    def test_parse_empty_content(self):
        """Test parsing empty content."""
        content = b""
        filename = "empty.txt"
        mime_type = "text/plain"
        
        payload = UploadPayload(
            content=content,
            filename=filename,
            mime_type=mime_type
        )
        
        result = parse_document(payload)
        
        assert result.success
        assert result.text == ""
        assert result.word_count == 0
    
    def test_parse_document_with_metadata(self):
        """Test parsing with additional metadata."""
        content = b"Test document with metadata."
        filename = "test.txt"
        mime_type = "text/plain"
        metadata = {"source": "test_suite", "version": "1.0"}
        
        payload = UploadPayload(
            content=content,
            filename=filename,
            mime_type=mime_type,
            metadata=metadata
        )
        
        result = parse_document(payload)
        
        assert result.success
        assert "source" in result.metadata
        assert result.metadata["source"] == "test_suite"
        assert "version" in result.metadata
        assert "word_count" in result.metadata
    
    @patch('app.services.document_parser.parse_pdf_content')
    def test_parse_pdf_document(self, mock_parse_pdf):
        """Test PDF document parsing."""
        # Mock PDF parser to return test text
        mock_parse_pdf.return_value = "Extracted PDF text content."
        
        content = b"fake pdf content"
        filename = "test.pdf"
        mime_type = "application/pdf"
        
        payload = UploadPayload(
            content=content,
            filename=filename,
            mime_type=mime_type
        )
        
        result = parse_document(payload)
        
        # The parsing should succeed because we're mocking the PDF parser
        assert result.source_type == "pdf"
        mock_parse_pdf.assert_called_once_with(content)
    
    @patch('app.services.document_parser.parse_image_content')
    def test_parse_image_document(self, mock_parse_image):
        """Test image document parsing."""
        # Mock image parser to return test text
        mock_parse_image.return_value = "Extracted image text via OCR."
        
        content = b"fake image content"
        filename = "test.png"
        mime_type = "image/png"
        
        payload = UploadPayload(
            content=content,
            filename=filename,
            mime_type=mime_type
        )
        
        result = parse_document(payload)
        
        # The parsing should succeed because we're mocking the image parser
        assert result.source_type == "image"
        mock_parse_image.assert_called_once_with(content)


class TestFixturesIntegration:
    """Integration tests using actual fixture files."""
    
    def test_parse_text_fixture(self):
        """Test parsing the sample text fixture."""
        fixtures_path = "/home/engine/project/backend/tests/fixtures/sample_text.txt"
        
        if not os.path.exists(fixtures_path):
            pytest.skip(f"Fixture file not found: {fixtures_path}")
        
        with open(fixtures_path, 'rb') as f:
            content = f.read()
        
        payload = create_upload_payload(content, "sample_text.txt")
        result = parse_document(payload)
        
        assert result.success
        assert result.source_type == "text"
        assert "sample text document" in result.text.lower()
        assert result.word_count > 0
        assert "medication" in result.text.lower()
    
    def test_parse_pdf_fixture(self):
        """Test parsing the sample PDF fixture."""
        fixtures_path = "/home/engine/project/backend/tests/fixtures/sample.pdf"
        
        if not os.path.exists(fixtures_path):
            pytest.skip(f"Fixture file not found: {fixtures_path}")
        
        with open(fixtures_path, 'rb') as f:
            content = f.read()
        
        payload = create_upload_payload(content, "sample.pdf")
        result = parse_document(payload)
        
        assert result.success
        assert result.source_type == "pdf"
        # The sample PDF should contain our test content
        assert result.word_count > 0


if __name__ == "__main__":
    # Run basic tests if this script is executed directly
    print("Running document parser tests...")
    
    # Test text utilities
    test_utils = TestTextUtils()
    test_utils.test_normalize_whitespace()
    test_utils.test_extract_medication_blocks()
    print("✓ Text utilities tests passed")
    
    # Test MIME utilities
    mime_utils = TestMimeUtils()
    mime_utils.test_validate_file_type_valid()
    mime_utils.test_get_source_type()
    print("✓ MIME utilities tests passed")
    
    # Test document parser
    parser = TestDocumentParser()
    parser.test_parse_text_document_success()
    parser.test_parse_empty_content()
    print("✓ Document parser tests passed")
    
    print("All basic tests passed!")