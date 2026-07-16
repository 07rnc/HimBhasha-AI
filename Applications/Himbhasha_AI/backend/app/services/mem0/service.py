from .client import Mem0Client
from .types import MemoryItem, MemorySearchPayload, MemoryUpdatePayload
import logging
import uuid
from datetime import datetime

logger = logging.getLogger("mem0_service")

class Mem0Service:
    def __init__(self, client: Mem0Client):
        self.client = client
        self.client.verify_credentials()

    async def get_memories(self, payload: MemorySearchPayload) -> list[MemoryItem]:
        logger.info(f"Retrieving memory context for user: {payload.user_id}")
        # Return mock memory items like preferences
        return [
            MemoryItem(
                id=str(uuid.uuid4()),
                text="User prefers formal greetings and is studying Kangdi vocabulary.",
                timestamp=str(datetime.now())
            )
        ]

    async def add_memory(self, payload: MemoryUpdatePayload) -> bool:
        logger.info(f"Storing conversational memory token for user {payload.user_id}: '{payload.text}'")
        return True