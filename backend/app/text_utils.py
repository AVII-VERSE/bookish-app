"""
Text cleaning and transformation utilities for document parsing.
"""

import re
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


def normalize_whitespace(text: str) -> str:
    """
    Normalize whitespace in text by:
    - Removing leading/trailing whitespace
    - Converting multiple spaces to single spaces
    - Preserving paragraph breaks
    - Normalizing line endings
    """
    if not text:
        return ""
    
    # Remove leading/trailing whitespace from each line
    lines = [line.strip() for line in text.splitlines()]
    
    # Join lines back together, preserving paragraph breaks
    normalized_text = "\n".join(lines)
    
    # Replace multiple spaces with single spaces (but preserve newlines)
    normalized_text = re.sub(r'[ \t]+', ' ', normalized_text)
    
    # Replace multiple newlines with double newlines (preserving paragraphs)
    normalized_text = re.sub(r'\n{3,}', '\n\n', normalized_text)
    
    return normalized_text.strip()


def extract_medication_blocks(text: str) -> List[Dict[str, Any]]:
    """
    Extract medication-related information blocks from text.
    Looks for patterns that might indicate medication information.
    """
    if not text:
        return []
    
    medication_blocks = []
    
    # Common medication patterns
    medication_patterns = [
        r'(?i)(?:medication|medicine|drug|prescription)[:\s]*([^\n]+(?:\n(?!\n)[^\n]+)*)',
        r'(?i)(?:take|mg|mcg|ml|tablet|capsule|pill)[:\s]*([^\n]+(?:\n(?!\n)[^\n]+)*)',
        r'(?i)(?:dosage|dose|frequency)[:\s]*([^\n]+(?:\n(?!\n)[^\n]+)*)',
    ]
    
    for pattern in medication_patterns:
        matches = re.finditer(pattern, text, re.MULTILINE)
        for match in matches:
            medication_blocks.append({
                'content': match.group(0).strip(),
                'extracted_text': match.group(1).strip() if match.groups() else match.group(0).strip(),
                'pattern_type': 'medication'
            })
    
    return medication_blocks


def clean_text_content(text: str) -> str:
    """
    Comprehensive text cleaning for parsed documents.
    """
    if not text:
        return ""
    
    # Remove common artifacts
    text = re.sub(r'[_=]{3,}', '', text)  # Remove separator lines
    text = re.sub(r'[-=]{10,}', '', text)  # Remove long separator lines
    text = re.sub(r'\x00', '', text)  # Remove null bytes
    text = re.sub(r'[\r\n]+', '\n', text)  # Normalize line endings
    
    # Remove excessive whitespace
    text = normalize_whitespace(text)
    
    # Remove lines that are just numbers/symbols (page numbers, headers, footers)
    lines = text.split('\n')
    cleaned_lines = []
    
    for line in lines:
        stripped = line.strip()
        # Skip empty lines or lines that are just numbers/dates/symbols
        # More comprehensive pattern to catch page numbers like "Page 1", "1 of 2", etc.
        if (stripped and 
            not re.match(r'^[\d\s\-\._,;:!?()]+$', stripped) and 
            not re.match(r'^(page\s+\d+|\d+\s+of\s+\d+|\d{1,3})$', stripped, re.IGNORECASE) and
            len(stripped) > 2):
            cleaned_lines.append(line)
    
    return '\n'.join(cleaned_lines)


def extract_structured_info(text: str) -> Dict[str, Any]:
    """
    Extract structured information from text content.
    Returns a dictionary with various extracted elements.
    """
    if not text:
        return {}
    
    info = {
        'word_count': len(text.split()),
        'line_count': len(text.splitlines()),
        'paragraph_count': len([p for p in text.split('\n\n') if p.strip()]),
        'medication_blocks': extract_medication_blocks(text),
        'has_tables': bool(re.search(r'\t.{2,}', text) or '|' in text),
        'has_lists': bool(re.search(r'^\s*[\d\-\*\+]\s+', text, re.MULTILINE)),
    }
    
    return info


def post_process_text(text: str, source_type: str) -> str:
    """
    Apply post-processing specific to source type.
    """
    # Clean the text
    text = clean_text_content(text)
    
    # Apply source-specific processing
    if source_type == "pdf":
        # Remove common PDF artifacts
        text = re.sub(r'(?i)(page\s*\d+|\d+\s*of\s*\d+)', '', text)
        text = re.sub(r'(?i)(continued\s*on\s*next\s*page)', '', text)
        
    elif source_type == "image":
        # Handle OCR-specific artifacts
        text = re.sub(r'(?i)(ocr|copyright|watermark)', '', text)
        
    return text.strip()