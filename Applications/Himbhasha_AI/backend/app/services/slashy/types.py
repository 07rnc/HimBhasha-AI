from pydantic import BaseModel
from typing import Optional

class SlashyTicketPayload(BaseModel):
    type: str  # "feedback" or "complaint" or "moderation"
    user_id: Optional[str] = None
    title: str
    description: str

class SlashyTicketResult(BaseModel):
    ticket_id: str
    status: str