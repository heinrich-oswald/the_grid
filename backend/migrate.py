import os
import json
import argparse
from sqlalchemy import create_engine, Column, Integer, Text
from sqlalchemy.orm import declarative_base, sessionmaker


def sqlite_url(path):
    return f"sqlite:///{path.replace('\\', '/')}"


Base = declarative_base()


class Settings(Base):
    __tablename__ = 'settings'
    id = Column(Integer, primary_key=True)
    json = Column(Text, nullable=False)


def read_from_sqlite(src_path):
    engine = create_engine(sqlite_url(src_path), future=True)
    Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    with Session() as session:
        # Create table if missing and ensure default row
        Base.metadata.create_all(engine)
        row = session.get(Settings, 1)
        if not row:
            return {}
        try:
            return json.loads(row.json) if row.json else {}
        except Exception:
            return {}


def write_to_target(target_url, payload):
    engine = create_engine(target_url, pool_pre_ping=True, future=True)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    with Session() as session:
        row = session.get(Settings, 1)
        data = json.dumps(payload or {})
        if not row:
            row = Settings(id=1, json=data)
            session.add(row)
        else:
            row.json = data
        session.commit()


def main():
    parser = argparse.ArgumentParser(description='Migrate settings from local SQLite to target DATABASE_URL')
    parser.add_argument('--source', default=os.path.join(os.path.dirname(__file__), 'admin.db'), help='Path to source SQLite admin.db')
    parser.add_argument('--target', default=os.getenv('DATABASE_URL', ''), help='Target DATABASE_URL (Postgres)')
    args = parser.parse_args()

    if not args.target:
        raise SystemExit('Error: target DATABASE_URL is required (set env DATABASE_URL or use --target)')

    print(f'Reading from SQLite: {args.source}')
    payload = read_from_sqlite(args.source)
    print('Payload:', payload)
    print(f'Writing to target: {args.target}')
    write_to_target(args.target, payload)
    print('Migration completed.')


if __name__ == '__main__':
    main()