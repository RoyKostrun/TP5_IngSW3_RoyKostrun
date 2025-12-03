from pydantic import BaseModel, ConfigDict

class TodoBase(BaseModel):
    title: str
    body: str
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: str | None = None
    body: str | None = None
    completed: bool | None = None

class Todo(TodoBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
