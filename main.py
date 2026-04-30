import os
import sys
from dotenv import load_dotenv

# Ensure we can import from the current directory
sys.path.append(os.getcwd())

load_dotenv()

def check_apis():
    print("--- API DIAGNOSTIC REPORT ---")
    
    openai_key = os.getenv("OPENAI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")
    hf_token = os.getenv("HF_API_TOKEN")

    print(f"OpenAI Key: {'[DETECTED]' if openai_key else '[MISSING]'}")
    print(f"Groq Key: {'[DETECTED]' if groq_key else '[MISSING]'}")
    print(f"Hugging Face Token: {'[DETECTED]' if hf_token else '[MISSING]'}")

    print("\n--- Package Verification ---")
    try:
        import openai
        import groq
        import huggingface_hub
        print("Required Python packages are correctly installed.")
    except ImportError as e:
        print(f"MISSING PACKAGE: {e}")

    print("\n--- Client Initialization Mock Test ---")
    try:
        from ai_service import openai_client, groq_client, hf_client
        print("Clients initialized successfully.")
    except Exception as e:
        print(f"INITIALIZATION ERROR: {e}")

if __name__ == "__main__":
    check_apis()
