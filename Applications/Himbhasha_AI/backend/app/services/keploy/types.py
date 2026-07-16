from pydantic import BaseModel
from typing import Dict, Any, Optional

class KeployTracePayload(BaseModel):
    method: str
    endpoint: str
    request_headers: Dict[str, str]
    request_body: Dict[str, Any]
    response_body: Dict[str, Any]
    status_code: int

class KeployStatusResult(BaseModel):
    captured: bool
    test_case_id: Optional[str] = None