from .client import SlashyClient
from .types import SlashyTicketPayload, SlashyTicketResult
import logging
import uuid

logger = logging.getLogger("slashy_service")

class SlashyService:
    def __init__(self, client: SlashyClient):
        self.client = client
        self.client.test_webhook()

    async def create_workflow_ticket(self, payload: SlashyTicketPayload) -> SlashyTicketResult:
        logger.info(f"Registering Slashy feedback ticket type: '{payload.type}' - Title: '{payload.title}'")
        try:
            mock_ticket_id = f"slsh_{str(uuid.uuid4())[:8]}"
            return SlashyTicketResult(
                ticket_id=mock_ticket_id,
                status="queued_for_review"
            )
        except Exception as e:
            logger.error(f"Slashy integration failed: {e}")
            raise RuntimeError(f"Workflow routing failed: {e}")