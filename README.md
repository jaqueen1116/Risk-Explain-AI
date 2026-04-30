# Risk-Explain-AI
RiskExplain AI is an AI-powered web application that analyzes business risk scenarios and generates realistic risk scores, severity levels, mitigation strategies, and compliance insights. It intelligently corrects unrealistic user inputs using LLM-based reasoning and rule-based validation.
# RiskExplain AI – Technical Documentation Report
**Project Name:** RiskExplain AI – Intelligent Risk Communication Platform  

---

## 1. Project Overview

### Purpose of the System
RiskExplain AI is an enterprise-grade financial risk communication platform designed to transform complex, multi-dimensional risk data into highly actionable, premium-formatted insights. It bridges the gap between raw data analysis and executive-level decision-making.

### Problem it Solves
Traditional risk calculators rely on static matrices and user self-assessment, leading to subjective bias, under-escalation of critical threats, and over-escalation of minor inconveniences. RiskExplain AI solves this by introducing an objective, AI-driven intelligence layer that validates, contextualizes, and mathematically corrects human bias in real-time.

### Target Users
*   **Chief Risk Officers (CROs) & Compliance Officers**: Requiring instant, audit-ready summaries of emerging threats.
*   **Operations Managers**: Needing prioritized, realistic mitigation steps for daily incidents.
*   **Non-Expert Stakeholders**: Who require clear, plain-language translations of complex financial or cyber risks.

### Real-World Use Cases
*   Evaluating the operational impact of IT downtime (e.g., "Server outage for 2 hours").
*   Assessing legal/compliance exposure from data handling errors.
*   Quickly generating board-level risk summaries for emerging market volatility.

### Why AI is Needed
Standard logic gates cannot comprehend the semantic severity of a text-based scenario like "CEO arrested for embezzlement." AI is required to parse the natural language context, determine the real-world business impact, and enforce objective scoring constraints that prevent users from submitting inaccurate evaluations.

---

## 2. Full Technology Stack

### Frontend Architecture
*   **React 18**: Chosen for its robust component-based architecture, efficient virtual DOM rendering, and mature ecosystem. It allows for the seamless state management required for the dynamic dashboard.
*   **Vite**: Utilized as the build tool and development server. Chosen for its ultra-fast Hot Module Replacement (HMR) and optimized esbuild compilation, drastically reducing development iteration time.
*   **Tailwind CSS v4**: A utility-first CSS framework used for rapid UI development. It enables the creation of complex, responsive layouts and custom design tokens (like the specific RiskExplain color palette) without leaving the JSX markup.
*   **Framer Motion**: Integrated for declarative, physics-based animations. Essential for the premium "glassmorphism" feel, providing smooth layout shifts, floating background elements, and dynamic loading states.
*   **Lucide React Icons**: Selected for its clean, modern, and highly customizable vector graphics, perfectly matching the enterprise fintech aesthetic.

### Backend Architecture
*   **Python 3**: The core backend language, chosen for its unparalleled ecosystem in AI integration and data processing.
*   **FastAPI**: A modern, high-performance web framework. Chosen over Django/Flask due to its native asynchronous support (`async/await`)—critical for non-blocking LLM API calls—and automatic OpenAPI documentation.
*   **Uvicorn**: A lightning-fast ASGI web server implementation, serving as the robust foundation for FastAPI's asynchronous operations.
*   **Pydantic**: Used for strict data validation and serialization. It ensures that incoming payloads perfectly match the `RiskInput` schema and guarantees that the outgoing `AnalysisResponse` adheres to the required contract, preventing frontend crashes.
*   **python-dotenv**: Securely loads environment variables, ensuring sensitive AI provider API keys are never hardcoded or exposed in version control.

### AI Integrations & Multi-Provider Fallback
*   **Groq API (Llama-3-70b-versatile)**: The primary engine, selected for its ultra-fast inference speeds (LPUs), enabling near-instantaneous risk analysis.
*   **OpenAI API (GPT-4o)**: The premium reasoning engine, serving as the first fallback for complex scenarios requiring deeper logic.
*   **Hugging Face API (Mistral-7B)**: The open-weight backup provider.
*   **Why Multi-Provider Fallback?**: Enterprise systems cannot afford downtime. By implementing a "Provider Waterfall," the system gracefully routes around rate limits, expired keys, or provider outages, ensuring maximum uptime and reliability.

---

## 3. Complete Frontend Architecture

### SPA Structure & Components
The application operates as a Single Page Application (SPA), dynamically mounting components without page reloads.
*   **`App.jsx`**: The orchestrator. Manages the global state (`analysis`, `history`, `activeTab`), handles the routing between the Dashboard and History views, and executes the API fetch calls.
*   **`RiskForm.jsx`**: The interactive input component managing the category dropdown, scenario text area, and the interactive risk slider.
*   **`RiskMeter.jsx`**: An SVG-based arc component that visualizes the risk score. It dynamically calculates the stroke-dasharray and changes colors based on real-time thresholds.
*   **`ResultCard.jsx`**: A highly reusable UI component utilizing glassmorphism styles to display discrete pieces of the AI analysis (e.g., Mitigations, Confidence).
*   **`ModelSelector.jsx`**: A UI toggle allowing the user to dictate the primary LLM routing.

### State Management & Logic
State is managed via React hooks (`useState`, `useEffect`). 
*   **Risk Form Logic**: As the user drags the slider, local state updates the UI instantly, rendering the appropriate Severity Badge.
*   **Dashboard Rendering**: The `AnimatePresence` wrapper monitors the `analysis` state. Once data resolves, the Result Cards mount sequentially using staggered animation delays.

### LocalStorage & History
*   The `history` state is initialized lazily by reading `localStorage.getItem('riskHistory')`.
*   A `useEffect` hook monitors the `history` array. Whenever a new analysis completes, it is unshifted into the array, and the array is serialized back to LocalStorage, capped at 10 items to prevent QuotaExceeded errors.

### Theme, UI Design, & Animations
*   **Glassmorphism**: Achieved via Tailwind's `bg-white/40 backdrop-blur-2xl border-white/5` utilities, creating a layered, translucent aesthetic.
*   **Dark/Light Mode**: Toggled via a `dark` class applied to the HTML root, switching CSS variables defining mesh gradient opacity and grid visibility.
*   **Responsive Design**: Utilizes Tailwind's mobile-first breakpoints (`md:`, `lg:`, `xl:`) to reflow the 4-column result grid into a single column on mobile devices.
*   **Animations**: Framer Motion handles the `AILoader` bouncing dots, the sequential fade-in of the dashboard, and the floating background `MeshGradient`.

---

## 4. Complete Backend Architecture

### API Endpoints & Validation
*   **`GET /health`**: A lightweight endpoint allowing the frontend to poll backend availability, updating the "ONLINE/OFFLINE" pill in the UI.
*   **`POST /analyze`**: The primary operational endpoint.
*   **Request Validation**: The incoming JSON is validated against the `RiskInput` Pydantic model. If invalid types are sent, FastAPI automatically rejects the request with a 422 Unprocessable Entity error.

### POST /analyze Workflow
1.  **Ingestion**: FastAPI receives the validated `RiskInput`.
2.  **Routing**: The `input_data.selected_model` dictates the primary provider in the fallback array.
3.  **Execution**: The asynchronous loop attempts to call the AI provider.
4.  **Fallback Mechanism**: `try/except` blocks catch connection errors, timeouts, or authentication failures, continuing the loop to the next provider.
5.  **Mock Fallback**: If all external APIs fail, `get_mock_response()` is triggered to return a simulated response, guaranteeing UI continuity.
6.  **Response Construction**: The AI output is cleaned, overriding logic is applied, and the final dictionary is unpacked into the `AnalysisResponse` Pydantic model.

---

## 5. Full AI Prompt Engineering

### Blind Evaluation Strategy & Anchoring Prevention
One of the most critical architectural decisions is the **Blind Evaluation** approach. Large Language Models exhibit "Prompt Anchoring"—if informed of a user's selected risk score (e.g., 88), the model's attention mechanisms will heavily bias its output to justify that score, even if the scenario is trivial (e.g., "Empty coffee machine").
*   **The Fix**: The backend completely strips the user's selected score from the prompt payload.
*   **The Prompt**: The AI receives only the Category and Scenario Description, alongside a strict directive: *"Independently evaluate this scenario and assign a highly realistic `adjusted_score` (0-100). A minor inconvenience is 5-15. A major disaster is 90-100."*

### JSON Structured Output
The prompt enforces a strict JSON schema contract. Because LLMs occasionally wrap outputs in markdown code blocks (````json ... ````), the `extract_json()` utility function employs Regex (`re.search(r'\{.*\}', text, re.DOTALL)`) to isolate and parse the raw JSON payload, making the system highly fault-tolerant.

---

## 6. Full Risk Calculation System

### Severity Thresholds
The entire platform relies on a strict 4-tier mathematical threshold system:
*   **0 – 25**: Low Severity (Emerald)
*   **26 – 50**: Moderate Severity (Amber)
*   **51 – 75**: High Severity (Rose)
*   **76 – 100**: Critical Severity (Purple)

### Score Override Logic (The Intelligence Gate)
Once the LLM returns its blind evaluation (`llm_score`), the backend compares it to the user's input (`original_score`). The override triggers if:
1.  `abs(llm_score - original_score) > 15` (A mathematical divergence of more than 15%).
2.  **OR** `get_severity_from_score(llm_score) != get_severity_from_score(original_score)` (A semantic tier boundary is crossed, e.g., High to Critical).

If triggered, `returned_score = llm_score`, and the `adjustment_warning` is generated. If not triggered, the system respects the user's `original_score`.

### Confidence Score Calculation
If the AI fails to return a confidence score, the backend calculates it algorithmically:
*   **Word Count > 20**: `85% - 95%` (High context yields high confidence).
*   **Word Count > 10**: `70% - 84%` (Moderate context).
*   **Word Count < 10**: `55% - 69%` (Low context).
*   **Contradiction Penalty**: If the override logic triggered, confidence is mathematically capped lower, as conflicting human-vs-machine inputs represent a volatile assessment.

### Trend Mapping Matrix
*   Low Severity → `Stable`
*   Moderate Severity → `Monitoring`
*   High Severity → `Increasing`
*   Critical Severity → `Critical Escalation`

---

## 7. Data Flow Step by Step

1.  **Initialization**: User opens the React app; Vite serves the bundle; `App.jsx` polls `GET /health` to confirm backend connectivity.
2.  **Input**: User enters data into `RiskForm.jsx`. The UI state updates instantly to reflect color thresholds.
3.  **Submission**: User clicks "Analyze." `App.jsx` sets `isThinking` to `true`, mounting the `AILoader`.
4.  **Transmission**: React sends a `POST` request with JSON to `http://localhost:8005/analyze`.
5.  **Processing**: FastAPI validates the schema, hides the score, and requests an evaluation from Groq.
6.  **AI Generation**: Groq evaluates the text and returns a structured JSON string.
7.  **Data Cleaning**: Python's `extract_json()` and `clean_ai_response()` format the data.
8.  **Algorithmic Override**: Python compares the scores, applies the 15-point rule, and constructs the final `AnalysisResponse`.
9.  **Reception**: React receives the 200 OK response. `App.jsx` updates `loadedFormData` to reflect the AI's adjusted score.
10. **Storage & Render**: The data is pushed to LocalStorage. The dashboard remounts, displaying the `Sparkles` warning banner and cascading `ResultCards`.

---

## 8. Libraries Used

### Frontend Libraries
*   **`react` / `react-dom`**: UI rendering engine.
*   **`vite`**: Rapid build tool and dev server.
*   **`tailwindcss` / `@tailwindcss/vite`**: CSS framework for styling.
*   **`framer-motion`**: Animation and transition engine.
*   **`lucide-react`**: Vector icon system.

### Backend Libraries
*   **`fastapi`**: Asynchronous API framework.
*   **`uvicorn`**: ASGI server runner.
*   **`pydantic`**: Data schema validation.
*   **`openai`**: SDK for GPT-4o integration.
*   **`groq`**: SDK for Llama-3 integration.
*   **`huggingface_hub`**: SDK for Mistral-7B integration.
*   **`python-dotenv`**: Environment variable management.

---

## 9. UI / UX Design Philosophy

*   **Glassmorphism**: Translucent panels with background blur mimic high-end enterprise software, establishing authority and modernity.
*   **Premium Dark Theme**: Deep blacks and slate grays reduce eye strain for compliance officers analyzing data for long periods.
*   **Neon Gradients**: Primary (Blue), Secondary (Purple), and Highlight (Cyan) gradients are used sparingly to draw attention to critical calls to action (Analyze button, Title).
*   **Transparency Banners**: The system never silently overrides user data. When a score is corrected, a glowing purple banner explicitly states the action taken, building immense **User Trust**.

---

## 10. Local Storage System

*   **Saving Logic**: Upon a successful 200 OK API response, the frontend merges the `formData` and `analysisData` into a single `HistoryItem` object with an ISO timestamp.
*   **Max Records**: The array is unshifted (newest first) and instantly sliced: `updated.slice(0, 10)`, guaranteeing the payload never exceeds a few kilobytes and prevents browser storage limits.
*   **Retrieval Logic**: On app load, `localStorage.getItem('riskHistory')` is parsed inside a `try/catch` block (to prevent crashes from corrupted JSON) and initializes the history state.
*   **Clear Logic**: A dedicated function allows the user to purge the array and wipe LocalStorage upon `window.confirm()` verification.

---

## 11. Error Handling

*   **Invalid API Key**: Handled gracefully by the backend; the specific provider `try` block fails, triggering the `except` block which routes to the next provider.
*   **Rate Limits / Network Failure**: Handled identical to bad API keys via the Provider Waterfall.
*   **Invalid JSON from LLM**: Caught by the `extract_json()` regex fallback. If totally unparseable, a `ValueError` is raised, causing the backend to return a 500 status code.
*   **Empty/Invalid Input**: Pydantic intercepts missing fields before processing begins, returning a 422 Unprocessable Entity.
*   **Frontend Display**: The React app catches any 4xx or 5xx status codes, sets the `error` state, and mounts a customized, visually distinct red `AlertTriangle` banner with the error message.

---

## 12. Performance Optimization

*   **Vite Speed**: Utilizes native ES modules for instantaneous dev server startup and optimized Rollup builds for production.
*   **FastAPI Async**: All LLM network calls utilize `await`, ensuring the Python server thread is never blocked while waiting for OpenAI/Groq to respond.
*   **Efficient Rendering**: `AnimatePresence` ensures DOM nodes are completely removed when not visible, rather than just hidden via CSS, reducing memory footprint.
*   **Lightweight Icons**: Lucide-React relies on raw SVGs rather than font files, drastically reducing bundle size.

---

## 13. Security Details

*   **Environment Variables**: Private keys (`OPENAI_API_KEY`, etc.) are isolated in `.env` and omitted from version control via `.gitignore`.
*   **Input Sanitization**: Pydantic guarantees that only expected fields (category, score, description) enter the processing pipeline, stripping malicious arbitrary data.
*   **Safe Output Parsing**: `json.loads()` is strictly utilized; `eval()` is never used to parse AI responses, preventing Remote Code Execution (RCE) vulnerabilities.

---

## 14. Future Enhancements

*   **PDF Report Export**: Implementation of `pdfmake` or `jsPDF` to generate audit-ready compliance documents directly from the UI.
*   **Authentication & Role-Based Access**: Integration of JWT/OAuth to separate "Risk Inputters" from "Risk Approvers."
*   **Risk Analytics Dashboard**: Aggregating historical data via a PostgreSQL database to plot organizational risk trends over time using Chart.js.
*   **Audit Logs**: Server-side tracking of who submitted risks and when the AI algorithm overrode human inputs.

---

## 15. Project Strengths

RiskExplain AI transcends traditional basic calculators by removing the liability of human error. Basic calculators accept whatever the user inputs, often resulting in "garbage in, garbage out" scenarios. RiskExplain acts as a safety net—an intelligent filter that understands the *semantic reality* of the input, mathematically enforces enterprise rules, and ensures that the final dashboard is objective, accurate, and immediately actionable. 

---

## 16. Conclusion

RiskExplain AI is a highly sophisticated, fault-tolerant platform that seamlessly marries a beautiful, modern React frontend with a robust, asynchronous Python backend. Through careful prompt engineering, mathematical safeguarding, and a multi-tiered fallback architecture, the system guarantees reliable performance and provides unparalleled value in the domain of risk communication.
