def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["message"] == "Server is up!"


def test_create_and_list_todos(client):
    payload = {"title": "Integration todo"}

    post_response = client.post("/todos", json=payload)
    assert post_response.status_code == 200

    get_response = client.get("/todos")

    assert get_response.status_code == 200
    data = get_response.json()
    assert len(data) == 1
    assert data[0]["title"] == payload["title"]


def test_delete_todo_endpoint(client):
    todo = {"title": "Delete via endpoint"}
    created = client.post("/todos", json=todo).json()

    delete_response = client.delete(f"/todos/{created['id']}")
    assert delete_response.status_code == 200

    list_response = client.get("/todos")
    assert list_response.status_code == 200
    assert list_response.json() == []
