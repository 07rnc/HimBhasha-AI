import os

# PaddleOCR configuration constants
lang: str = os.getenv("PADDLEOCR_LANG", "hi")  # Using Hindi (hi) language model for Devnagari scripting support
use_gpu: bool = os.getenv("PADDLEOCR_USE_GPU", "false").lower() == "true"
use_angle_cls: bool = True
det_db_thresh: float = 0.3
det_db_box_thresh: float = 0.6
confidence_threshold: float = 0.6  # Filter threshold for valid text bounding boxes
max_image_size: int = 4096