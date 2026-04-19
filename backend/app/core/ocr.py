import re
import pytesseract
import pdfplumber
from PIL import Image
from io import BytesIO


def extract_text_from_bytes(content: bytes, content_type: str) -> str:
    """Extract raw text from PDF, image, or plain-text bytes."""
    if content_type == "application/pdf":
        with pdfplumber.open(BytesIO(content)) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)

    elif content_type.startswith("image/"):
        image = Image.open(BytesIO(content))
        return pytesseract.image_to_string(image)

    elif content_type == "text/plain":
        return content.decode("utf-8", errors="ignore")

    return ""


# Parameter patterns — order matters (MCHC before MCH)
_PATTERNS = {
    "MCHC": r"MCHC(?:[^\d]{0,50})(\d+[\.,]\d*)",
    "MCH":  r"MCH\b(?:[^\d]{0,50})(\d+[\.,]\d*)",
    "MCV":  r"MCV(?:[^\d]{0,50})(\d+[\.,]\d*)",
    "WBC":  r"(?:WBC|White\s+Blood\s+Cells?)(?:[^\d]{0,50})(\d+[\.,]?\d*)",
    "RBC":  r"(?:RBC|Red\s+Blood\s+Cells?)(?:[^\d]{0,50})(\d+[\.,]?\d*)",
    "HGB":  r"(?:HGB|HB|Hemoglobin)(?:[^\d]{0,50})(\d+[\.,]?\d*)",
    "HCT":  r"(?:HCT|Hematocrit)(?:[^\d]{0,50})(\d+[\.,]?\d*)",
    "PLT":  r"(?:PLT|Platelets?)(?:[^\d]{0,50})(\d+[\.,]?\d*)",
}


def parse_parameters(text: str) -> dict[str, float]:
    """Extract hematology parameter values from raw text using regex."""
    extracted = {}
    for param, pattern in _PATTERNS.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                num_str = match.group(1).replace(",", ".")
                extracted[param] = float(num_str)
            except ValueError:
                pass
    return extracted
