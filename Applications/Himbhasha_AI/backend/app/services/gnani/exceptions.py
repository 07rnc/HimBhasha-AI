class GnaniException(Exception):
    """Base exception class for all Gnani service operations."""
    pass

class GnaniAuthException(GnaniException):
    """Raised when Gnani authentication fails or credentials are invalid."""
    pass

class GnaniAPIException(GnaniException):
    """Raised when Gnani API returns an error response status."""
    pass

class GnaniConnectionException(GnaniException):
    """Raised when connecting to the Gnani endpoint timeouts or fails."""
    pass