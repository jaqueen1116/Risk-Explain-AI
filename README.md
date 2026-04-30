RiskExplain AI: Intelligent Risk Communication Tool
A premium, AI-powered financial risk communication platform. Transform complex risk data into clear, actionable insights for compliance officers and non-experts. Built with an enterprise-grade realistic evaluation engine.
✨ Key Features
Intelligent Blind Evaluation: The AI acts as a senior compliance officer. It independently analyzes scenarios and automatically overrides unrealistic user-selected scores to enforce real-world business logic.
Multi-Provider AI Fallback: Seamlessly handles LLM routing between Groq (Llama-3), OpenAI (GPT-4o), and Hugging Face (Mistral). If one provider fails, the system automatically falls back to the next.
4-Tier Severity Engine: Dynamically categorizes risk into Low (Emerald), Moderate (Amber), High (Rose), and Critical (Deep Purple) thresholds.
Persistent Assessment History: Automatically saves your last 10 risk analyses to local storage, allowing you to seamlessly review past reports.
Premium Fintech Aesthetic: Glassmorphism UI, interactive cursor glow, animated floating elements, and a dynamic Risk Meter.
Dark/Light Mode: Full theme toggle support with seamless cinematic mesh gradients tailored for each mode.
🚀 Getting Started
Backend Setup (FastAPI)
Navigate to the `backend` directory:
```bash
   cd backend
   ```
Create and activate a virtual environment:
```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```
Install dependencies:
```bash
   pip install fastapi uvicorn openai groq huggingface_hub python-dotenv pydantic
   ```
Create a `.env` file from the example:
```bash
   cp .env.example .env
   ```
Add your `OPENAI_API_KEY`, `GROQ_API_KEY`, and `HF_API_TOKEN` to the `.env` file. (If no keys are provided, the system will use a Mock Fallback).
Start the backend:
```bash
   python main.py
   ```
Note: Ensure to restart the backend terminal if you modify the AI prompt or logic.
Frontend Setup (React + Vite)
Navigate to the `frontend` directory:
```bash
   cd frontend
   ```
Install dependencies:
```bash
   npm install
   ```
Start the development server:
```bash
   npm run dev
   ```
🛠 Tech Stack
Frontend: React, Vite, Tailwind CSS (v4), Framer Motion, Lucide Icons.
Backend: FastAPI (Python), Pydantic.
AI Infrastructure: Groq, OpenAI, Hugging Face via python SDKs.
