from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from .models import ContributionType, ContributionStatus

class ContributionCreateRequest(BaseModel):
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

class ContributionUpdateRequest(BaseModel):
    title: Optional[str] = None
    kangri: Optional[str] = None
    hindi: Optional[str] = None
    english: Optional[str] = None
    description: Optional[str] = None
    pronunciation: Optional[str] = None
    keywords: Optional[List[str]] = None
    category: Optional[str] = None
    district: Optional[str] = None

class ContributionRejectRequest(BaseModel):
    reason: Optional[str] = "Does not meet editorial guidelines"

class StatisticsResponse(BaseModel):
    total_contributions: int = 0
    pending_count: int = 0
    approved_count: int = 0
    rejected_count: int = 0
    dictionary_entries: int = 0
    phrases_count: int = 0
    stories_count: int = 0
    recipes_count: int = 0
    by_type: Dict[str, int] = Field(default_factory=dict)
    by_district: Dict[str, int] = Field(default_factory=dict)
