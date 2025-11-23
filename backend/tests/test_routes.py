def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["message"] == "Server is up!"


def test_create_and_list_todos(client):
    payload = {"title": "Integration todo", "body": "Integration body"}

    post_response = client.post("/todos", json=payload)
    assert post_response.status_code == 200

    get_response = client.get("/todos")

    assert get_response.status_code == 200
    data = get_response.json()
    assert len(data) == 1
    assert data[0]["title"] == payload["title"]
    assert data[0]["body"] == payload["body"]


def test_delete_todo_endpoint(client):
    todo = {"title": "Delete via endpoint", "body": "delete me"}
    created = client.post("/todos", json=todo).json()

    delete_response = client.delete(f"/todos/{created['id']}")
    assert delete_response.status_code == 200

    list_response = client.get("/todos")
    assert list_response.status_code == 200
    assert list_response.json() == []


def test_update_todo_endpoint(client):
    todo = {"title": "Original title", "body": "Original body"}
    created = client.post("/todos", json=todo).json()

    update_payload = {"title": "Edited", "body": "Edited body", "completed": True}
    update_response = client.put(f"/todos/{created['id']}", json=update_payload)

    assert update_response.status_code == 200
    result = update_response.json()
    assert result["title"] == "Edited"
    assert result["body"] == "Edited body"
    assert result["completed"] is True
