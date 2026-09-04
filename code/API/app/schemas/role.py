from typing import Optional

from pydantic import BaseModel


# These schemas need to work with /users/role endpoints
class RoleRead(BaseModel):
    """
    This schema needs to response endpoints that works with D$Role (/users/role/)

    @var id: primary key in D$Role(int)
    @var name: name of role(string)
    @var is_active: Is the role active?(bool)
    """
    id: int
    name: str
    is_active: bool


class RoleCreate(BaseModel):
    """
    This schema needs to create role in D$Role in HTTP Body request (POST /users/role/)

    @var name: name of role(string)
    @var is_active: Is the role active?(bool)
    """
    name: str
    is_active: bool


class RoleUpdate(BaseModel):
    """
    This schema needs to update role in D$Role in HTTP Body request (PATCH /users/role/)

    @var id: primary key in D$Role(int)
    @var name: name of role(Optional string)
    @var is_active: Is the role active?(Optional bool)
    """
    id: int
    name: Optional[str] = None
    is_active: Optional[bool] = None
