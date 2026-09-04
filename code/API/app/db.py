import datetime
from typing import (
    Any,
    Dict,
    AsyncGenerator,
    Generic,
    Optional,
    Type,
)

from fastapi import Depends
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseOAuthAccountTable
from fastapi_users.models import (
    ID, 
    OAP, 
    UOAP,
)
from sqlalchemy.sql import Select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base
from sqlalchemy.orm import (
    sessionmaker, 
    Mapped, 
    mapped_column,
)
from sqlalchemy import (
    select,
    func,
    DateTime,
    JSON,
    Double,
    Boolean,
    ForeignKey,
    String,
    Integer,
)

from app.schemas.user import UP
from config import (
    POSTGRES_USER, 
    POSTGRES_PASSWORD, 
    POSTGRES_PORT, 
    POSTGRES_DB, 
    POSTGRES_HOST,
)


DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"


Base: DeclarativeMeta = declarative_base()


class BaseUserDatabase(Generic[UP, ID]):
    """Base adapter for retrieving, creating and updating users from a database."""

    async def get(self, id: ID) -> Optional[UP]:
        """Get a single user by id."""
        raise NotImplementedError()

    async def get_by_email(self, username: str) -> Optional[UP]:
        """Get a single user by email."""
        raise NotImplementedError()

    async def get_by_oauth_account(self, oauth: str, account_id: str) -> Optional[UP]:
        """Get a single user by OAuth account id."""
        raise NotImplementedError()

    async def create(self, create_dict: Dict[str, Any]) -> UP:
        """Create a user."""
        raise NotImplementedError()

    async def update(self, user: UP, update_dict: Dict[str, Any]) -> UP:
        """Update a user."""
        raise NotImplementedError()

    async def delete(self, user: UP) -> None:
        """Delete a user."""
        raise NotImplementedError()

    async def add_oauth_account(
        self: "BaseUserDatabase[UOAP, ID]", user: UOAP, create_dict: Dict[str, Any]
    ) -> UOAP:
        """Create an OAuth account and add it to the user."""
        raise NotImplementedError()

    async def update_oauth_account(
        self: "BaseUserDatabase[UOAP, ID]",
        user: UOAP,
        oauth_account: OAP,
        update_dict: Dict[str, Any],
    ) -> UOAP:
        """Update an OAuth account on a user."""
        raise NotImplementedError()


class SQLAlchemyUserDatabase(Generic[UP, ID], BaseUserDatabase[UP, ID]):
    """Class for Fastapi users lib. Needs for authentication"""
    session: AsyncSession
    user_table: Type[UP]
    oauth_account_table: Optional[Type[SQLAlchemyBaseOAuthAccountTable]]

    def __init__(
        self,
        session: AsyncSession,
        user_table: Type[UP],
        oauth_account_table: Optional[Type[SQLAlchemyBaseOAuthAccountTable]] = None,
    ):
        self.session = session
        self.user_table = user_table
        self.oauth_account_table = oauth_account_table

    async def get(self, id: ID) -> Optional[UP]:
        """
        Function get user by id in user_table(D$User)

        @param id:
        @return: user
        """
        statement = select(self.user_table).where(self.user_table.id == id)
        return await self._get_user(statement)

    async def get_by_email(self, username: str) -> Optional[UP]:
        """
        Function get user by username in user_table(D$User)

        @param username:
        @return: user
        """
        statement = select(self.user_table).where(
            func.lower(self.user_table.username) == func.lower(username)
        )
        return await self._get_user(statement)

    async def create(self, create_dict: Dict[str, Any]) -> UP:
        """
        Function create user in user_table(D$User)

        @param create_dict: user parameters
        @return: user
        """
        user = self.user_table(**create_dict)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def update(self, user: UP, update_dict: Dict[str, Any]) -> UP:
        """
        Function update user in user_table(D$User)

        @param user: user protocol
        @param update_dict: user parameters
        @return: user
        """
        for key, value in update_dict.items():
            setattr(user, key, value)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def delete(self, user: UP) -> None:
        """
        Function delete user in user_table(D$User)

        @param user: user protocol
        """
        await self.session.delete(user)
        await self.session.commit()

    async def _get_user(self, statement: Select) -> Optional[UP]:
        """
        Function get user from Database

        @param statement: SQL select
        @return: user
        """
        results = await self.session.execute(statement)
        return results.unique().scalar_one_or_none()


class User(Base):
    """
    Table D$User for work with users and auth.

    @var id: primary key(int)
    @var id_group: foreign key with D$Group(int)
    @var id_role: foreign key with D$Role(int)
    @var username: login for auth(string, nullable=False, unique=True, index=True)
    @var hashed_password: hashed password for auth(string, nullable=False)
    @var is_active: Is the user active?(bool, default=True, nullable=False)
    @var is_superuser: Is the user superuser?(bool, default=False, nullable=False)
    @var is_verified: Is the user verified?(bool, default=False, nullable=False)
    """
    __tablename__ = "D$User"
    
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    id_group: Mapped[int] = mapped_column(
        ForeignKey("D$GROUP.id")
    )
    id_role: Mapped[int] = mapped_column(
        ForeignKey("D$ROLE.id")
    )
    username: Mapped[str] = mapped_column(
        String(length=320), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(
        String(length=1024), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )


class Role(Base):
    """
    Table D$Role for work with Roles and auth.

    @var id: primary key(int)
    @var name: role name(string, unique=True, index=True, nullable=False)
    @var is_active: Is the role active?(bool, default=True, nullable=False)
    """
    __tablename__ = "D$ROLE"
    
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    name: Mapped[str] = mapped_column(
        String(length=320), unique=True, index=True, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Group(Base):
    """
    Table D$Group for work with Groups and auth.

    @var id: primary key(int)
    @var name: group name(string, unique=True, index=True, nullable=False)
    @var location: location of group(string, unique=False, index=True, nullable=False)
    @var is_active: Is the group active?(bool, default=True, nullable=False)
    """
    __tablename__ = "D$GROUP"
    
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    name: Mapped[str] = mapped_column(
        String(length=320), unique=True, index=True, nullable=False
    )
    location: Mapped[str] = mapped_column(
        String(length=320), unique=False, index=True, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class RaspberryPI(Base):
    """
    Table D$RaspberryPI for work with Raspberry PI.

    @var id: primary key(int)
    @var id_group: foreign key with D$Group(int)
    @var mac: mac address of the Raspberry PI(string, unique=True, index=True, nullable=False)
    @var is_active: Is the Raspberry PI active?(bool, default=True, nullable=False)
    """
    __tablename__ = "D$RaspberryPI"
    
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    id_group: Mapped[int] = mapped_column(
        ForeignKey("D$GROUP.id")
    )
    mac: Mapped[str] = mapped_column(
        String(length=320), unique=True, index=True, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class RaspberryPI_smena(Base):
    """
    Table F$RaspberryPI_smena for work with work shifts.

    @var id: primary key(int)
    @var id_raspberry: foreign key with D$RaspberryPI(int)
    @var id_kassa: ticket window ID where Raspberry PI stands(int)
    @var id_worker: employee ID(int)
    @var date_from: date and time when the shift starts(datetime)
    @var date_to: date and time when the shift ends(datetime)
    """
    __tablename__ = "F$RaspberryPI_smena"
    
    id: Mapped[int] = mapped_column(
        primary_key=True
    )
    id_raspberry: Mapped[int] = mapped_column(
        ForeignKey("D$RaspberryPI.id")
    )
    id_kassa: Mapped[int]
    id_worker: Mapped[int]
    date_from: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True)
    )
    date_to: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True)
    )


class Json(Base):
    """
    Table F$JSON for work with customer emotions in JSON format.

    @var id : primary key(int)
    @var id_raspberry : foreign key to D$RaspberryPI table(int)
    @var name_json : Unique JSON file name(string, unique=True, index=True, nullable=False)
    @var json_satisfaction : customer satisfaction JSON file(JSON, nullable=False)
    @var satisfaction : customer class satisfaction(double, nullable=True)
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
    satisfaction: Mapped[int] = mapped_column(
        Integer, nullable=True
    )
    date_from: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    date_to: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )


# create engine to work with Database
engine = create_async_engine(DATABASE_URL)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def create_db_and_tables():
    """
    Create all tables.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create async session
    """
    async with async_session_maker() as session:
        yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    """
    Get SQLAlchemy user database

    @param session: async session
    """
    yield SQLAlchemyUserDatabase(session, User)
