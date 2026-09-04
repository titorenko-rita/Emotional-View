import datetime

from pydantic import BaseModel


# These schemas need to work with /data/countAll, /data/countMainTable, /data/countJsonTable,
# /data/mainTable, /data/Json endpoints
class CountAll(BaseModel):
    """
    This schema needs to response GET /data/countAll endpoint. Work with F$JSON table.

    @var satisfaction: customer class satisfaction(0 - not satisfied, 1 - partially satisfied, 2 -
    satisfied)(float)
    @var count: count of satisfaction(int)
    """
    satisfaction: int | None
    count: int


class CountMainTableAll(BaseModel):
    """
    This schema needs to response GET /data/countMainTable endpoint. Work with F$JSON and F$RaspberryPI_smena tables.

    @var id_worker: employee ID(int)
    @var satisfaction: customer class satisfaction(0 - not satisfied, 1 - partially satisfied, 2 -
    satisfied)(float)
    @var count: count of satisfaction(int)
    """
    id_worker: int
    satisfaction: int | None
    count: int


class CountJsonTableAll(BaseModel):
    """
    This schema needs to response GET /data/countJsonTable endpoint. Work with F$JSON table.

    @var id_raspberry: Raspberry ID(int)
    @var satisfaction: customer class satisfaction(0 - not satisfied, 1 - partially satisfied, 2 -
    satisfied)(float)
    @var count: count of satisfaction(int)
    """
    id_raspberry: int
    satisfaction: int | None
    count: int


class MainTableRead(BaseModel):
    """
    This schema needs to response GET /data/mainTable endpoint. Work with F$JSON and F$RaspberryPI_smena tables.

    @var date_from: date and time when reading the client's emotions began(datetime)
    @var date_to: date and time of the end of reading the client's emotions(datetime)
    @var satisfaction: customer class satisfaction(0 - not satisfied, 1 - partially satisfied, 2 -
    satisfied)(float)
    @var id_worker: employee ID(int)
    @var id_raspberry: Raspberry ID(int)
    @var id_kassa: ticket window ID where Raspberry PI stands(int)
    """
    date_from: datetime.datetime
    date_to: datetime.datetime
    satisfaction: int | None
    id_worker: int
    id_raspberry: int
    id_kassa: int


class JsonRead(BaseModel):
    """
    This schema needs to response GET /data/Json endpoint. Work with F$JSON table.

    @var date_from: date and time when reading the client's emotions began(datetime)
    @var date_to: date and time of the end of reading the client's emotions(datetime)
    @var satisfaction: customer class satisfaction(0 - not satisfied, 1 - partially satisfied, 2 -
    satisfied)(float)
    @var id_raspberry: Raspberry ID(int)
    """
    date_from: datetime.datetime
    date_to: datetime.datetime
    satisfaction: int | None
    id_raspberry: int


class EmotionSessionRead(BaseModel):
    """
    This schema needs to response GET /data/emotionSessions endpoint.
    It includes raw customer emotion JSON for building a session timeline.
    """
    id: int
    id_raspberry: int
    name_json: str
    json_satisfaction: dict
    satisfaction: int | None
    date_from: datetime.datetime
    date_to: datetime.datetime
