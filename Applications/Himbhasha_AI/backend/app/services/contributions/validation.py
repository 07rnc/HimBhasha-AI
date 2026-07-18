import re
import html
import logging
from typing import Tuple, List, Optional
from .schemas import ContributionCreateRequest

logger = logging.getLogger("contribution_validation")

class ContributionValidator:
    """Validates contribution input strings, UTF-8 integrity, and strips illegal characters."""

    @staticmethod
    def sanitize_text(text: Optional[str]) -> str:
        if not text:
            return ""
        # HTML escaping to prevent XSS injection
        clean = html.escape(text.strip())
        # Remove non-printable control characters
        clean = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", clean)
        return clean

    @staticmethod
    def validate_contribution(req: ContributionCreateRequest) -> Tuple[bool, Optional[str], ContributionCreateRequest]:
        """Validates contribution payload for required fields and character safety."""
        # Validate title
        sanitized_title = ContributionValidator.sanitize_text(req.title)
        if not sanitized_title or len(sanitized_title) < 2:
            return False, "Title must be at least 2 characters long.", req

        # Ensure at least one linguistic content field is provided
        sanitized_kangri = ContributionValidator.sanitize_text(req.kangri)
        sanitized_hindi = ContributionValidator.sanitize_text(req.hindi)
        sanitized_english = ContributionValidator.sanitize_text(req.english)
        sanitized_desc = ContributionValidator.sanitize_text(req.description)

        if not any([sanitized_kangri, sanitized_hindi, sanitized_english, sanitized_desc]):
            return False, "At least one content field (Kangri, Hindi, English, or Description) is required.", req

        # UTF-8 Encoding Check
        try:
            sanitized_title.encode("utf-8")
        except UnicodeEncodeError:
            return False, "Input content contains invalid UTF-8 encoding.", req

        # Clean keywords list
        clean_keywords = [
            ContributionValidator.sanitize_text(k)
            for k in req.keywords
            if k and len(k.strip()) > 0
        ]

        sanitized_req = ContributionCreateRequest(
            type=req.type,
            title=sanitized_title,
            kangri=sanitized_kangri,
            hindi=sanitized_hindi,
            english=sanitized_english,
            description=sanitized_desc,
            pronunciation=ContributionValidator.sanitize_text(req.pronunciation),
            keywords=clean_keywords,
            category=ContributionValidator.sanitize_text(req.category) or "General",
            district=ContributionValidator.sanitize_text(req.district) or "Kangra",
            submitted_by=ContributionValidator.sanitize_text(req.submitted_by) or "Anonymous Contributor"
        )

        return True, None, sanitized_req
