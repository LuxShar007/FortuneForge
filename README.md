# 🪙 FortuneForge: Gamified Wealth Engine

FortuneForge is a next-generation, gamified financial management and education platform. By turning personal finance metrics (income, expenses, debt, risk tolerance) into RPG-style attributes (Shield Health, Mana, Character Class, XP), FortuneForge transforms boring financial planning into an engaging adventure.

Equipped with an **AI Financial Coach** powered by Google Gemini, squires can explore personalized quests, scale a commitment leaderboard, and forge their way toward financial independence.

<p align="center">
  <a href="https://your-live-website.com" target="_blank">
    <img src="https://img.shields.io/badge/Visit%20Website-Live%20Demo-goldenrod?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Visit Website" />
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

## 🌐 Deploying to GitHub Pages

GitHub Pages is designed for hosting **static websites (frontend only)**. Because FortuneForge relies on a dynamic backend (FastAPI and SQLite), a full deployment requires hosting the backend on an external server.

### Steps to Deploy:
1. **Host the Backend:** Deploy the FastAPI application to a platform like **Render**, **Railway**, **fly.io**, or **Heroku**.
2. **Update API URLs:** Update the `fetch` endpoints in the frontend code from `http://localhost:8000` to your hosted backend URL.
3. **Build Frontend:** Compile the static React assets:
   ```bash
   npm run build
   ```
4. **Deploy Frontend:** Use the `gh-pages` npm package to deploy the `dist` directory to your GitHub repository.