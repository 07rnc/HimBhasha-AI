from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union

class DictionaryEntry(BaseModel):
    id: Union[int, str]
    kangri: str
    hindi: str
    english: str
    pronunciation: Optional[str] = None
    part_of_speech: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    synonyms: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    confidence: Optional[float] = 1.0

class PhraseEntry(BaseModel):
    id: Union[int, str]
    kangri: str
    hindi: str
    english: str
    category: Optional[str] = "general"
    context: Optional[str] = None

class GovernmentEntry(BaseModel):
    id: Union[int, str]
    scheme_name: str
    description: str
    eligibility: Optional[str] = None
    benefits: Optional[str] = None
    department: Optional[str] = None

class AgricultureEntry(BaseModel):
    id: Union[int, str]
    crop_name: str
    ideal_season: Optional[str] = None
    soil_type: Optional[str] = None
    common_diseases: List[str] = Field(default_factory=list)
    recommendations: Optional[str] = None

class HealthcareEntry(BaseModel):
    id: Union[int, str]
    facility_name: str
    services_offered: List[str] = Field(default_factory=list)
    district: Optional[str] = None
    contact: Optional[str] = None

class CultureEntry(BaseModel):
    id: Union[int, str]
    festival_name: str
    region: Optional[str] = None
    significance: Optional[str] = None
    traditions: List[str] = Field(default_factory=list)

class EducationEntry(BaseModel):
    id: Union[int, str]
    institution_name: str
    location: Optional[str] = None
    established_year: Optional[int] = None
    courses: List[str] = Field(default_factory=list)

class TourismEntry(BaseModel):
    id: Union[int, str]
    place_name: str
    district: Optional[str] = None
    historical_significance: Optional[str] = None
    best_time_to_visit: Optional[str] = None

class FAQEntry(BaseModel):
    id: Union[int, str]
    question: str
    answer: str
    category: Optional[str] = "general"

class KnowledgeDataset(BaseModel):
    dictionary: List[DictionaryEntry] = Field(default_factory=list)
    phrases: List[PhraseEntry] = Field(default_factory=list)
    government: List[GovernmentEntry] = Field(default_factory=list)
    agriculture: List[AgricultureEntry] = Field(default_factory=list)
    healthcare: List[HealthcareEntry] = Field(default_factory=list)
    culture: List[CultureEntry] = Field(default_factory=list)
    education: List[EducationEntry] = Field(default_factory=list)
    tourism: List[TourismEntry] = Field(default_factory=list)
    faq: List[FAQEntry] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
