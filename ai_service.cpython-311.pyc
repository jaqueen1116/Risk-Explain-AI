import asyncio
from models import RiskInput
from ai_service import analyze_risk

async def test():
    req = RiskInput(risk_score=87, category="Operational", severity="High", scenario_description="Coffee machine empty", selected_model="groq")
    res = await analyze_risk(req)
    print("\nFINAL RESULT:", res.model_dump_json())

if __name__ == "__main__":
    asyncio.run(test())
