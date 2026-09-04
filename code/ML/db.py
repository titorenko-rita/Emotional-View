import datetime
from typing import Any

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.declarative import declarative_base, DeclarativeMeta
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import (
    ForeignKey,
    String,
    Double,
    DateTime,
    JSON,
)

from config import (
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_DB,
    POSTGRES_HOST,
)


# Url for connecting to the database
DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_async_engine(DATABASE_URL)
Base: DeclarativeMeta = declarative_base()


class Json(Base):
    """
    Table F$JSON for work with customer emotions in JSON format.
    
    @var id : primary key(int)
    @var id_raspberry : foreign key to D$RaspberryPI table(int)
    @var name_json : Unique JSON file name(string, unique=True, index=True, nullable=False)
    @var json_satisfaction : customer satisfaction JSON file(JSON, nullable=False)
    @var satisfaction : customer satisfaction(double, nullable=True)
    @var date_from : beginning to read the client's emotions(datetime, nullable=False)
    @var date_to : end of reading the client's emotions(datetime, nullable=False)
    """
    __tablename__ = "F$JSON"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    id_raspberry: Mapped[int] = mapped_column(
        ForeignKey("D$RaspberryPI.id")
    )
    name_json: Mapped[str] = mapped_column(
        String(length=320), unique=True, index=True, nullable=False
    )
    json_satisfaction: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False
    )
    satisfaction: Mapped[Double] = mapped_column(
        Double, nullable=True
    )
    date_from: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    date_to: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
