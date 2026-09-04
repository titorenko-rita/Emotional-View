import datetime
from typing import Optional

from pydantic import BaseModel


# These schemas need to work with /data/rpiSmena endpoints
class RpiSmenaRead(BaseModel):
    """
    This schema needs to response endpoints that works with F$RaspberryPI_smena (/data/rpiSmena)

    @var id: primary key in F$RaspberryPI_smena(int)
    @var id_raspberry: foreign key with D$RaspberryPI(int)
    @var id_kassa: ticket window ID where Raspberry PI stands(int)
    @var id_worker: employee ID(int)
    @var date_from: date and time when the shift starts(datetime)
    @var date_to: date and time when the shift ends(datetime)
    """
    id: int
    id_raspberry: int
    id_kassa: int
    id_worker: int
    date_from: datetime.datetime
    date_to: datetime.datetime


class RpiSmenaCreate(BaseModel):
    """
    This schema needs to create Raspberry PI shift in F$RaspberryPI_smena in HTTP Body request (POST /data/rpiSmena)

    @var id_raspberry: foreign key with D$RaspberryPI(int)
    @var id_kassa: ticket window ID where Raspberry PI stands(int)
    @var id_worker: employee ID(int)
    @var date_from: date and time when the shift starts(datetime)
    @var date_to: date and time when the shift ends(datetime)
    """
    id_raspberry: int
    id_kassa: int
    id_worker: int
    date_from: datetime.datetime
    date_to: datetime.datetime


class RpiSmenaUpdate(BaseModel):
    """
    This schema needs to update Raspberry PI shift in F$RaspberryPI_smena in HTTP Body request (PATCH /data/rpiSmena)

    @var id: primary key in F$RaspberryPI_smena(int)
    @var id_raspberry: foreign key with D$RaspberryPI(Optional int)
    @var id_kassa: ticket window ID where Raspberry PI stands(Optional int)
    @var id_worker: employee ID(Optional int)
    @var date_from: date and time when the shift starts(Optional datetime)
    @var date_to: date and time when the shift ends(Optional datetime)
    """
    id: int
    id_raspberry: Optional[int] = None
    id_kassa: Optional[int] = None
    id_worker: Optional[int] = None
    date_to: Optional[datetime.datetime] = None
    date_from: Optional[datetime.datetime] = None
