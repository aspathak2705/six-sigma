from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.sigma_engine import load_qc_data, calculate_sigma

router = APIRouter()


class ParameterInput(BaseModel):
    values: dict[str, float]   # e.g. {"WBC": 5.6, "RBC": 4.2, ...}


@router.post("/analyze")
def analyze(body: ParameterInput):
    """
    Accept manually entered hematology values and return Sigma metrics.
    """
    qc = load_qc_data()

    if not qc:
        raise HTTPException(status_code=500, detail="QC reference data could not be loaded.")

    results = []
    for param in qc.keys():
        value = body.values.get(param, None)
        results.append(calculate_sigma(param, value, qc[param]))

    if not results:
        raise HTTPException(status_code=400, detail="No matching QC parameters found for provided values.")

    return {
        "status":  "success",
        "count":   len(results),
        "results": results,
    }


@router.get("/parameters")
def get_parameters():
    """Return the list of supported QC parameters."""
    qc = load_qc_data()
    return {"parameters": list(qc.keys())}


@router.get("/qc-reference")
def get_qc_reference():
    """Return the full QC reference table (for the debug panel)."""
    qc = load_qc_data()
    return {"reference": qc}
