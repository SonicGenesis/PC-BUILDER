import pytest
from fastapi import status
from datetime import datetime

@pytest.mark.asyncio
async def test_log_event(client, admin_headers):
    event_data = {
        "event_type": "test_event",
        "user_id": None,
        "timestamp": datetime.utcnow().isoformat(),
        "additional_info": {"test_key": "test_value"}
    }
    response = await client.post("/analytics/events", json=event_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["event_type"] == event_data["event_type"]
    assert data["additional_info"] == event_data["additional_info"]

@pytest.mark.asyncio
async def test_get_analytics(client, admin_headers):
    # Create some test events
    events = [
        {
            "event_type": "test_event",
            "user_id": None,
            "timestamp": datetime.utcnow().isoformat(),
            "additional_info": {"test_key": f"value_{i}"}
        }
        for i in range(3)
    ]

    for event in events:
        await client.post("/analytics/events", json=event)

    # Get all analytics
    response = await client.get("/analytics/", headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 3

@pytest.mark.asyncio
async def test_get_events_by_type(client, admin_headers):
    # Create events with different types
    event_types = ["type_a", "type_b", "type_a"]
    events = [
        {
            "event_type": event_type,
            "user_id": None,
            "timestamp": datetime.utcnow().isoformat(),
            "additional_info": {"test_key": "test_value"}
        }
        for event_type in event_types
    ]

    for event in events:
        await client.post("/analytics/events", json=event)

    # Get events of type_a
    response = await client.get("/analytics/events/by-type/type_a", headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 2
    assert all(event["event_type"] == "type_a" for event in data)

@pytest.mark.asyncio
async def test_get_user_events(client, admin_headers, test_admin):
    # Create events for test user
    user_events = [
        {
            "event_type": "user_event",
            "user_id": "testadmin",
            "timestamp": datetime.utcnow().isoformat(),
            "additional_info": {"test_key": f"value_{i}"}
        }
        for i in range(2)
    ]

    for event in user_events:
        await client.post("/analytics/events", json=event)

    # Get user events
    response = await client.get("/analytics/events/by-user/testadmin", headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 2
    assert all(event["user_id"] == "testadmin" for event in data)

@pytest.mark.asyncio
async def test_analytics_access_control(client):
    # Try to access analytics without admin token
    response = await client.get("/analytics/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

    response = await client.get("/analytics/events/by-type/test_event")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

    response = await client.get("/analytics/events/by-user/testuser")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED 