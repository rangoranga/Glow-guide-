# BareIQ ✨

**Your skincare BFF that actually gets you** 💅

A Gen Z-focused skincare recommendation app for the Indian market. Get personalized product suggestions based on your skin type, tone, and concerns - all backed by dermatologists and research.

## Features

- 🎯 **Personalized Quiz** - Takes your skin profile into account
- 🇮🇳 **Indian Market Only** - Products available on Nykaa, Amazon India
- 👩‍⚕️ **Doctor Approved** - Dermatologist-tested recommendations
- 🔥 **Streak Tracking** - Build consistent skincare habits
- 💜 **Gen Z Design** - Dark mode, gradients, vibes

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- Python 3.9+
- FastAPI
- SQLAlchemy (SQLite)
- Pydantic

## Quick Start

### 1. Install Node.js (if not installed)

Download from: https://nodejs.org/

Or use nvm:
```bash
nvm install 20
nvm use 20
```

### 2. Start the Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0
```

Backend will run on http://localhost:8000

The backend now auto-seeds the product database on startup. You can also seed/check it manually:
```bash
curl -X POST http://localhost:8000/api/seed
```

Or visit http://localhost:8000/api/seed in your browser.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:3000

If your backend is running somewhere other than `http://localhost:8000`, create `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/api/health` | Health check |
| POST | `/api/quiz/submit` | Submit quiz, get recommendations |
| GET | `/api/products` | Get all products |
| GET | `/api/products?category=serum` | Filter products |
| GET | `/api/recommendations/{userId}` | Get user's recommendations |
| POST | `/api/seed` | Seed database with products |

## API Documentation

Visit http://localhost:8000/docs for interactive Swagger UI.

## Product Database

The app comes pre-loaded with 50+ curated Indian market products from brands like:
- Minimalist
- The Ordinary
- Plum
- Dot & Key
- Foxtale
- Mamaearth
- Himalaya
- Kama Ayurveda
- Forest Essentials
- And more!

## Project Structure

```
skincare-app/
├── backend/
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── api/            # FastAPI routers
│   │   ├── services/       # Business logic
│   │   ├── data/           # Product JSON database
│   │   ├── main.py         # FastAPI app
│   │   └── database.py     # DB config
│   ├── venv/               # Python virtual env
│   └── requirements.txt
├── frontend/
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   ├── styles/             # CSS
│   └── package.json
└── README.md
```

## Screenshots

The app features:
- Dark mode with vibrant purple/pink/teal gradients
- Multi-step quiz with progress tracking
- Visual skin tone selector (Indian shades)
- Product cards with match scores
- Streak counter for gamification

## Future Features (Phase 2 & 3)

- AI photo analysis for skin concerns
- Chat interface alternative to quiz
- User accounts with email
- Product reviews and ratings
- Routine tracker with reminders
- Share results with friends

## Made with 💜 for Indian skincare lovers
