from .client import KeployClient
from .types import KeployTracePayload, KeployStatusResult
import logging
import uuid

logger = logging.getLogger("keploy_service")

class KeployService:
    def __init__(self, client: KeployClient):
        self.client = client
        self.client.initialize_keploy_agent()

    async def capture_test_case(self, payload: KeployTracePayload) -> KeployStatusResult:
        if self.client.mode == "record":
            mock_id = f"test-case-{str(uuid.uuid4())[:8]}"
            logger.info(f"Keploy recorded test case automatically: {mock_id} for endpoint: {payload.endpoint}")
            return KeployStatusResult(captured=True, test_case_id=mock_id)
        return KeployStatusResult(captured=False)