import io
from typing import Tuple, Optional
from PIL import Image
import PyPDF2
import magic


class DocumentParserError(Exception):
    pass


class DocumentParser:
    SUPPORTED_IMAGE_FORMATS = {
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
        'image/bmp', 'image/tiff', 'image/webp'
    }
    SUPPORTED_PDF_FORMATS = {'application/pdf'}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

    @staticmethod
    def detect_file_type(file_content: bytes) -> str:
        try:
            mime = magic.Magic(mime=True)
            return mime.from_buffer(file_content)
        except Exception:
            return "application/octet-stream"

    @staticmethod
    async def parse_pdf(file_content: bytes) -> Tuple[str, int]:
        try:
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            page_count = len(pdf_reader.pages)
            text_content = []
            
            for page in pdf_reader.pages:
                try:
                    text = page.extract_text()
                    if text:
                        text_content.append(text)
                except Exception as e:
                    continue
            
            combined_text = "\n\n".join(text_content)
            
            if not combined_text.strip():
                raise DocumentParserError("PDF appears to be empty or contains only images. Please use OCR-enabled scanning or provide text content.")
            
            return combined_text, page_count
            
        except PyPDF2.errors.PdfReadError as e:
            raise DocumentParserError(f"Unable to read PDF file. The file may be corrupted or password-protected: {str(e)}")
        except Exception as e:
            if isinstance(e, DocumentParserError):
                raise
            raise DocumentParserError(f"Error processing PDF: {str(e)}")

    @staticmethod
    async def parse_image(file_content: bytes) -> str:
        try:
            image = Image.open(io.BytesIO(file_content))
            
            width, height = image.size
            format_name = image.format or "Unknown"
            
            placeholder_text = (
                f"[Image document detected: {format_name} format, {width}x{height} pixels]\n\n"
                "Note: OCR functionality is not yet implemented. "
                "For full text extraction from images, please:\n"
                "1. Use a text-based PDF instead, or\n"
                "2. Manually transcribe the key medical information below.\n\n"
                "Example medical information that should be extracted:\n"
                "- Patient name and date\n"
                "- Diagnosis or medical condition\n"
                "- Prescribed medications with dosages\n"
                "- Doctor's instructions and recommendations\n"
                "- Follow-up appointment details"
            )
            
            return placeholder_text
            
        except Exception as e:
            raise DocumentParserError(f"Error processing image: {str(e)}")

    @staticmethod
    async def parse_document(
        file_content: bytes,
        filename: Optional[str] = None,
        content_type: Optional[str] = None
    ) -> Tuple[str, str, int, Optional[int]]:
        if len(file_content) > DocumentParser.MAX_FILE_SIZE:
            raise DocumentParserError(
                f"File size exceeds maximum allowed size of {DocumentParser.MAX_FILE_SIZE / (1024 * 1024):.1f} MB. "
                "Please upload a smaller file."
            )
        
        if not file_content:
            raise DocumentParserError("Empty file provided. Please upload a valid document.")
        
        detected_type = DocumentParser.detect_file_type(file_content)
        mime_type = content_type or detected_type
        
        page_count = None
        
        if mime_type in DocumentParser.SUPPORTED_PDF_FORMATS or (filename and filename.lower().endswith('.pdf')):
            text, page_count = await DocumentParser.parse_pdf(file_content)
            source_type = "pdf"
        elif mime_type in DocumentParser.SUPPORTED_IMAGE_FORMATS or (
            filename and any(filename.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'])
        ):
            text = await DocumentParser.parse_image(file_content)
            source_type = "image"
        else:
            raise DocumentParserError(
                f"Unsupported file type: {mime_type}. "
                f"Supported formats: PDF, JPEG, PNG, GIF, BMP, TIFF, WebP. "
                "Please convert your document to one of these formats."
            )
        
        return text, source_type, len(file_content), page_count

    @staticmethod
    async def parse_text(text: str) -> str:
        if not text or not text.strip():
            raise DocumentParserError("Empty text provided. Please provide valid medical document text.")
        
        if len(text) > 100000:
            raise DocumentParserError(
                "Text content too long (maximum 100,000 characters). "
                "Please provide a shorter document or split it into multiple submissions."
            )
        
        return text.strip()
