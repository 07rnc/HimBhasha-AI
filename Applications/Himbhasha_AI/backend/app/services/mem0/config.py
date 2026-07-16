import os

class Mem0Config:
    def __init__(self):
        self.api_key: str = os.getenv("MEM0_API_KEY", "mock_mem0_key")
        self.embedding_model: str = "text-embedding-3-small"

mem0_config = Mem0Config()