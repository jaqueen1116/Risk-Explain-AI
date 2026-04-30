from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import RiskInput, AnalysisResponse
from ai_service import analyze_risk

app = FastAPI(title="RiskExplain AI API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(input_data: RiskInput):
    print(f"Received analysis request: {input_data.category} - {input_data.risk_score}")
    try:
        result = await analyze_risk(input_data)
        print(f"Analysis successful: {result.risk_assessment.level}")
        return result
    except Exception as e:
        print(f"Analysis failed: {str(e)}")
        # Log the full error for debugging but return a cleaner message
        raise HTTPException(
            status_code=500, 
            detail=f"Analysis Engine Error: {str(e)}"
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
