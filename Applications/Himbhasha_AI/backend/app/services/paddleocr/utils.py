import os
import uuid
import base64
import mimetypes
import logging
from typing import Tuple

logger = logging.getLogger("paddleocr_utils")
TEMP_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "temp_uploads")

# Ensure temporary uploads directory exists
os.makedirs(TEMP_DIR, exist_ok=True)

def validate_image(file_path: str) -> bool:
    """Validates that the file exists and has a supported image extension."""
    if not os.path.exists(file_path):
        return False
    ext = os.path.splitext(file_path)[1].lower()
    return ext in [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"]

def validate_pdf(file_path: str) -> bool:
    """Validates that the file exists and has a .pdf extension."""
    if not os.path.exists(file_path):
        return False
    ext = os.path.splitext(file_path)[1].lower()
    return ext == ".pdf"

def detect_mime_type(file_name: str) -> str:
    """Guesses the mime type of the file."""
    mime, _ = mimetypes.guess_type(file_name)
    return mime or "application/octet-stream"

def generate_temporary_filename(prefix: str, extension: str) -> str:
    """Generates a unique absolute path in the temp uploads folder."""
    filename = f"{prefix}_{uuid.uuid4().hex}{extension}"
    return os.path.join(TEMP_DIR, filename)

def save_upload(content_base64: str, file_name: str) -> str:
    """Decodes a base64 buffer and saves it to a unique temporary file path."""
    ext = os.path.splitext(file_name)[1].lower()
    temp_path = generate_temporary_filename("ocr_upload", ext)
    
    # Strip base64 headers if present
    if "," in content_base64:
        content_base64 = content_base64.split(",")[1]
        
    try:
        file_bytes = base64.b64decode(content_base64)
        with open(temp_path, "wb") as f:
            f.write(file_bytes)
        logger.info(f"Successfully saved base64 upload to temp path: {temp_path}")
        return temp_path
    except Exception as e:
        logger.error(f"Failed to decode and save upload: {e}")
        raise ValueError(f"Invalid base64 payload: {e}")

def delete_temporary_files(file_path: str):
    """Deletes a temporary file from disk if it exists."""
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
            logger.info(f"Deleted temporary upload file: {file_path}")
        except Exception as e:
            logger.warning(f"Could not remove temporary file {file_path}: {e}")