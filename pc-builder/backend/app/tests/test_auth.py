import pytest
from fastapi import status
from app.schemas.auth import UserCreate

@pytest.mark.asyncio
async def test_create_user(client, admin_headers):
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass123",
        "full_name": "Test User"
    }
    response = await client.post("/auth/users", json=user_data, headers=admin_headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["username"] == user_data["username"]
    assert "password" not in data

@pytest.mark.asyncio
async def test_login(client, test_admin):
    response = await client.post("/auth/login", data=test_admin)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    response = await client.post("/auth/login", data={
        "username": "wronguser",
        "password": "wrongpass"
    })
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.asyncio
async def test_get_current_user(client, admin_headers):
    response = await client.get("/auth/me", headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["username"] == "testadmin"
    assert data["is_superuser"] is True

@pytest.mark.asyncio
async def test_get_current_user_invalid_token(client):
    response = await client.get("/auth/me", headers={
        "Authorization": "Bearer invalid_token"
    })
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.asyncio
async def test_create_role(client, admin_headers):
    role_data = {
        "name": "test_role",
        "description": "Test Role",
        "permissions": ["view_components"]
    }
    response = await client.post("/auth/roles", json=role_data, headers=admin_headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == role_data["name"]
    assert data["description"] == role_data["description"]

@pytest.mark.asyncio
async def test_assign_role(client, admin_headers, test_admin):
    # First create a new role
    role_data = {
        "name": "editor_role",
        "description": "Editor Role",
        "permissions": ["edit_components"]
    }
    role_response = await client.post("/auth/roles", json=role_data, headers=admin_headers)
    role_id = role_response.json()["id"]
    
    # Then assign it to the test admin
    response = await client.post(
        f"/auth/users/{test_admin['username']}/roles/{role_id}",
        headers=admin_headers
    )
    assert response.status_code == status.HTTP_200_OK
    
    # Verify the role was assigned
    user_response = await client.get("/auth/me", headers=admin_headers)
    assert role_data["name"] in [role["name"] for role in user_response.json()["roles"]] 