import pandas as pd
from functools import lru_cache
from pathlib import Path

QC_FILE = Path(__file__).parent.parent.parent / "data" / "values.xlsx"

# Parameters that use predefined Bias% from Excel (from EQA/peer-group data)
USE_PREDEFINED_BIAS = {"WBC", "RBC", "HGB", "HCT"}


@lru_cache(maxsize=1)
def load_qc_data() -> dict:
    """Load and cache QC reference data from values.xlsx."""
    df = pd.read_excel(QC_FILE, index_col=0, skiprows=2)
    df.index   = df.index.astype(str).str.strip()
    df.columns = df.columns.astype(str).str.strip()
    df = df.dropna(how="all").dropna(axis=1, how="all")

    qc = {}
    for param in df.columns:
        try:
            raw_bias = df.loc["Bias%", param] if "Bias%" in df.index else None
            bias = (
                float(raw_bias)
                if raw_bias is not None and pd.notna(raw_bias) and float(raw_bias) != 0.0
                else None
            )
            qc[param] = {
                "Mean":        float(df.loc["Mean",         param]),
                "SD":          float(df.loc["Sd",           param]),
                "CV%":         float(df.loc["cv%",          param]),
                "|M-A|":       float(df.loc["IM-AI",        param]),
                "Assay":       float(df.loc["Assay Value",  param]),
                "TEa%":        float(df.loc["TEa%",         param]),
                "Target Mean": float(df.loc["Target Mean",  param]),
                "Bias%":       bias,
            }
        except KeyError:
            continue
    return qc


def calculate_sigma(param: str, report_value: float, ref: dict) -> dict:
    """
    Compute Six Sigma metrics for a single parameter.

    Formula:  σ = (TEa% − |Bias%|) / CV%
    """
    cv          = ref["CV%"]
    tea         = ref["TEa%"]
    target_mean = ref["Target Mean"]
    assay       = ref["Assay"]
    im_a        = ref["|M-A|"]
    predefined  = ref.get("Bias%")

    bias_method = ""

    if cv == 0 or tea == 0:
        final_bias  = 0.0
        final_sigma = 0.0
        bias_method = "ERROR: CV% or TEa% is zero"
    else:
        if param in USE_PREDEFINED_BIAS and predefined is not None:
            final_bias  = predefined
            bias_method = "Predefined (EQA/Excel)"
        else:
            if target_mean == 0:
                final_bias  = 0.0
                bias_method = "ERROR: Target Mean is zero"
            else:
                b1 = abs(assay - target_mean) / target_mean * 100
                b2 = abs(im_a)  / target_mean * 100
                final_bias  = round(max(b1, b2), 4)
                bias_method = "Calculated (max of Assay vs |M-A| methods)"

        final_sigma = round((tea - abs(final_bias)) / cv, 2)

    return {
        "parameter":    param,
        "reportValue":  report_value,
        "mean":         ref["Mean"],
        "sd":           ref["SD"],
        "cv":           cv,
        "ima":          im_a,
        "assay":        assay,
        "targetMean":   target_mean,
        "bias":         round(final_bias, 2),
        "tea":          tea,
        "sigma":        final_sigma,
        "biasMethod":   bias_method,
        "performance":  classify_sigma(final_sigma),
        "performanceLevel": sigma_level(final_sigma),
    }


def classify_sigma(sigma: float) -> str:
    if sigma >= 6:   return "World Class"
    elif sigma >= 5: return "Excellent"
    elif sigma >= 4: return "Good"
    elif sigma >= 3: return "Marginal"
    else:            return "Poor"


def sigma_level(sigma: float) -> str:
    """Return a short key used by the frontend for colour coding."""
    if sigma >= 6:   return "world-class"
    elif sigma >= 5: return "excellent"
    elif sigma >= 4: return "good"
    elif sigma >= 3: return "marginal"
    else:            return "poor"