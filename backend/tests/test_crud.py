import pytest
from pydantic import ValidationError

from app import crud, schemas


def test_create_todo_persists(db_session):
    todo_in = schemas.TodoCreate(title="Write TP6 tests", completed=False)

    created = crud.create_todo(db_session, todo_in)

    assert created.id is not None
    assert created.title == todo_in.title
    assert created.completed is False


def test_get_todos_returns_list(db_session):
    crud.create_todo(db_session, schemas.TodoCreate(title="First"))
    crud.create_todo(db_session, schemas.TodoCreate(title="Second"))

    result = crud.get_todos(db_session)

    assert isinstance(result, list)
    assert len(result) == 2
    titles = {todo.title for todo in result}
    assert {"First", "Second"} == titles


def test_delete_todo_existing_item(db_session):
    todo = crud.create_todo(db_session, schemas.TodoCreate(title="Remove me"))

    deleted = crud.delete_todo(db_session, todo.id)
    remaining = crud.get_todos(db_session)

    assert deleted.id == todo.id
    assert all(item.id != todo.id for item in remaining)


def test_delete_todo_missing_item(db_session):
    deleted = crud.delete_todo(db_session, todo_id=999)

    assert deleted is None


def test_create_todo_requires_title():
    with pytest.raises(ValidationError):
        schemas.TodoCreate(title=None)  # type: ignore[arg-type]
