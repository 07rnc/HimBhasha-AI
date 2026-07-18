class KnowledgeBaseError(Exception):
    """Base exception for KnowledgeBase service errors."""
    pass

class KnowledgeLoadError(KnowledgeBaseError):
    """Raised when loading a knowledge file fails completely."""
    pass

class InvalidKnowledgeFileError(KnowledgeBaseError):
    """Raised when a knowledge file format or JSON payload is invalid."""
    pass

class KnowledgeValidationError(KnowledgeBaseError):
    """Raised when a dataset entry fails Pydantic schema validation."""
    pass
