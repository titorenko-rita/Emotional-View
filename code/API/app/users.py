import contextlib

from typing import Optional, Any, Dict

from fastapi import Depends, HTTPException, Request
from fastapi_users import (
    BaseUserManager,
    FastAPIUsers,
    IntegerIDMixin,
    models,
    exceptions,
)
from fastapi_users.exceptions import UserAlreadyExists

from app.db import (
    get_user_db,
    get_async_session,
    get_user_db,
    BaseUserDatabase,
    Group,
    Role,
    SQLAlchemyUserDatabase,
    User,
)
from app.schemas.user import UC, UU, UP, UserCreate
from config import SECRET
from app.cookie import auth_backend


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    """
    This class needs to work with users.

    @var reset_password_token_secret: secret token for reset password
    @var verification_token_secret: secret token for verification
    @var user_db: user database table
    """
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET
    user_db: BaseUserDatabase[UP, models.ID]

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        """
        Function print that user was registered after registration.

        @param user: user schema
        @param request: optional request
        """
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        """
        Function print user id and token to reset password after /auth/forgot-password (forgot password).

        @param user: user schema
        @param token: secret token
        @param request: optional request
        """
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        """
        Function print user id and token to verification after /auth/request-verify-token (request to verify).

        @param user: user schema
        @param token: secret token
        @param request: optional request
        """
        print(f"Verification requested for user {user.id}. Verification token: {token}")
    
    async def create(
        self,
        user_create: UC,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> UP:
        """
        Function for create user.

        @param user_create: user create schema
        @param safe: FastAPI users lib, we didn't use
        @param request: Optional request
        @return: created user
        """
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.username)
        if existing_user is not None:
            raise exceptions.UserAlreadyExists()

        user_dict = (
            user_create.create_update_dict_superuser()
        )
        password = user_dict.pop("password")
        user_dict["hashed_password"] = self.password_helper.hash(password)

        created_user = await self.user_db.create(user_dict)

        await self.on_after_register(created_user, request)

        return created_user
        
    async def update(
        self,
        user_update: UU,
        user: UP,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> UP:
        """
        Function for update user.

        @param user_update: user update schema
        @param user: user protocol
        @param safe: false if superuser can update
        @param request: Optional request
        @return:updated user
        """
        if safe:
            updated_user_data = user_update.create_update_dict()
        else:
            updated_user_data = user_update.create_update_dict_superuser()
        updated_user = await self._update(user, updated_user_data)
        await self.on_after_update(updated_user, updated_user_data, request)
        return updated_user

    async def _update(self, user: UP, update_dict: Dict[str, Any]) -> UP:
        """
        Function for check and update user.

        @param user: user update schema
        @param update_dict: user updated data
        @return: Database update answer
        """
        validated_update_dict = {}
        for field, value in update_dict.items():
            if field == "username" and value != user.username:
                try:
                    await self.get_by_email(value)
                    raise exceptions.UserAlreadyExists()
                except exceptions.UserNotExists:
                    validated_update_dict["username"] = value
                    validated_update_dict["is_verified"] = False
            elif field == "password" and value is not None:
                await self.validate_password(value, user)
                validated_update_dict["hashed_password"] = self.password_helper.hash(
                    value
                )
            else:
                validated_update_dict[field] = value
        return await self.user_db.update(user, validated_update_dict)


async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    """
    Create user manager.

    @param user_db: SQLAlchemy User Database
    """
    yield UserManager(user_db)


fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])

# for dependency
current_active_user = fastapi_users.current_user(active=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)


# ------------------------------Depends for admin------------------------------------
async def superuser_with_root_group(user=Depends(current_superuser)):
    """
    Check if auth user is in 1(admin) group and superuser and active.

    @param user: auth user
    @return: user or exception
    """
    if user.id_group == 1:
        return user
    raise HTTPException(status_code=404, detail="This role does not have access")


# ------------------------------Depends for shift supervisor--------------------------
async def active_shift_supervisor(user=Depends(current_active_user)):
    """
    Check if auth user is in 1(admin) group or 1(admin), 2(shift supervisor) role and active.

    @param user: auth user
    @return: user or exception
    """
    if user.id_role == 1 or user.id_role == 2 or user.id_group == 1:
        return user
    raise HTTPException(status_code=404, detail="This role does not have access")


# create session, db, manager
get_async_session_context = contextlib.asynccontextmanager(get_async_session)
get_user_db_context = contextlib.asynccontextmanager(get_user_db)
get_user_manager_context = contextlib.asynccontextmanager(get_user_manager)


# --------------------------------Create user programmly------------------------------
async def create_user(id_group: int, id_role: int, username: str, password: str, is_superuser: bool = False):
    """
    Create user programmly. Print created or exist user id.

    @param id_group:
    @param id_role:
    @param username:
    @param password:
    @param is_superuser:
    """
    try:
        async with get_async_session_context() as session:
            async with get_user_db_context(session) as user_db:
                async with get_user_manager_context(user_db) as user_manager:
                    user = await user_manager.create(
                        UserCreate(
                            id_group=id_group, id_role=id_role, username=username,
                            password=password, is_superuser=is_superuser
                        )
                    )
                    print(f"User created {user}")
    except UserAlreadyExists:
        print(f"User {username} already exists")
    

# ---------------------------------Create role programmly--------------------------------


async def create_role(name: str):
    """
    Create role programmly. Print created or exist role id.

    @param name:
    """
    try:
        async with get_async_session_context() as session:
            role = Role(
                    name=name
                )
            session.add(role)
            await session.commit()
            await session.refresh(role)
            print(f"Role created {role}")
    except Exception:
        print(f"Role {role} already exists")


# ---------------------------------Create group programmly--------------------------------


async def create_group(name: str, location: str):
    """
    Create group programmly. Print created or exist group id.

    @param name:
    @param location:
    """
    try:
        async with get_async_session_context() as session:
            group = Group(
                    name=name,
                    location=location
                )
            session.add(group)
            await session.commit()
            await session.refresh(group)
            print(f"Group created {group}")
    except Exception:
        print(f"Group {group} already exists")
