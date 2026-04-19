<div align="center">
  <img src="https://img.icons8.com/color/96/000000/microscope.png" alt="Sigma Analyzer Logo" width="80" />
  <h1 align="center">Sigma Analyzer</h1>
  <p align="center">
    <strong>A Premium, AI-Powered Clinical Diagnostic & Six Sigma QC Hub</strong>
  </p>
  <p align="center">
    <a href="https://github.com/aspathak2705/six-sigma/stargazers"><img src="https://img.shields.io/github/stars/aspathak2705/six-sigma" alt="Stars" /></a>
    <a href="https://github.com/aspathak2705/six-sigma/network/members"><img src="https://img.shields.io/github/forks/aspathak2705/six-sigma" alt="Forks" /></a>
    <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-blue" alt="Frontend" />
    <img src="https://img.shields.io/badge/Backend-FastAPI-009688" alt="Backend" />
    <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC" alt="Styling" />
  </p>
</div>

---

## 📖 Overview

The **Sigma Lab Report Analyzer** is a state-of-the-art laboratory quality control application. It seamlessly blends OCR machine-learning with rigorous clinical formulas, allowing healthcare professionals to feed raw hematopathology data (via PDF, image, or manual entry) directly into a predictive **Six Sigma** analysis engine. 

Designed around the "Verdant Aura" clinical aesthetic, the platform guarantees not only accuracy but also a visually stunning, responsive, and seamless user experience.

<br>

## ✨ Key Features

- **🧠 Neural OCR Extraction:** Drag and drop medical PDFs or JPGs/PNGs. The backend architecture automatically parses physiological parameters from raw clinical documents via Tesseract OCR.
- **🧮 Automated Six Sigma Engine:** Computes Sigma ($\sigma$) values dynamically utilizing internal clinical QC data (`values.xlsx`) and the strict CLIA 2024 TEa% Benchmarks.
- **📊 Real-time Clinical Dashboard:** Visualizes overall system health, categorizing analytical performance from "Poor" to "World Class".
- **📱 Fully Responsive:** Carefully crafted layouts that adapt seamlessly from ultrafine desktop monitors to mobile iOS/Android devices.
- **📤 Export to Excel:** Instantly generate formatted diagnostic reports for institutional archives.

<br>

## 🛠️ Architecture & Tech Stack

This project is decoupled into two primary architectures: a highly responsive React Single Page Application (SPA) and an asynchronous Python/FastAPI calculation server.

### Frontend
- **Framework:** React 18 & Vite
- **Styling:** Tailwind CSS (Custom "Verdant Aura" Design System)
- **Routing:** React Router v6
- **Charting:** Recharts
- **HTTP Client:** Axios
- **Deployment Strategy:** Vercel (Configured with custom routing `vercel.json`)

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **OCR Engine:** Pytesseract (Tesseract OCR) & PDFPlumber
- **Data Science:** Pandas, OpenPyXL, Numpy
- **Server:** Uvicorn
- **Deployment Strategy:** Docker (Optimized for Render / AWS)

<br>

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js `v18+`
- Python `3.10+`
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) installed on your operating system (Required for backend).

### 1. Backend Setup (FastAPI)
```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install core dependencies
pip install -r requirements.txt

# Start the server (Development)
uvicorn main:app --reload --port 8000
```
*Note: Make sure your QC Excel database is present at `backend/data/values.xlsx`.*

### 2. Frontend Setup (React/Vite)
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install package dependencies
npm install

# Start Vite development server
npm run dev
```

### 3. Environment Configuration
Create a `.env.local` inside the `frontend` directory (Optional for local dev as Vite defaults to `/api` proxy):
```env
VITE_API_URL=http://localhost:8000/api
```

<br>

## 🔌 API Endpoints Reference

The FastAPI backend automatically generates interactive Swagger documentation. When the backend is running, navigate to `http://localhost:8000/docs` to test endpoints directly in your browser.

| Method | Endpoint              | Description                                                    |
|--------|-----------------------|----------------------------------------------------------------|
| `GET`  | `/api/parameters`     | Fetch dynamic parameters supported by the Six Sigma engine.    |
| `POST` | `/api/analyze`        | Submit manual JSON payload for clinical calculation.           |
| `POST` | `/api/upload`         | Upload `multipart/form-data` for OCR extraction and analysis.  |
| `POST` | `/api/export`         | Export processed clinical JSON into an institutional XLSX file.|


<br>

## 🧬 Scientific Methodology: Six Sigma

The clinical intelligence core relies on the standard laboratory Quality Control formula:
> **$\sigma = (TE_{a} - |Bias|) / CV$**

Where:
- **$TE_{a}$**: Total Allowable Error (benchmarked against updated CLIA 2024 records).
- **Bias**: Measure of systematic error or inaccuracy.
- **CV**: Coefficient of Variation (analytical precision).

Results are quantified natively into 5 clinical stages:
`World Class (>6)` • `Excellent (5-6)` • `Good (4-5)` • `Marginal (3-4)` • `Poor (<3)`

<br>

---

<div align="center">
    <p>Built with precision and care. 🧬</p>
</div>
