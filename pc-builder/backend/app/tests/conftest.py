import pytest
import asyncio
from fastapi.testclient import TestClient
from httpx import AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from typing import Generator, AsyncGenerator

from app.database.config import Base, get_db
from app.main import app
from app.services.auth import AuthService
from app.schemas.auth import UserCreate

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def db() -> AsyncGenerator:
    """
    Create a fresh database for each test.
    """
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
async def client(db) -> AsyncGenerator:
    """
    Create a test client using the test database.
    """
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
async def test_admin(db) -> dict:
    """
    Create a test admin user and return login credentials.
    """
    user = UserCreate(
        email="admin@test.com",
        username="testadmin",
        password="testpassword123",
        full_name="Test Admin"
    )
    admin_user = AuthService.create_user(db, user, is_superuser=True)
    admin_role = AuthService.create_role(db, "admin", "Test Admin Role", ["admin"])
    AuthService.assign_role_to_user(db, admin_user, admin_role)
    
    return {
        "username": "testadmin",
        "password": "testpassword123"
    }

@pytest.fixture(scope="function")
async def admin_token(client, test_admin) -> str:
    """
    Get an admin authentication token.
    """
    response = await client.post("/auth/login", data=test_admin)
    return response.json()["access_token"]

@pytest.fixture(scope="function")
async def admin_headers(admin_token) -> dict:
    """
    Get headers with admin authentication.
    """
    return {"Authorization": f"Bearer {admin_token}"} 