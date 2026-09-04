import datetime
from datetime import datetime as dtm
import json

from fastapi import File, FastAPI, HTTPException, UploadFile, status
from sqlalchemy import insert, select

from app.db import engine, RaspberryPI, Json
from app.errors import ErrorCode, rpi_mac_responses
from rpi_app.redis.redis import RedisTools


rpi_app = FastAPI(docs_url="/documentation", redoc_url=None)


@rpi_app.post("/rpi/uploadfile", tags=["rpi"], responses=rpi_mac_responses,
              summary="Upload Json file from Raspberry PI", description="Upload JSON file with emotions")
async def create_upload_files(mac: str, upload_file: UploadFile = File(...)):
    """
    This function is needed to receive a JSON file with the client’s emotions.
    Function checks if mac is in D$RaspberryPI table in postgreSQL and write Json file and other parameters in F$JSON.
    If mac is in the D$RaspberryPI table, then it writes the JSON file, name Json file, date_from and date_to of
    client emotions to the F$JSON table and writes to the redis queue the name of the JSON file
    that ML module should process.
    If mac is not in the table, it sends a 400 error with the incorrectly entered mac.

    @param mac: mac address of Raspberry PI(string)
    @param upload_file: JSON file of emotions(JSON)
    @return: string or raise exception
    """
    async with engine.begin() as conn:
        result = await conn.execute(select(RaspberryPI.id)
                                    .where(RaspberryPI.mac == mac))
        result = result.fetchone()
        if result is None:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail={
                        "code": ErrorCode.INCORRECT_MAC,
                        "reason": "Incorrect_mac",
                    },
                )
        else:
            json_data = json.load(upload_file.file, strict=False)
            name_json = str(result[0])+str(datetime.datetime.now())
            date_from = dtm.strptime(json_data["emot"][0]["time"], "%d.%m.%Y %H:%M:%S")
            date_to = dtm.strptime(json_data["emot"][-1]["time"], "%d.%m.%Y %H:%M:%S")
            result = await conn.execute(insert(Json)
                                        .returning(Json)
                                        .values(id_raspberry=result[0], name_json=name_json,
                                                json_satisfaction=json_data,
                                                date_from=date_from, date_to=date_to))
            RedisTools.set_pair(name_json)
    return "Success"
