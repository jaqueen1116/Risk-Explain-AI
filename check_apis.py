import os
import json
import re
from openai import AsyncOpenAI
from groq import AsyncGroq
from huggingface_hub import AsyncInferenceClient
from dotenv import load_dotenv
import re
from models import RiskInput, AnalysisResponse

load_dotenv()

# Client Initializations
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY") or "MISSING")
groq_client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY") or "MISSING")
hf_client = AsyncInferenceClient(token=os.getenv("HF_API_TOKEN") or "MISSING")

SYSTEM_PROMPT = """
You are an expert enterprise risk analyst for a premium AI risk platform.

Your task is to evaluate business scenarios realistically and assign an ACCURATE risk score.

CRITICAL RULES:
1. Never blindly trust the user-selected score.
2. The scenario description is the main source of truth.
3. If the selected score is unrealistic, automatically correct it.
4. Score must reflect real-world business impact.
5. Avoid exaggeration.

SCORING GUIDE:
0–25   = Low Risk
26–50  = Moderate Risk
51–75  = High Risk
76–100 = Critical Risk

EXAMPLES:
- Minor typo in presentation → 10–20
- One invoice submitted late → 15–30
- 30 minute system outage during peak hours → 45–65
- Revenue decline but still profitable → 50–65
- Fraud detected and account frozen quickly → 25–45
- Customer data breach leaked globally → 85–100
- Major compliance violation with penalties → 80–95

EVALUATE USING:
- Financial impact
- Operational disruption
- Legal / compliance exposure
- Reputation damage
- Probability of escalation
- Customer impact

RETURN STRICT JSON:

{
  "adjusted_score": number,
  "severity": "Low | Moderate | High | Critical",
  "trend": "Stable | Increasing | Decreasing",
  "confidence": "80% - 98%",
  "analysis": "2-4 sentence realistic explanation",
  "mitigations": [
    "action 1",
    "action 2",
    "action 3"
  ],
  "control_summary": {
    "category": "Risk category",
    "key_issue": "Main issue",
    "potential_impact": "Realistic impact"
  },
  "compliance_note": "Relevant governance / compliance note"
}
"""

def extract_json(text: str) -> dict:
    """Robustly extracts JSON from a string that might contain other text."""
    try:
        # Try direct load
        return json.loads(text)
    except json.JSONDecodeError:
        # Find first { and last }
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except:
                pass
        
        # Last ditch: try to fix common issues like trailing commas
        cleaned = re.sub(r',\s*\}', '}', text)
        cleaned = re.sub(r',\s*\]', ']', cleaned)
        match = re.search(r'\{.*\}', cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except:
                pass
    
    raise ValueError("Could not extract valid JSON from AI response")

def clean_ai_response(data: dict) -> dict:
    """Fixes common AI field name variations to match our schema."""
    mapping = {
        "analysis": "explanation",
        "compliance_note": "compliance",
        "risk_score": "adjusted_score"
    }
    for old_key, new_key in mapping.items():
        if old_key in data and new_key not in data:
            data[new_key] = data[old_key]
            
    if "control_summary" in data:
        data["summary"] = data["control_summary"]
        if "potential_impact" in data["summary"]:
            data["summary"]["impact"] = data["summary"].pop("potential_impact")
            
    if "trend" in data and "risk_assessment" not in data:
        data["risk_assessment"] = {"level": data.get("severity", "High").title(), "trend": data["trend"]}
        
    if "confidence" in data and "confidence_score" not in data:
        import re
        conf = data["confidence"]
        if isinstance(conf, str):
            m = re.search(r'\d+', conf)
            data["confidence_score"] = int(m.group()) if m else 85
        else:
            data["confidence_score"] = int(conf)
    
    # Ensure mitigation is a list
    if "mitigations" in data:
        data["mitigation"] = data["mitigations"]
    if "mitigation" in data and isinstance(data["mitigation"], str):
        data["mitigation"] = [data["mitigation"]]
        
    return data

def get_severity_from_score(score: float) -> str:
    """Calculates severity based on risk score."""
    if score <= 25:
        return "Low"
    elif score <= 50:
        return "Moderate"
    elif score <= 75:
        return "High"
    else:
        return "Critical"

def calculate_confidence(desc: str, has_adjustment: bool) -> int:
    words = len(desc.split())
    import random
    if has_adjustment: 
        return random.randint(55, 69) # Contradictory input lowers confidence
    if words > 20: 
        return random.randint(85, 95) # Clear detailed scenario
    if words > 10: 
        return random.randint(70, 84) # Moderate scenario
    return random.randint(55, 69)     # Vague text

def get_trend_from_severity(severity: str) -> str:
    mapping = {
        "Low": "Stable",
        "Moderate": "Monitoring",
        "High": "Increasing",
        "Critical": "Critical Escalation"
    }
    return mapping.get(severity, "Stable")

async def call_openai(prompt: str) -> dict:
    response = await openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    return clean_ai_response(extract_json(response.choices[0].message.content))

async def call_groq(prompt: str) -> dict:
    response = await groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    return clean_ai_response(extract_json(response.choices[0].message.content))

async def call_huggingface(prompt: str) -> dict:
    model = "mistralai/Mistral-7B-Instruct-v0.3"
    response = await hf_client.chat_completion(
        model=model,
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
        max_tokens=1000
    )
    return clean_ai_response(extract_json(response.choices[0].message.content))

async def analyze_risk(input_data: RiskInput) -> AnalysisResponse:
    user_prompt = (
        f"Category: {input_data.category}\n"
        f"Description: {input_data.scenario_description}\n\n"
        f"TASK: Independently evaluate this scenario and assign a highly realistic `adjusted_score` (0-100). "
        f"You must be objective. A minor inconvenience (e.g., wifi slow, coffee empty) is 5-15. A major disaster is 90-100."
    )
    
    # Provider fallback list
    providers = []
    if input_data.selected_model == "groq":
        providers = [("Groq", call_groq), ("OpenAI", call_openai), ("HF", call_huggingface)]
    elif input_data.selected_model == "openai":
        providers = [("OpenAI", call_openai), ("Groq", call_groq), ("HF", call_huggingface)]
    else:
        providers = [("HF", call_huggingface), ("Groq", call_groq), ("OpenAI", call_openai)]
    
    last_error = None
    for name, func in providers:
        # Skip if API key missing (except for mock mode at the end)
        if name == "OpenAI" and not os.getenv("OPENAI_API_KEY"): continue
        if name == "Groq" and not os.getenv("GROQ_API_KEY"): continue
        if name == "HF" and not os.getenv("HF_API_TOKEN"): continue

        try:
            print(f"Attempting analysis with {name}...")
            result = await func(user_prompt)
            print("RAW LLM OUTPUT:", result)
            
            # Check if LLM score diverges significantly from user score
            original_score = input_data.risk_score
            llm_score = result.get("adjusted_score")
            returned_score = original_score
            
            if llm_score is not None:
                llm_score = float(llm_score)
                # Override if difference > 15 OR severity tier is completely different
                if abs(llm_score - original_score) > 15 or get_severity_from_score(llm_score) != get_severity_from_score(original_score):
                    returned_score = llm_score
                    result["adjustment_warning"] = f"AI adjusted score from {original_score} to {returned_score} based on realistic severity."
            
            if "summary" not in result: result["summary"] = {}
            result["summary"]["risk_score"] = returned_score
            result["summary"]["severity"] = result.get("severity", get_severity_from_score(returned_score)).title()
            
            if "risk_assessment" not in result: result["risk_assessment"] = {}
            result["risk_assessment"]["trend"] = result.get("trend", get_trend_from_severity(result["summary"]["severity"]))
            
            # Basic validation
            if "explanation" in result:
                return AnalysisResponse(**result)
        except Exception as e:
            print(f"{name} provider failed: {e}")
            last_error = e
            continue

    # Final fallback to Mock if all providers fail or are missing keys
    print("All providers failed or keys missing. Falling back to Mock data.")
    return get_mock_response(input_data, warning)

def get_mock_response(input_data: RiskInput, warning: str = None) -> AnalysisResponse:
    score = input_data.risk_score
    level = input_data.severity
    trend = get_trend_from_severity(level)
    import random
    confidence = random.randint(80, 95)
    
    return AnalysisResponse(
        explanation=f"SIMULATED ANALYSIS: This risk centers on {input_data.category} factors. Given the {level} severity and a score of {score}, stability is at risk. Immediate monitoring is advised.",
        mitigation=["Review internal capital buffer.", "Deploy secondary monitoring nodes.", "Update stakeholder risk report."],
        summary={"risk_score": score, "category": input_data.category, "severity": level, "key_issue": "Simulated Variance", "impact": "Operational Friction"},
        compliance="Regulatory standard B-12 requirement check suggested. Formal documentation advised.",
        risk_assessment={"level": level, "trend": trend},
        confidence_score=confidence,
        adjustment_warning=warning
    )
