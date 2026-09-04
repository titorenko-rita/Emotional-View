from typing import (
    Generic,
    Optional,
    Protocol,
    TypeVar,
)

from fastapi_users import models
from fastapi_users.schemas import model_dump
from pydantic import BaseModel, ConfigDict
from pydantic.version import VERSION as PYDANTIC_VERSION


PYDANTIC_V2 = PYDANTIC_VERSION.startswith("2.")


class CreateDictModel(BaseModel):
    """
    This class needs for FastAPI users lib. To create user.
    """
    def create_update_dict_superuser(self):
        """
        This function needs for FastAPI users lib to exclude unset and to prevent users from changing id

        @return: model_dump
        """
        return model_dump(self, exclude_unset=True, exclude={"id"})


class UserCreate(CreateDictModel):
    """
    This schema needs to create user in D$User in HTTP Body request (POST /auth/register)

    @var id_role: foreign key with D$Role(int)
    @var id_group: foreign key with D$Group(int)
    @var username: login for auth(string)
    @var password: password for auth(string)
    @var is_active: Is the user active?(Optional bool, default true)
    @var is_superuser: Is the user superuser?(Optional bool, default false)
    @var is_verified: Is the user verified?(Optional bool, default false)
    """
    id_role: int
    id_group: int
    username: str
    password: str
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    is_verified: Optional[bool] = False


class UpdateDictModel(BaseModel):
    """
    This class needs for FastAPI users lib. To update user.
    """
    def create_update_dict(self):
        """
        This function needs for FastAPI users lib to exclude unset and to prevent users from changing id, is_superuser,
        is_active, is_verified, oauth_accounts, id_role, id_group

        @return: model_dump
        """
        return model_dump(
            self,
            exclude_unset=True,
            exclude={
                "id",
                "is_superuser",
                "is_active",
                "is_verified",
                "oauth_accounts",
                "id_role",
                "id_group",
            },
        )

    def create_update_dict_superuser(self):
        """
        This function needs for FastAPI users lib to exclude unset and to prevent superusers from changing id

        @return: model_dump
        """
        return model_dump(self, exclude_unset=True, exclude={"id"})


class UserUpdate(UpdateDictModel):
    """
    This schema needs to update user in D$User in HTTP Body request (PATCH /users/me and /users/{id})

    @var id_role: foreign key with D$Role(Optional int)
    @var id_group: foreign key with D$Group(Optional int)
    @var username: login for auth(Optional string)
    @var password: password for auth(Optional string)
    @var is_active: Is the user active?(Optional bool, default true)
    @var is_superuser: Is the user superuser?(Optional bool, default false)
    @var is_verified: Is the user verified?(Optional bool, default false)
    """
    id_role: Optional[int] = None
    id_group: Optional[int] = None
    password: Optional[str] = None
    username: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    is_verified: Optional[bool] = None


class UserRead(CreateDictModel, Generic[models.ID]):
    """
    This schema needs to response endpoints that works with D$User (GET, PATCH, /users/me, /users/{id} and
    GET /users/all/)

    @var id_role: foreign key with D$Role(int)
    @var id_group: foreign key with D$Group(int)
    @var username: login for auth(string)
    @var is_active: Is the user active?(bool, default true)
    @var is_superuser: Is the user superuser?(bool, default false)
    @var is_verified: Is the user verified?(bool, default false)
    """
    id: models.ID
    id_role: int
    id_group: int
    username: str
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False

    # for pydantic in FastAPI users lib.
    if PYDANTIC_V2:  # pragma: no cover
        model_config = ConfigDict(from_attributes=True)  # type: ignore
    else:  # pragma: no cover

        class Config:
            orm_mode = True


class UserProtocol(Protocol[models.ID]):
    """
    This schema needs to auth user in FastApi users lib.

    @var id: primary key in D$User(ID)
    @var id_role: foreign key with D$Role(int)
    @var id_group: foreign key with D$Group(int)
    @var username: login for auth(string)
    @var hashed_password: hashed password(string)
    @var is_active: Is the user active?(bool, default true)
    @var is_superuser: Is the user superuser?(bool, default false)
    @var is_verified: Is the user verified?(bool, default false)
    """
    id: models.ID
    id_role: int
    id_group: int
    username: str
    hashed_password: str
    is_active: bool
    is_superuser: bool
    is_verified: bool


class UserProfileRead(BaseModel):
    """
    This schema needs to response endpoint that works with D$User, D$Role, D$Group (GET /users/profile/)

    @var username: login for auth(string)
    @var role_name: role name in D$Role(string)
    @var group_name: group name in D$Group(string)
    """
    username: str
    role_name: str
    group_name: str


# needs for FastApi users lib
UP = TypeVar("UP", bound=UserProtocol)
UU = TypeVar("UU", bound=UserUpdate)
UC = TypeVar("UC", bound=UserCreate)
