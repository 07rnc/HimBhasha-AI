from pydantic import BaseModel
from typing import List, Optional

class MemoryItem(BaseModel):
    id: str
    text: str
    timestamp: str

class MemorySearchPayload(BaseModel):
    user_id: str
    query: str

class MemoryUpdatePayload(BaseModel):
    user_id: str
    text: str