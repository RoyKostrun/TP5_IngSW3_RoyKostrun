import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

# forzamos que, si no existe, la URL apunte a sqlite:///./test.db

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db") # usamos el sqlite para que cada test apunte a un archivo test.deb local que se recrea desde cero sin depender de la base real

from app.database import Base  # noqa: E402
from app.main import app, get_db  # noqa: E402

SQLALCHEMY_TEST_URL = os.getenv("DATABASE_URL")
CONNECT_ARGS = {"check_same_thread": False} if SQLALCHEMY_TEST_URL.startswith("sqlite") else {}
engine = create_engine(SQLALCHEMY_TEST_URL, connect_args=CONNECT_ARGS)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture()
def db_session():
    Base.metadata.drop_all(bind=engine) # borra todas las tablas del archivo SQLite.
    Base.metadata.create_all(bind=engine) # las vuelvo a crear
    session = TestingSessionLocal() # entrego al test
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(autouse=True)
def override_get_db(db_session): # reemplaza la dependencia get_db de FastAPI dentro de los tests 
    def _get_db():# para terornar siempre esa sesion
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _get_db # obligamos que  todos los endpoints usen la sesión de prueba
    yield
    app.dependency_overrides.clear()

# de esta forma cada request en los tests usa la misma base temporal, sin tocar la base real
@pytest.fixture()
def client():
    return TestClient(app)
