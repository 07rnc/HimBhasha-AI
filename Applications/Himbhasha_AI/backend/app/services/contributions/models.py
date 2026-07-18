from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class ContributionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ContributionType(str, Enum):
    DICTIONARY = "Dictionary Word"
    PHRASE = "Phrase"
    PROVERB = "Proverb"
    STORY = "Story"
    RECIPE = "Recipe"
    FESTIVAL = "Festival"
    PLACE = "Place"
    FOLK_SONG = "Folk Song"
    HEALTHCARE = "Healthcare Tip"
    AGRICULTURE = "Agriculture Knowledge"
    TOURISM = "Tourism Information"

class ContributionModel(BaseModel):
    id: str
    type: ContributionType
    title: str
    kangri: Optional[str] = ""
    hindi: Optional[str] = ""
    english: Optional[str] = ""
    description: Optional[str] = ""
    pronunciation: Optional[str] = ""
    keywords: List[str] = Field(default_factory=list)
    category: Optional[str] = "General"
    district: Optional[str] = "Kangra"
    submitted_by: Optional[str] = "Anonymous Contributor"
    submitted_at: str
    status: ContributionStatus = ContributionStatus.PENDING
    rejection_reason: Optional[str] = None
