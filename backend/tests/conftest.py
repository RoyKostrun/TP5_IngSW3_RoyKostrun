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

# Force a lightweight SQLite database for tests before importing the app modules.
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

from app.database import Base  # noqa: E402
from app.main import app, get_db  # noqa: E402

SQLALCHEMY_TEST_URL = os.getenv("DATABASE_URL")
CONNECT_ARGS = {"check_same_thread": False} if SQLALCHEMY_TEST_URL.startswith("sqlite") else {}
engine = create_engine(SQLALCHEMY_TEST_URL, connect_args=CONNECT_ARGS)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture()
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(autouse=True)
def override_get_db(db_session):
    def _get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _get_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture()
def client():
    return TestClient(app)
