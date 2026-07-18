import json
import logging
from pathlib import Path
from typing import Dict, List, Any, Union

from .config import KNOWLEDGE_BASE_PATH, ENCODING, SUPPORTED_EXTENSIONS
from .exceptions import KnowledgeLoadError, InvalidKnowledgeFileError, KnowledgeValidationError
from .models import (
    DictionaryEntry,
    PhraseEntry,
    GovernmentEntry,
    AgricultureEntry,
    HealthcareEntry,
    CultureEntry,
    EducationEntry,
    TourismEntry,
    FAQEntry,
    KnowledgeDataset,
)

logger = logging.getLogger("knowledge_loader")

MODEL_MAPPINGS = {
    "dictionary": DictionaryEntry,
    "phrases": PhraseEntry,
    "government": GovernmentEntry,
    "agriculture": AgricultureEntry,
    "healthcare": HealthcareEntry,
    "culture": CultureEntry,
    "education": EducationEntry,
    "tourism": TourismEntry,
    "faq": FAQEntry,
}

class KnowledgeLoader:
    """Scans and parses the KnowledgeBase folder structure recursively into Pydantic model datasets."""

    def __init__(self, base_path: Path = KNOWLEDGE_BASE_PATH):
        self.base_path = Path(base_path)

    def load_file(self, file_path: Path) -> Union[List[Dict[str, Any]], Dict[str, Any]]:
        """Loads and parses a single JSON file."""
        if not file_path.exists():
            raise KnowledgeLoadError(f"File not found: {file_path}")

        if file_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            raise InvalidKnowledgeFileError(f"Unsupported file format: {file_path.suffix}")

        try:
            with open(file_path, "r", encoding=ENCODING) as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON syntax in {file_path}: {e}")
            raise InvalidKnowledgeFileError(f"JSON decode error in {file_path.name}: {e}")
        except Exception as e:
            logger.error(f"Failed to read file {file_path}: {e}")
            raise KnowledgeLoadError(f"Failed reading {file_path.name}: {e}")

    def load_dataset(self) -> KnowledgeDataset:
        """Scans all category subdirectories inside KnowledgeBase and validates entries."""
        logger.info(f"Scanning KnowledgeBase root directory: {self.base_path}")
        
        dataset_kwargs: Dict[str, Any] = {
            "dictionary": [],
            "phrases": [],
            "government": [],
            "agriculture": [],
            "healthcare": [],
            "culture": [],
            "education": [],
            "tourism": [],
            "faq": [],
            "metadata": {}
        }

        if not self.base_path.exists():
            logger.warning(f"KnowledgeBase directory '{self.base_path}' does not exist.")
            return KnowledgeDataset(**dataset_kwargs)

        for category_dir in self.base_path.iterdir():
            if not category_dir.is_dir():
                continue

            category_name = category_dir.name.lower()
            
            for file_path in category_dir.rglob("*.json"):
                try:
                    raw_data = self.load_file(file_path)
                    
                    if category_name == "metadata":
                        if isinstance(raw_data, dict):
                            dataset_kwargs["metadata"].update(raw_data)
                        continue

                    model_cls = MODEL_MAPPINGS.get(category_name)
                    entries = raw_data if isinstance(raw_data, list) else [raw_data]

                    for item in entries:
                        if not isinstance(item, dict):
                            continue

                        if model_cls:
                            try:
                                validated_obj = model_cls(**item)
                                dataset_kwargs[category_name].append(validated_obj)
                            except Exception as val_err:
                                logger.error(f"Validation error in {file_path.name} ({category_name}): {val_err}")
                        else:
                            logger.info(f"Unmapped category '{category_name}', skipping validation for {item.get('id')}")

                except (KnowledgeLoadError, InvalidKnowledgeFileError) as err:
                    logger.error(f"Skipping knowledge file {file_path}: {err}")

        result_dataset = KnowledgeDataset(**dataset_kwargs)
        logger.info("KnowledgeBase scanning and validation complete.")
        return result_dataset
