from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze, upload

app = FastAPI(title="Sigma Lab Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api", tags=["Analyze"])
app.include_router(upload.router,  prefix="/api", tags=["Upload"])

@app.get("/")
def root():
    return {"message": "Sigma Lab Analyzer API is running"}
