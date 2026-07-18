from pathlib import Path

# Resolve root KnowledgeBase path relative to backend folder
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
KNOWLEDGE_BASE_PATH = BASE_DIR / "KnowledgeBase"

ENCODING = "utf-8"
SUPPORTED_EXTENSIONS = [".json"]
