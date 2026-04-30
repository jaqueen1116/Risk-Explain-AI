from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_empty_description():
    """Should fail with 422 if description is too short."""
    response = client.post("/analyze", json={
        "risk_score": 50,
        "category": "Operational",
        "scenario_description": "Short",
        "severity": "Medium",
        "selected_model": "groq"
    })
    assert response.status_code == 422
    assert "at least 10 characters" in response.text

def test_out_of_bounds_score():
    """Should fail with 422 if score is > 100."""
    response = client.post("/analyze", json={
        "risk_score": 150,
        "category": "Operational",
        "scenario_description": "This is a valid long enough description for testing.",
        "severity": "Medium",
        "selected_model": "groq"
    })
    assert response.status_code == 422

def test_invalid_model():
    """Should fail with 422 if model is not in literal."""
    response = client.post("/analyze", json={
        "risk_score": 50,
        "category": "Operational",
        "scenario_description": "This is a valid long enough description for testing.",
        "severity": "Medium",
        "selected_model": "invalid_model_name"
    })
    assert response.status_code == 422

if __name__ == "__main__":
    # Manual run if pytest not available
    print("Running health check...")
    test_health_check()
    print("Running empty description test...")
    test_empty_description()
    print("Running out of bounds score test...")
    test_out_of_bounds_score()
    print("Running invalid model test...")
    test_invalid_model()
    print("All tests passed!")
