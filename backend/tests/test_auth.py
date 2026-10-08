from uuid import uuid4


def get_unique_email(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex[:8]}@example.com"


def test_register_user(client):
    email = get_unique_email("pytestuser")

    response = client.post(
        "/auth/register",
        json={
            "name": "Pytest User",
            "email": email,
            "password": "Test@123"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Pytest User"
    assert data["email"] == email
    assert data["role"] == "user"


def test_login_user(client):
    email = get_unique_email("loginuser")

    client.post(
        "/auth/register",
        json={
            "name": "Login User",
            "email": email,
            "password": "Test@123"
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": "Test@123"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_protected_me_without_token(client):
    response = client.get("/me")

    assert response.status_code == 401


def test_protected_me_endpoint(client):
    email = get_unique_email("protecteduser")

    client.post(
        "/auth/register",
        json={
            "name": "Protected User",
            "email": email,
            "password": "Test@123"
        }
    )

    login_response = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": "Test@123"
        }
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    response = client.get(
        "/me",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Protected User"
    assert data["email"] == email

