"""
Document parsers for different file types.
"""

import io
import logging
from typing import Optional
from pdfplumber import PDF
from pdf2image import convert_from_bytes
import pytesseract
from PIL import Image
import tempfile
import os

from app.models import ParsingError
from app.text_utils import post_process_text

logger = logging.getLogger(__name__)


def parse_text_content(content: bytes, encoding: str = 'utf-8') -> str:
    """
    Parse plain text content from bytes.
    """
    try:
        text = content.decode(encoding)
        return post_process_text(text, "text")
    except UnicodeDecodeError as e:
        # Try with different encodings
        for enc in ['latin-1', 'cp1252', 'iso-8859-1']:
            try:
                text = content.decode(enc)
                return post_process_text(text, "text")
            except UnicodeDecodeError:
                continue
        raise ParsingError(f"Unable to decode text content with any supported encoding: {e}")


def parse_pdf_content(content: bytes) -> str:
    """
    Parse PDF content and extract text using pdfplumber.
    """
    try:
        with io.BytesIO(content) as pdf_file:
            with PDF.open(pdf_file) as pdf:
                all_text = []
                
                for page_num, page in enumerate(pdf.pages, 1):
                    try:
                        page_text = page.extract_text()
                        if page_text:
                            all_text.append(f"[Page {page_num}]\n{page_text}")
                    except Exception as e:
                        logger.warning(f"Error extracting text from page {page_num}: {e}")
                        continue
                
                if not all_text:
                    raise ParsingError("No text content found in PDF")
                
                full_text = "\n\n".join(all_text)
                return post_process_text(full_text, "pdf")
                
    except Exception as e:
        raise ParsingError(f"Failed to parse PDF: {e}")


def parse_image_content(content: bytes) -> str:
    """
    Parse image content and extract text using OCR (pytesseract + pdf2image).
    """
    try:
        # Convert image bytes to PIL Image
        image = Image.open(io.BytesIO(content))
        
        # If image is not in RGB mode, convert it
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Use pytesseract to extract text
        try:
            text = pytesseract.image_to_string(image)
            return post_process_text(text, "image")
        except pytesseract.TesseractError as e:
            raise ParsingError(f"OCR processing failed: {e}")
            
    except Exception as e:
        raise ParsingError(f"Failed to parse image: {e}")


def detect_encoding(content: bytes) -> str:
    """
    Attempt to detect text encoding from bytes.
    """
    # Simple encoding detection based on byte patterns
    if content.startswith(b'\xef\xbb\xbf'):
        return 'utf-8-sig'
    elif content.startswith(b'\xff\xfe'):
        return 'utf-16-le'
    elif content.startswith(b'\xfe\xff'):
        return 'utf-16-be'
    
    # Check for common encoding patterns
    try:
        content.decode('utf-8')
        return 'utf-8'
    except UnicodeDecodeError:
        try:
            content.decode('latin-1')
            return 'latin-1'
        except UnicodeDecodeError:
            return 'utf-8'  # Default fallback