import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple

from .models import ContributionModel, ContributionStatus
from .schemas import ContributionCreateRequest, ContributionUpdateRequest
from .validation import ContributionValidator
from .duplicate_detector import DuplicateDetector
from .moderation import ModerationManager
from .export_service import ContributionExportService

logger = logging.getLogger("contribution_service")

class ContributionService:
    """Main service layer orchestrating community contributions, validation, duplicate checks, and moderation."""

    def __init__(self, moderation_mgr: Optional[ModerationManager] = None):
        self.moderation_mgr = moderation_mgr or ModerationManager()
        self.duplicate_detector = DuplicateDetector()

    def submit_contribution(self, req: ContributionCreateRequest) -> Tuple[bool, str, Optional[ContributionModel]]:
        """Validates payload, checks for duplicates, and persists as a pending contribution."""
        # 1. Validation
        valid, err_msg, clean_req = ContributionValidator.validate_contribution(req)
        if not valid or not clean_req:
            return False, err_msg or "Validation failed.", None

        # 2. Duplicate Detection
        is_dup, dup_reason, dup_score = self.duplicate_detector.check_duplicate(
            title=clean_req.title,
            kangri=clean_req.kangri or "",
            hindi=clean_req.hindi or ""
        )
        if is_dup:
            return False, f"Duplicate contribution rejected: {dup_reason}", None

        # 3. Create Model Instance
        new_id = f"contrib_{uuid.uuid4().hex[:10]}"
        now_str = datetime.now().isoformat()

        model = ContributionModel(
            id=new_id,
            type=clean_req.type,
            title=clean_req.title,
            kangri=clean_req.kangri,
            hindi=clean_req.hindi,
            english=clean_req.english,
            description=clean_req.description,
            pronunciation=clean_req.pronunciation,
            keywords=clean_req.keywords,
            category=clean_req.category,
            district=clean_req.district,
            submitted_by=clean_req.submitted_by,
            submitted_at=now_str,
            status=ContributionStatus.PENDING
        )

        # 4. Save to Pending Queue
        success = self.moderation_mgr.save_pending(model)
        if success:
            logger.info(f"Contribution submitted successfully: ID={new_id}")
            return True, "Contribution submitted successfully and sent to moderation queue.", model
        else:
            return False, "Failed to persist contribution to pending queue.", None

    def get_contributions(
        self,
        status: Optional[str] = None,
        type_filter: Optional[str] = None,
        district_filter: Optional[str] = None,
        search_query: Optional[str] = None
    ) -> List[ContributionModel]:
        """Fetches filtered list of community contributions."""
        return self.moderation_mgr.list_contributions(
            status=status,
            type_filter=type_filter,
            district_filter=district_filter,
            search_query=search_query
        )

    def approve_contribution(self, item_id: str) -> Optional[ContributionModel]:
        """Approves pending contribution."""
        return self.moderation_mgr.approve(item_id)

    def reject_contribution(self, item_id: str, reason: str = "") -> Optional[ContributionModel]:
        """Rejects pending contribution."""
        return self.moderation_mgr.reject(item_id, reason)

    def delete_contribution(self, item_id: str) -> bool:
        """Deletes contribution record."""
        return self.moderation_mgr.delete(item_id)

    def export_contributions(self, format_type: str = "json", status: Optional[str] = None) -> Tuple[str, str]:
        """Exports contributions in JSON or CSV format."""
        items = self.get_contributions(status=status)
        if format_type.lower() == "csv":
            content = ContributionExportService.export_as_csv(items)
            filename = f"contributions_{status or 'all'}_{datetime.now().strftime('%Y%m%d')}.csv"
            return content, filename
        else:
            content = ContributionExportService.export_as_json(items)
            filename = f"contributions_{status or 'all'}_{datetime.now().strftime('%Y%m%d')}.json"
            return content, filename

    def get_statistics(self) -> Dict[str, Any]:
        """Retrieves real-time moderation and contribution statistics."""
        return self.moderation_mgr.get_statistics()
