from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, Base, SessionLocal
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

def _ensure_body_column():
    inspector = inspect(engine)
    column_names = {column["name"] for column in inspector.get_columns("todos")}
    if "body" not in column_names:
        with engine.connect() as connection:
            connection.execute(text("ALTER TABLE todos ADD COLUMN body VARCHAR DEFAULT '' NOT NULL"))

_ensure_body_column()


# cambios varios de nuevo
app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/todos", response_model=list[schemas.Todo])
def read_todos(db: Session = Depends(get_db)):
    return crud.get_todos(db)

@app.post("/todos", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db, todo)

@app.put("/todos/{todo_id}", response_model=schemas.Todo)
def update_todo(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db)):
    updated = crud.update_todo(db, todo_id, todo)
    if updated is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated

@app.delete("/todos/{todo_id}", response_model=schemas.Todo)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    return crud.delete_todo(db, todo_id)

from fastapi.responses import JSONResponse

@app.get("/health", tags=["Health Check"])
def health_check():
    return JSONResponse(
        status_code=200,
        content={
            "status": 200,
            "message": "Server is up!",
            "version": "v0.0.5"
        }
    )
