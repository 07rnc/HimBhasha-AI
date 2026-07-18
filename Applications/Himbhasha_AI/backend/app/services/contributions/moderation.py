import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime

from .models import ContributionModel, ContributionStatus, ContributionType

logger = logging.getLogger("contribution_moderation")

class ModerationManager:
    """Manages community contribution queue persistence (pending, approved, rejected JSON files)."""

    def __init__(self, base_dir: Optional[str] = None):
        if base_dir:
            self.base_dir = Path(base_dir)
        else:
            self.base_dir = Path(__file__).parent.parent.parent.parent / "KnowledgeBase" / "community"

        self.pending_dir = self.base_dir / "pending"
        self.approved_dir = self.base_dir / "approved"
        self.rejected_dir = self.base_dir / "rejected"

        # Ensure directories exist
        for d in [self.pending_dir, self.approved_dir, self.rejected_dir]:
            d.mkdir(parents=True, exist_ok=True)

    def _get_file_path(self, item_id: str) -> Tuple[Optional[Path], Optional[ContributionStatus]]:
        """Finds file path for a given contribution ID across queues."""
        for status_enum, dir_path in [
            (ContributionStatus.PENDING, self.pending_dir),
            (ContributionStatus.APPROVED, self.approved_dir),
            (ContributionStatus.REJECTED, self.rejected_dir)
        ]:
            target = dir_path / f"{item_id}.json"
            if target.exists():
                return target, status_enum
        return None, None

    def save_pending(self, model: ContributionModel) -> bool:
        """Saves a new contribution model into the pending directory."""
        try:
            target_path = self.pending_dir / f"{model.id}.json"
            with open(target_path, "w", encoding="utf-8") as f:
                json.dump(model.model_dump(), f, ensure_ascii=False, indent=2)
            logger.info(f"Saved pending contribution ID: {model.id}")
            return True
        except Exception as e:
            logger.error(f"Failed saving pending contribution: {e}")
            return False

    def approve(self, item_id: str) -> Optional[ContributionModel]:
        """Moves a contribution from pending/rejected to approved queue."""
        file_path, current_status = self._get_file_path(item_id)
        if not file_path or not file_path.exists():
            return None

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            model = ContributionModel(**data)
            model.status = ContributionStatus.APPROVED

            # Remove old file
            file_path.unlink()

            # Save in approved dir
            new_path = self.approved_dir / f"{item_id}.json"
            with open(new_path, "w", encoding="utf-8") as f:
                json.dump(model.model_dump(), f, ensure_ascii=False, indent=2)

            logger.info(f"Approved contribution ID: {item_id}")
            return model
        except Exception as e:
            logger.error(f"Failed approving contribution {item_id}: {e}")
            return None

    def reject(self, item_id: str, reason: str = "") -> Optional[ContributionModel]:
        """Moves a contribution from pending/approved to rejected queue."""
        file_path, current_status = self._get_file_path(item_id)
        if not file_path or not file_path.exists():
            return None

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            model = ContributionModel(**data)
            model.status = ContributionStatus.REJECTED
            model.rejection_reason = reason or "Does not meet guidelines"

            # Remove old file
            file_path.unlink()

            # Save in rejected dir
            new_path = self.rejected_dir / f"{item_id}.json"
            with open(new_path, "w", encoding="utf-8") as f:
                json.dump(model.model_dump(), f, ensure_ascii=False, indent=2)

            logger.info(f"Rejected contribution ID: {item_id}")
            return model
        except Exception as e:
            logger.error(f"Failed rejecting contribution {item_id}: {e}")
            return None

    def delete(self, item_id: str) -> bool:
        """Deletes a contribution file from disk."""
        file_path, _ = self._get_file_path(item_id)
        if file_path and file_path.exists():
            file_path.unlink()
            logger.info(f"Deleted contribution ID: {item_id}")
            return True
        return False

    def list_contributions(
        self,
        status: Optional[str] = None,
        type_filter: Optional[str] = None,
        district_filter: Optional[str] = None,
        search_query: Optional[str] = None
    ) -> List[ContributionModel]:
        """Lists contributions filtered by status, type, district, and search string."""
        results: List[ContributionModel] = []

        dirs_to_scan = []
        if status == "pending":
            dirs_to_scan = [self.pending_dir]
        elif status == "approved":
            dirs_to_scan = [self.approved_dir]
        elif status == "rejected":
            dirs_to_scan = [self.rejected_dir]
        else:
            dirs_to_scan = [self.pending_dir, self.approved_dir, self.rejected_dir]

        q = (search_query or "").strip().lower()

        for dir_path in dirs_to_scan:
            for file_path in dir_path.glob("*.json"):
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    model = ContributionModel(**data)

                    # Filters
                    if type_filter and model.type.value != type_filter and model.type != type_filter:
                        continue
                    if district_filter and model.district != district_filter:
                        continue
                    if q:
                        text_content = f"{model.title} {model.kangri} {model.hindi} {model.english} {model.description}".lower()
                        if q not in text_content:
                            continue

                    results.append(model)
                except Exception as e:
                    logger.error(f"Error reading contribution file {file_path}: {e}")

        # Sort by submitted_at descending
        results.sort(key=lambda x: x.submitted_at, reverse=True)
        return results

    def get_statistics(self) -> Dict[str, Any]:
        """Calculates real-time contribution metrics by status, type, and district."""
        pending_files = list(self.pending_dir.glob("*.json"))
        approved_files = list(self.approved_dir.glob("*.json"))
        rejected_files = list(self.rejected_dir.glob("*.json"))

        total = len(pending_files) + len(approved_files) + len(rejected_files)

        by_type: Dict[str, int] = {}
        by_district: Dict[str, int] = {}

        dict_entries = 0
        phrases_cnt = 0
        stories_cnt = 0
        recipes_cnt = 0

        for file_path in self.pending_dir.glob("*.json"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    d = json.load(f)
                t = d.get("type", "Other")
                dist = d.get("district", "Kangra")

                by_type[t] = by_type.get(t, 0) + 1
                by_district[dist] = by_district.get(dist, 0) + 1

                if t in ["Dictionary Word", "Dictionary"]:
                    dict_entries += 1
                elif t in ["Phrase", "Phrasebook"]:
                    phrases_cnt += 1
                elif t in ["Story", "Folk Story"]:
                    stories_cnt += 1
                elif t in ["Recipe", "Local Recipe"]:
                    recipes_cnt += 1
            except Exception:
                pass

        for file_path in self.approved_dir.glob("*.json"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    d = json.load(f)
                t = d.get("type", "Other")
                dist = d.get("district", "Kangra")

                by_type[t] = by_type.get(t, 0) + 1
                by_district[dist] = by_district.get(dist, 0) + 1

                if t in ["Dictionary Word", "Dictionary"]:
                    dict_entries += 1
                elif t in ["Phrase", "Phrasebook"]:
                    phrases_cnt += 1
                elif t in ["Story", "Folk Story"]:
                    stories_cnt += 1
                elif t in ["Recipe", "Local Recipe"]:
                    recipes_cnt += 1
            except Exception:
                pass

        return {
            "total_contributions": total,
            "pending_count": len(pending_files),
            "approved_count": len(approved_files),
            "rejected_count": len(rejected_files),
            "dictionary_entries": dict_entries,
            "phrases_count": phrases_cnt,
            "stories_count": stories_cnt,
            "recipes_count": recipes_cnt,
            "by_type": by_type,
            "by_district": by_district
        }
