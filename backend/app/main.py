from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api import quiz_router, products_router, recommendations_router
import json
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BareIQ API",
    description="Gen Z skincare recommendation app for the Indian market",
    version="1.0.0",
)


def get_allowed_origins():
    frontend_url = os.getenv("FRONTEND_URL", "").strip()
    defaults = ["http://localhost:3000", "http://127.0.0.1:3000"]
    if not frontend_url:
        return defaults
    return defaults + [origin.strip() for origin in frontend_url.split(",") if origin.strip()]


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(quiz_router)
app.include_router(products_router)
app.include_router(recommendations_router)


def seed_product_database():
    """Load bundled products when the database is empty."""
    from .database import SessionLocal
    from .models.product import Product

    db = SessionLocal()
    try:
        existing_count = db.query(Product).count()
        if existing_count > 0:
            return existing_count

        data_path = os.path.join(os.path.dirname(__file__), "data", "indian_products.json")
        with open(data_path, "r") as f:
            products_data = json.load(f)

        for prod_data in products_data:
            db.add(Product(**prod_data))

        db.commit()
        return len(products_data)
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@app.on_event("startup")
def startup_seed_products():
    seed_product_database()


@app.get("/")
def root():
    return {
        "message": "Welcome to BareIQ API - Your personalized skincare companion",
        "docs": "/docs",
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


@app.api_route("/api/seed", methods=["GET", "POST"])
def seed_products():
    """Seed the database with curated Indian market products."""
    try:
        count = seed_product_database()
        return {"message": "Product database is ready", "count": count}
    except Exception as e:
        return {"error": str(e)}
