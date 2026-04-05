git# 🧪 Sigma Lab Report Analyzer

Full-stack Six Sigma hematology QC analyzer.
**Frontend**: React + Tailwind CSS (Vite) | **Backend**: FastAPI (Python)

---

## Project Structure

```
sigma-analyzer/
├── backend/
│   ├── main.py                   ← FastAPI entry point
│   ├── requirements.txt
│   ├── data/
│   │   └── values.xlsx           ← ⚠️  Place your QC file here
│   └── app/
│       ├── core/
│       │   ├── sigma_engine.py   ← Sigma calculation logic
│       │   └── ocr.py            ← Text extraction (PDF/image/txt)
│       └── routes/
│           ├── analyze.py        ← POST /api/analyze (manual)
│           └── upload.py         ← POST /api/upload (OCR) + /export
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx               ← Router + sidebar layout
        ├── api/
        │   ├── client.js         ← Axios API calls
        │   └── utils.js          ← Sigma color/format helpers
        ├── components/
        │   ├── ResultsTable.jsx
        │   ├── SigmaChart.jsx
        │   ├── SigmaBadge.jsx
        │   ├── StatCard.jsx
        │   └── PageHeader.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── ManualEntry.jsx
            ├── OCRUpload.jsx
            └── ExportPage.jsx
```

---

## ⚙️ Setup

### 1. Place your QC data file

Copy your `values.xlsx` (the fixed one) into:
```
backend/data/values.xlsx
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the API server
uvicorn main:app --reload --port 8000
```

Backend will be live at: http://localhost:8000
API docs (auto-generated): http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend

# Install npm packages
npm install

# Start dev server
npm run dev
```

Frontend will be live at: http://localhost:5173

---

## 🔌 API Endpoints

| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | /api/parameters   | List supported QC parameters         |
| POST   | /api/analyze      | Manual entry → Sigma results         |
| POST   | /api/upload       | File upload → OCR → Sigma results    |
| POST   | /api/export       | Results list → Excel file download   |
| GET    | /api/qc-reference | Raw QC reference data (debug)        |

### POST /api/analyze — Request body
```json
{
  "values": {
    "WBC": 5.6,
    "RBC": 4.2,
    "HGB": 13.5,
    "HCT": 40.1
  }
}
```

---

## 🧮 Six Sigma Formula

```
σ = (TEa% − |Bias%|) / CV%
```

| Parameter          | Bias% Method         | TEa% (CLIA 2024) |
|--------------------|----------------------|-----------------|
| WBC, RBC, HGB, HCT | Predefined (Excel)  | 10%, 4%, 4%, 4% |
| MCV, MCH, MCHC     | Calculated at runtime| 7%, 7%, 7%      |

### Sigma Performance Scale
| Sigma | Rating      |
|-------|-------------|
| ≥ 6   | World Class |
| 5–6   | Excellent   |
| 4–5   | Good        |
| 3–4   | Marginal    |
| < 3   | Poor        |

---

## 🖥️ Pages

| Page         | Route     | Description                              |
|--------------|-----------|------------------------------------------|
| Dashboard    | /         | Summary stats, chart, full results table |
| Manual Entry | /manual   | Enter values directly via form           |
| OCR Upload   | /upload   | Upload PDF/image/txt for auto-extraction |
| Export       | /export   | Download results as formatted Excel      |

---

## 📦 Tech Stack

**Frontend**
- React 18 + React Router 6
- Tailwind CSS 3
- Recharts (bar chart)
- Axios (API calls)
- Lucide React (icons)
- Vite (dev server + bundler)

**Backend**
- FastAPI
- Pandas + OpenPyXL + XlsxWriter
- PDFPlumber (PDF text extraction)
- Pytesseract (OCR for images)
- Pillow (image handling)
- Uvicorn (ASGI server)
