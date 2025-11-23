from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pathlib import Path
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parents[2]


def _load_local_env():
    env_file = os.getenv("ENV_FILE")
    if not env_file:
        app_env = os.getenv("APP_ENV")
        env_file = ".env" if app_env == "production" else ".env.dev"

    candidate = BASE_DIR / env_file
    if candidate.exists():
        load_dotenv(candidate, override=False)


SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    _load_local_env()
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise RuntimeError("DATABASE_URL variable is required.")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()
