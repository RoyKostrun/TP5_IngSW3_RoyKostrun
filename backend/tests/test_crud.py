import pytest
from pydantic import ValidationError

from app import crud, schemas


def test_create_todo_persists(db_session):
    todo_in = schemas.TodoCreate(title="Write TP6 tests", body="Add unit tests", completed=False)

    created = crud.create_todo(db_session, todo_in)

    assert created.id is not None
    assert created.title == todo_in.title
    assert created.body == todo_in.body
    assert created.completed is False


def test_get_todos_returns_list(db_session):
    crud.create_todo(db_session, schemas.TodoCreate(title="First", body="First body"))
    crud.create_todo(db_session, schemas.TodoCreate(title="Second", body="Second body"))

    result = crud.get_todos(db_session)

    assert isinstance(result, list)
    assert len(result) == 2
    titles = {todo.title for todo in result}
    assert {"First", "Second"} == titles


def test_delete_todo_existing_item(db_session):
    todo = crud.create_todo(db_session, schemas.TodoCreate(title="Remove me", body="Soon to go"))

    deleted = crud.delete_todo(db_session, todo.id)
    remaining = crud.get_todos(db_session)

    assert deleted.id == todo.id
    assert all(item.id != todo.id for item in remaining)


def test_delete_todo_missing_item(db_session):
    deleted = crud.delete_todo(db_session, todo_id=999)

    assert deleted is None


def test_create_todo_requires_title():
    with pytest.raises(ValidationError):
        schemas.TodoCreate(title=None, body="Missing title")  # type: ignore[arg-type]


def test_create_todo_requires_body():
    with pytest.raises(ValidationError):
        schemas.TodoCreate(title="Missing body", body=None)  # type: ignore[arg-type]


def test_update_todo_modifies_fields(db_session):
    todo = crud.create_todo(
        db_session,
        schemas.TodoCreate(title="Original", body="Original body"),
    )

    updated = crud.update_todo(
        db_session,
        todo.id,
        schemas.TodoUpdate(title="Updated", body="Updated body", completed=True),
    )

    assert updated.title == "Updated"
    assert updated.body == "Updated body"
    assert updated.completed is True


def test_update_todo_missing_item(db_session):
    result = crud.update_todo(
        db_session,
        todo_id=999,
        todo_in=schemas.TodoUpdate(title="Nope"),
    )

    assert result is None
