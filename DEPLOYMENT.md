# 🚀 FortuneForge Production Deployment Guide

This document describes how to deploy the **FortuneForge** application to production using **Render** for the Python backend and **Vercel** for the React frontend.

---

## 1. Backend Deployment (Render)

We have configured a `render.yaml` Blueprint file at the repository root. This automates the setup, including provisioning a **1 GB Persistent Disk** to store the SQLite database so data is not lost when the service restarts.

### Steps to Deploy:
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Blueprint**.
2. Connect your Git repository.
3. Render will auto-detect the `render.yaml` configuration.
4. Set the required **Environment Variables** in the Render Blueprint UI:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID (optional, for auth).
   - `JWT_SECRET`: Leave blank or set a custom secret. Render will generate a cryptographically secure key automatically.
5. Click **Apply**. Render will automatically build the service and expose a web URL (e.g., `https://fortuneforge-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

Vercel provides zero-configuration hosting for Vite/React applications.

### Steps to Deploy:
1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New** > **Project**.
2. Import your Git repository.
3. Configure the Project Settings:
   - **Framework Preset:** Select `Vite` (usually auto-detected).
   - **Root Directory:** Edit this to `FrontEnd` (since the frontend code is in the `FrontEnd` subdirectory).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add the following **Environment Variable** in Vercel:
   - Key: `VITE_API_URL`
   - Value: The URL of your live Render backend (e.g., `https://fortuneforge-backend.onrender.com` without trailing slash).
5. Click **Deploy**. Vercel will build your static React app and provide a live URL (e.g., `https://fortuneforge.vercel.app`).

---

## 3. Environment Variables Summary

Ensure these are properly set in your deployment panels:

### Backend (Render Environment)
| Variable Name | Description | Value Type |
|---|---|---|
| `DATABASE_URL` | SQLite database URI | `sqlite:////var/data/fortuneforge.db` (auto-configured) |
| `JWT_SECRET` | Secret key for signing tokens | Generated automatically or user-defined |
| `GEMINI_API_KEY` | Google Gemini AI Key | Obtained from Google AI Studio |
| `GOOGLE_CLIENT_ID` | OAuth Client ID | Optional (for Google Sign-In verification) |

### Frontend (Vercel Environment)
| Variable Name | Description | Value Type |
|---|---|---|
| `VITE_API_URL` | URL of the live FastAPI backend | E.g. `https://your-backend.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | OAuth Client ID | Optional (for Google Sign-In button) |
| `VITE_MICROSOFT_CLIENT_ID`| Microsoft OAuth Client ID | Optional (for Microsoft Sign-In) |
