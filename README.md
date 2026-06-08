# 🪙 FortuneForge: Gamified Wealth Engine

FortuneForge is a next-generation, gamified financial management and education platform. By turning personal finance metrics (income, expenses, debt, risk tolerance) into RPG-style attributes (Shield Health, Mana, Character Class, XP), FortuneForge transforms boring financial planning into an engaging adventure.

Equipped with an **AI Financial Coach** powered by Google Gemini, squires can explore personalized quests, scale a commitment leaderboard, and forge their way toward financial independence.

<p align="center">
  <a href="https://your-vercel-live-link.com" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo Vercel" />
  </a>
  <a href="https://render.com" target="_blank">
    <img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Backend Render" />
  </a>
  <a href="#-demo-video">
    <img src="https://img.shields.io/badge/Watch%20Demo-Video%20Play-gold?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Full%20Stack-Platform-darkgoldenrod?style=for-the-badge" alt="Full Stack" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/Gemini%20AI-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini" />
</p>

---

## 📺 Demo Video

> [!TIP]
> **Click the button below to watch the video demo once you upload the video file into the repository:**
> 
> [![Watch Demo Video](https://img.shields.io/badge/Play_Demo_Video-Click_Here-darkred?style=for-the-badge&logo=youtube&logoColor=white)](demo_video.mp4)

---

## 🚀 Key Features

*   **🛡️ Gamified Financial Health Metrics:**
    *   **Budget Shield (Emergency Fund):** Measures your emergency reserve status. Accumulating 3 months of essential expenses achieves 100% Shield Health.
    *   **Cash Flow Mana (Surplus Rate):** Volatile energy level determined by your saving habits and debt burden. Keeping debt low restores your monthly Mana pool.
*   **🧙 Character Class Selection:** Select from 4 risk profiles during onboarding to forge your destiny:
    *   **Conservative:** *Gilt Defender*
    *   **Balanced:** *Compounding Squire*
    *   **Growth:** *Leveraged Knight*
    *   **Speculative:** *Arbitrage Wizard*
*   **🤖 AI Coach (Google Gemini Integration):** Get real-time, personalized financial guidance. The AI chatbot automatically pulls your character's class, income, expenses, and risk profile to tailor responses.
*   **📜 Quest Board & Rewards Vault:** Embark on weekly financial quests (e.g., subscription audits, saving challenges) to earn XP, scale levels, and unlock RPG relics.
*   **🏆 Commitment Leaderboard:** Scale the ranks against fellow players based on XP points and active weekly commitment streaks.
*   **🔑 Unified OAuth Authentication:** Secure and easy sign-in with Google or Microsoft accounts.

---

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), Tailwind CSS, Lucide React (Icons), HTML5/CSS3.
*   **Backend:** FastAPI (Python), SQLite (Database), SQLAlchemy (ORM), JWT (Auth), Uvicorn.
*   **AI Engine:** Google Gemini Pro API.

---

## 📦 Project Directory Structure

```text
FortuneForge/
├── FrontEnd/                # React Vite Frontend app
│   ├── src/
│   │   ├── components/      # UI Components (Dashboard, QuestBoard, AIChatbot, etc.)
│   │   ├── App.jsx          # Application entrypoint & state controller
│   │   └── index.css        # Main stylesheet
│   └── .env                 # Frontend environment variables
└── BackEnd/
    ├── server.js            # Alternate Node/Express mock backend
    └── FortuneForge/        # Core Python Backend
        └── backend/         # FastAPI Application
            ├── app/
            │   ├── models/  # SQLAlchemy schemas (User, Investment)
            │   ├── routes/  # API Routers (auth, user, AI, investments)
            │   ├── db/      # Database session setup
            │   └── services/# Auth utils, AI Coach services
            ├── .env         # Backend environment variables
            └── main.py      # Entry point for FastAPI Uvicorn server
```

---

## 🔧 Installation & Local Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **Python** (v3.9+) installed.

### 2. Setting Up the Backend
1. Navigate to the Python backend folder:
   ```bash
   cd BackEnd/FortuneForge/backend
   ```
2. Activate the virtual environment:
   * **Windows:**
     ```bash
     .venv\Scripts\activate
     ```
   * **macOS/Linux:**
     ```bash
     source .venv/bin/activate
     ```
3. Create a `.env` file inside the `backend` folder and add:
   ```env
   JWT_SECRET=your_super_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

> [!IMPORTANT]
> **🔑 OTP Verification Code for Testing / Demo Mode:**
> When registering or signing up via OAuth for the first time, you will be prompted for a **6-digit OTP verification code**.
> - For local development, testing, and staging, you can simply enter **`123456`** to bypass verification.
> - Alternatively, you can check the backend console logs where the server is running; the generated OTP code is printed there automatically.

### 3. Setting Up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd FrontEnd
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `FrontEnd` and add:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Run the frontend:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment (Vercel & Render)

For production, FortuneForge is deployed as a decoupled application:
*   **Frontend:** Hosted on **Vercel** (static React hosting with SPA fallback).
*   **Backend:** Hosted on **Render** (FastAPI service with a persistent SQLite disk).

For complete, step-by-step instructions on deploying the frontend and backend, setting up database persistence, and configuring environment variables, refer to the [DEPLOYMENT.md](DEPLOYMENT.md) guide.