from typing import Optional

from pydantic import BaseModel


# These schemas need to work with /data/rpi endpoints
class RpiGroupRead(BaseModel):
    """
    This schema needs to response endpoints that works with D$RaspberryPI and D$Group GET(/data/rpi)

    @var id: primary key in D$RaspberryPI(int)
    @var id_group: foreign key with D$Group(int)
    @var group_name: name of group(string)
    @var mac: mac address Raspberry PI(string)
    @var is_active: Is the Raspberry PI active?(bool)
    """
    id: int
    id_group: int
    group_name: str
    mac: str
    is_active: bool


class RpiRead(BaseModel):
    """
    This schema needs to response endpoints that works with D$RaspberryPI POST/PATCH/DELETE(/data/rpi)

    @var id: primary key in D$RaspberryPI(int)
    @var id_group: foreign key with D$Group(int)
    @var mac: mac address Raspberry PI(string)
    @var is_active: Is the Raspberry PI active?(bool)
    """
    id: int
    id_group: int
    mac: str
    is_active: bool


class RpiCreate(BaseModel):
    """
    This schema needs to create Raspberry PI in D$RaspberryPI in HTTP Body request (POST /data/rpi)

    @var id_group: foreign key with D$Group(int)
    @var mac: mac address Raspberry PI(string)
    @var is_active: Is the Raspberry PI active?(bool)
    """
    id_group: int
    mac: str
    is_active: bool


class RpiUpdate(BaseModel):
    """
    This schema needs to update Raspberry PI in D$RaspberryPI in HTTP Body request (PATCH /data/rpi)

    @var id: primary key in D$RaspberryPI(int)
    @var id_group: foreign key with D$Group(Optional int)
    @var mac: mac address Raspberry PI(Optional string)
    @var is_active: Is the Raspberry PI active?(Optional bool)
    """
    id: int
    id_group: Optional[int] = None
    mac: Optional[str] = None
    is_active: Optional[bool] = None
