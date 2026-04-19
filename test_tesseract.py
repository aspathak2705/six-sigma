from PIL import Image
import pytesseract
print("Imported successfully")
try:
    img = Image.new("RGB", (100, 100), color="white")
    text = pytesseract.image_to_string(img)
    print("Text extracted:", repr(text))
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
