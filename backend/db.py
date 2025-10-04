import os
import json
from sqlalchemy import create_engine, Column, Integer, Text
from sqlalchemy.orm import declarative_base, sessionmaker


def _sqlite_url():
    base_dir = os.path.dirname(__file__)
    db_path = os.path.join(base_dir, 'admin.db')
    return f"sqlite:///{db_path.replace('\\', '/')}"


DATABASE_URL = os.getenv('DATABASE_URL') or _sqlite_url()

# Engine: works with Postgres (Neon/Supabase) or local SQLite
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    future=True,
)

Base = declarative_base()


class Settings(Base):
    __tablename__ = 'settings'
    id = Column(Integer, primary_key=True)
    json = Column(Text, nullable=False)


SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db():
    # Create tables
    Base.metadata.create_all(engine)
    # Ensure a single row exists (id=1)
    with SessionLocal() as session:
        row = session.get(Settings, 1)
        if not row:
            row = Settings(id=1, json=json.dumps({}))
            session.add(row)
            session.commit()