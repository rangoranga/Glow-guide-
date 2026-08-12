# BareIQ API

FastAPI backend for BareIQ, a Gen Z skincare recommendation app for the Indian market. Users take a skin quiz and get scored product matches with Nykaa / Amazon purchase links.

## Structure
```
app/
  main.py                 # app + CORS + startup product seeding
  database.py             # engine/session (SQLite default, Postgres via DATABASE_URL)
  api/                    # quiz, products, recommendations routers
  models/                 # SQLAlchemy models
  schemas/                # Pydantic schemas
  services/
    recommendation_engine.py   # scoring engine (skin type, concerns, tone, budget, prefs, quality)
  data/indian_products.json    # 43 seed products
```

## Run locally
```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Open http://localhost:8000/docs

## Key endpoints
- `POST /api/quiz/submit` - submit quiz, returns `user_id` + how many matches were saved
- `GET  /api/recommendations/{user_id}` - scored products, best match first (incl. `purchase_links`)
- `GET  /api/products` - browse/filter catalog
- `GET/POST /api/seed` - manually seed products
- `GET  /api/health`

## Frontend flow
1. `POST /api/quiz/submit` with the quiz body -> get `user_id`
2. `GET /api/recommendations/{user_id}` -> render cards with `match_score`, `reason`, `purchase_links`

## Deploy notes
- Set `FRONTEND_URL` to your frontend origin(s). Any `*.vercel.app` URL is already allowed by regex.
- For persistent data set `DATABASE_URL` to a Postgres URL (`postgres://` is auto-normalized). SQLite on ephemeral hosts resets on redeploy but re-seeds on startup.

### Deploying on Vercel
- Vercel's Python runtime only supports 3.12, 3.13, 3.14 (no 3.11), so the version is pinned via `.python-version` instead of the old Heroku-style `runtime.txt`.
- `app/main.py` exports `app`, which is a Vercel-supported entrypoint, so no extra `api/index.py` wrapper is needed.
- SQLite will NOT work here: Vercel functions have a read-only filesystem outside `/tmp`, and `/tmp` doesn't persist across invocations or across the multiple instances Vercel spins up under load. You must set `DATABASE_URL` to a real Postgres instance (Vercel Postgres, Neon, Supabase, etc.) in the project's Environment Variables before deploying, or the quiz submit / product seed endpoints will fail or silently lose data.
- The `Procfile` is left in for Render/Heroku but Vercel ignores it entirely.
