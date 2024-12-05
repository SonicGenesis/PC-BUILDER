from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.config import engine, Base
from app.models import models, auth  # Import both model modules
from app.routers import components, categories, analytics, crawler, auth as auth_router
from app.services.scheduler import CrawlerScheduler
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PC Builder API",
    description="API for PC Builder application with automated price updates",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)  # Include auth router first
app.include_router(components.router)
app.include_router(categories.router)
app.include_router(analytics.router)
app.include_router(crawler.router)

# Initialize the crawler scheduler
scheduler = CrawlerScheduler()

@app.on_event("startup")
async def startup_event():
    """
    Initialize services on application startup.
    """
    try:
        logger.info("Starting PC Builder API...")
        
        # Start the price update scheduler
        scheduler.start()
        logger.info("Price update scheduler started successfully")
        
        # Log active jobs
        jobs = scheduler.get_jobs()
        for job in jobs:
            logger.info(f"Scheduled job: {job.name} (Next run: {job.next_run_time})")
            
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """
    Clean up services on application shutdown.
    """
    try:
        logger.info("Shutting down PC Builder API...")
        scheduler.shutdown()
        logger.info("Price update scheduler stopped successfully")
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")
        raise

@app.get("/")
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "message": "Welcome to PC Builder API",
        "docs": "/docs",
        "redoc": "/redoc",
        "features": [
            "User authentication and authorization",
            "Role-based access control",
            "Automated price updates every 15 minutes",
            "Real-time price comparison",
            "Component tracking",
            "Price history"
        ]
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint with scheduler status.
    """
    jobs = scheduler.get_jobs()
    next_update = jobs[0].next_run_time if jobs else None
    
    return {
        "status": "healthy",
        "scheduler": {
            "active": bool(jobs),
            "next_update": next_update,
            "job_count": len(jobs)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 