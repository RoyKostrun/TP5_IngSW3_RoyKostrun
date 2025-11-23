from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pathlib import Path
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parents[2]
env_file = os.getenv("ENV_FILE")

if not env_file:
    app_env = os.getenv("APP_ENV", "development")
    env_file = ".env" if app_env == "production" else ".env.dev"

load_dotenv(BASE_DIR / env_file, override=False)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()
