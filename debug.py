import sys
import os

sys.path.insert(0, os.path.abspath("backend"))

from app.core.ocr import parse_parameters
from app.core.sigma_engine import load_qc_data

text = """
HEMATOLOGY REPORT
Patient: John Doe

Test Results:
WBC 7.5 x10^3
RBC 4.8 x10^6
HGB 14.2 g/dL
HCT 42.5 %
MCV 90.0 fL
MCH 29.5 pg
MCHC 34.0 g/dL
PLT 250 x10^3
"""

print("EXTRACTED:")
extracted = parse_parameters(text)
print(extracted)

print("\nQC KEYS:")
qc = load_qc_data()
print(list(qc.keys()))

print("\nMATCHES:")
matches = [p for p in extracted if p in qc]
print(matches)
