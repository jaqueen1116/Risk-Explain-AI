from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal

class RiskInput(BaseModel):
    risk_score: float = Field(..., ge=0, le=100)
    category: str = Field(..., min_length=1)
    scenario_description: str = Field(..., min_length=10) # Enforce some context
    severity: str = "Medium" # Default if not provided
    selected_model: Literal["groq", "openai", "huggingface"] = "groq"

class SummarySchema(BaseModel):
    risk_score: float
    category: str
    severity: str
    key_issue: str
    impact: str

class AssessmentSchema(BaseModel):
    level: str
    trend: str

class AnalysisResponse(BaseModel):
    explanation: str
    mitigation: List[str]  # Matching strict schema naming
    summary: SummarySchema
    compliance: str  # Matching strict schema naming
    risk_assessment: AssessmentSchema
    confidence_score: int
    adjustment_warning: Optional[str] = None

    @validator('confidence_score')
    def validate_confidence(cls, v):
        if not 50 <= v <= 95:
            # Clip to range if out of bounds to ensure reliability
            return max(50, min(95, v))
        return v
