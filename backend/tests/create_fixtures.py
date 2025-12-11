#!/usr/bin/env python3
"""
Create test fixtures for the document parser including PDF and image files.
"""

from PIL import Image, ImageDraw, ImageFont
import io

def create_test_image_with_text():
    """Create a test image with readable text for OCR testing."""
    # Create a simple white image
    img = Image.new('RGB', (400, 200), color='white')
    draw = ImageDraw.Draw(img)
    
    # Add some text - try to use default font, fallback to basic if needed
    try:
        # Try to use a reasonable font
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except:
        try:
            font = ImageFont.load_default()
        except:
            font = None
    
    text_lines = [
        "Sample Image for OCR Testing",
        "Medication: Take 500mg Aspirin",
        "Prescription: Amoxicillin 250mg",
        "Dosage: 1 tablet every 8 hours"
    ]
    
    y_offset = 20
    for line in text_lines:
        if font:
            draw.text((10, y_offset), line, fill='black', font=font)
        else:
            draw.text((10, y_offset), line, fill='black')
        y_offset += 25
    
    # Save to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    return img_bytes.getvalue()

if __name__ == "__main__":
    # Create test image
    image_content = create_test_image_with_text()
    
    with open('/home/engine/project/backend/tests/fixtures/sample_with_text.png', 'wb') as f:
        f.write(image_content)
    
    print("Created test image: sample_with_text.png")