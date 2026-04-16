
import warnings


warnings.filterwarnings(
    "ignore",
    category=FutureWarning,
    module=r"langchain_google_genai.*",
)
warnings.filterwarnings(
    "ignore",
    message=r"(?s).*google\.generativeai.*",
    category=FutureWarning,
)
warnings.filterwarnings(
    "ignore",
    message=r"You are using a non-supported Python version.*",
    category=FutureWarning,
)
warnings.filterwarnings(
    "ignore",
    message=r"You are using a Python version 3\.9 past its end of life.*",
    category=FutureWarning,
)
