# PC Builder Backend

A FastAPI-based backend for the PC Builder application.

## Project Structure
```
backend/
├── app/
│   ├── database/      # Database configurations and sessions
│   ├── models/        # SQLAlchemy models
│   ├── routers/       # API route handlers
│   ├── schemas/       # Pydantic models for request/response
│   ├── services/      # Business logic
│   └── main.py        # FastAPI application initialization
├── requirements.txt   # Project dependencies
└── README.md         # This file
```

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

Start the server:
```bash
# From the backend directory
python -m uvicorn app.main:app --reload
```

The API will be available at:
- API Endpoint: http://localhost:8000
- Interactive API Documentation: http://localhost:8000/docs
- Alternative API Documentation: http://localhost:8000/redoc

## Database

The application uses SQLite as the database. The database file `pc_builder.db` will be created automatically when you first run the application.

## Available Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint