from paddleocr import PaddleOCR

print("Loading PaddleOCR...")

ocr = PaddleOCR(
    use_textline_orientation=True,
    lang="en"
)

print("✅ PaddleOCR Installed Successfully!")