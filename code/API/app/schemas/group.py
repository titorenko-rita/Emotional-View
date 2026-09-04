from typing import Optional

from pydantic import BaseModel


# These schemas need to work with /users/group endpoints
class GroupRead(BaseModel):
    """
    This schema needs to response endpoints that works with D$Group (/users/group/)

    @var id : primary key in D$Group(int)
    @var name: name of group(string)
    @var location : location of group(string)
    @var is_active : Is the group active?(bool)
    """
    id: int
    name: str
    location: str
    is_active: bool


class GroupCreate(BaseModel):
    """
    This schema needs to create Group in D$Group in HTTP Body request (POST /users/group/)

    @var name: name of group(string)
    @var location : location of group(string)
    @var is_active : Is the group active?(bool)
    """
    name: str
    location: str
    is_active: bool


class GroupUpdate(BaseModel):
    """
    This schema needs to update group in D$Group in HTTP Body request (PATCH /users/group/)

    @var id : primary key in D$Group(int)
    @var name: name of group(Optional string)
    @var location : location of group(Optional string)
    @var is_active : Is the group active?(Optional bool)
    """
    id: int
    name: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None
