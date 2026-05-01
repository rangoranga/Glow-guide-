# GlowGuide Web Deployment

This app can be deployed publicly for free as a demo/MVP.

## Free Stack

- Frontend: Vercel Hobby
- Backend: Render free web service
- Database: Supabase Postgres free project

No skincare or AI API key is required for the current quiz recommendation app.

## 1. Put the App on GitHub

Create a GitHub repository and push this folder. Do not upload `backend/venv`, `frontend/node_modules`, `.env` files, or `backend/skincare.db`.

## 2. Create Supabase Database

Create a free Supabase project, then copy the Postgres connection string.

Use the pooled connection string if Supabase recommends it for server deployments.

## 3. Deploy Backend on Render

Create a new Render web service from the GitHub repo.

Settings:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/api/health`

Environment variables:

- `DATABASE_URL`: your Supabase Postgres connection string
- `FRONTEND_URL`: your Vercel app URL, for example `https://glowguide.vercel.app`

The backend auto-creates tables and seeds the product database on startup.

## 4. Deploy Frontend on Vercel

Create a new Vercel project from the same GitHub repo.

Settings:

- Root directory: `frontend`
- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`

Environment variable:

- `NEXT_PUBLIC_API_BASE_URL`: your Render backend URL, for example `https://glowguide-api.onrender.com`

## 5. Final Check

Open the Vercel URL, take the quiz, and confirm the results page loads real recommendation scores.

If the first result load is slow, that is normal on Render free because the backend can sleep after inactivity.
