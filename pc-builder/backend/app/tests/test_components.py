import pytest
from fastapi import status

@pytest.mark.asyncio
async def test_create_component(client, admin_headers):
    # First create a category
    category_data = {
        "name": "Test Category",
        "description": "Test Category Description"
    }
    category_response = await client.post("/categories/", json=category_data, headers=admin_headers)
    category_id = category_response.json()["id"]

    # Then create a component
    component_data = {
        "name": "Test Component",
        "category_id": category_id,
        "specifications": {
            "spec1": "value1",
            "spec2": "value2"
        },
        "price": 99.99,
        "manufacturer": "Test Manufacturer"
    }
    response = await client.post("/components/", json=component_data, headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == component_data["name"]
    assert data["price"] == component_data["price"]
    assert data["manufacturer"] == component_data["manufacturer"]

@pytest.mark.asyncio
async def test_get_component(client, admin_headers):
    # Create a component first
    category_data = {"name": "Test Category", "description": "Test Description"}
    category_response = await client.post("/categories/", json=category_data, headers=admin_headers)
    category_id = category_response.json()["id"]

    component_data = {
        "name": "Test Component",
        "category_id": category_id,
        "specifications": {"test": "spec"},
        "price": 99.99,
        "manufacturer": "Test Manufacturer"
    }
    create_response = await client.post("/components/", json=component_data, headers=admin_headers)
    component_id = create_response.json()["id"]

    # Get the component
    response = await client.get(f"/components/{component_id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == component_data["name"]
    assert data["category"]["name"] == category_data["name"]

@pytest.mark.asyncio
async def test_list_components(client, admin_headers):
    # Create test data
    category_data = {"name": "Test Category", "description": "Test Description"}
    category_response = await client.post("/categories/", json=category_data, headers=admin_headers)
    category_id = category_response.json()["id"]

    components = [
        {
            "name": f"Component {i}",
            "category_id": category_id,
            "specifications": {"test": f"spec{i}"},
            "price": 99.99 + i,
            "manufacturer": f"Manufacturer {i}"
        }
        for i in range(3)
    ]

    for component in components:
        await client.post("/components/", json=component, headers=admin_headers)

    # List all components
    response = await client.get("/components/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 3

@pytest.mark.asyncio
async def test_update_component(client, admin_headers):
    # Create a component first
    category_data = {"name": "Test Category", "description": "Test Description"}
    category_response = await client.post("/categories/", json=category_data, headers=admin_headers)
    category_id = category_response.json()["id"]

    component_data = {
        "name": "Original Name",
        "category_id": category_id,
        "specifications": {"test": "spec"},
        "price": 99.99,
        "manufacturer": "Original Manufacturer"
    }
    create_response = await client.post("/components/", json=component_data, headers=admin_headers)
    component_id = create_response.json()["id"]

    # Update the component
    update_data = {
        "name": "Updated Name",
        "category_id": category_id,
        "specifications": {"test": "updated_spec"},
        "price": 149.99,
        "manufacturer": "Updated Manufacturer"
    }
    response = await client.put(f"/components/{component_id}", json=update_data, headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["price"] == update_data["price"]
    assert data["manufacturer"] == update_data["manufacturer"]

@pytest.mark.asyncio
async def test_delete_component(client, admin_headers):
    # Create a component first
    category_data = {"name": "Test Category", "description": "Test Description"}
    category_response = await client.post("/categories/", json=category_data, headers=admin_headers)
    category_id = category_response.json()["id"]

    component_data = {
        "name": "To Be Deleted",
        "category_id": category_id,
        "specifications": {"test": "spec"},
        "price": 99.99,
        "manufacturer": "Test Manufacturer"
    }
    create_response = await client.post("/components/", json=component_data, headers=admin_headers)
    component_id = create_response.json()["id"]

    # Delete the component
    response = await client.delete(f"/components/{component_id}", headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK

    # Verify it's deleted
    get_response = await client.get(f"/components/{component_id}")
    assert get_response.status_code == status.HTTP_404_NOT_FOUND 