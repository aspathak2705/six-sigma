from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from app.core.ocr import extract_text_from_bytes, parse_parameters
from app.core.sigma_engine import load_qc_data, calculate_sigma
import pandas as pd
from io import BytesIO

router = APIRouter()


@router.post("/upload")
async def upload_report(file: UploadFile = File(...)):
    """
    Accept a PDF / image / text file, run OCR, extract parameters,
    and return Sigma metrics.
    """
    allowed = {"application/pdf", "text/plain",
               "image/png", "image/jpeg", "image/jpg", "image/webp"}

    content_type = file.content_type or ""
    if content_type not in allowed:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {content_type}. Allowed: PDF, PNG, JPG, TXT."
        )

    content = await file.read()
    text = extract_text_from_bytes(content, content_type)

    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract any text from the file.")

    extracted = parse_parameters(text)
    if not extracted:
        raise HTTPException(
            status_code=422,
            detail="No hematology parameters found. Try manual entry or a clearer image."
        )

    qc = load_qc_data()
    results = []
    for param, value in extracted.items():
        if param in qc:
            results.append(calculate_sigma(param, value, qc[param]))

    return {
        "status":          "success",
        "filename":        file.filename,
        "extractedText":   text[:500],   # preview snippet
        "extractedValues": extracted,
        "count":           len(results),
        "results":         results,
    }


@router.post("/export")
def export_results(body: dict):
    """
    Accept a list of result dicts and return an Excel file as a download.
    """
    results = body.get("results", [])
    if not results:
        raise HTTPException(status_code=400, detail="No results to export.")

    df = pd.DataFrame(results)

    # Rename columns for clean Excel headers
    rename_map = {
        "parameter":       "Parameter",
        "reportValue":     "Report Value",
        "mean":            "Mean",
        "sd":              "SD",
        "cv":              "CV%",
        "ima":             "|M-A|",
        "assay":           "Assay",
        "targetMean":      "Target Mean",
        "bias":            "Bias%",
        "tea":             "TEa%",
        "sigma":           "Sigma",
        "biasMethod":      "Bias Method",
        "performance":     "Performance",
        "performanceLevel":"Level",
    }
    df = df.rename(columns=rename_map)

    output = BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name="Sigma Analysis")
        wb = writer.book
        ws = writer.sheets["Sigma Analysis"]

        # Header format
        hdr_fmt = wb.add_format({
            "bold": True, "bg_color": "#1F4E79",
            "font_color": "#FFFFFF", "border": 1
        })
        for col_num, col_name in enumerate(df.columns):
            ws.write(0, col_num, col_name, hdr_fmt)
            ws.set_column(col_num, col_num, max(len(col_name) + 4, 14))

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=sigma_analysis.xlsx"},
    )
