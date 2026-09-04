import asyncio
import traceback

from sqlalchemy import select, update

from redis_ml import RedisTools
from db import engine, Json
from ml_module.ml_module import turbo_ml_func


async def ml():
    """
    Function for the operation of the ML module.
    Checks the Redis queue every second to see if there is data to process.
    If the data is present in the queue (name of the json file (name_json) that needs to be processed),
    then it takes json file (json_satisfaction) to process from the F$JSON table in the PostgreSQL Database.
    After processing the json file (json_satisfaction), it writes satisfaction (satisfaction) to the F$JSON table.

    Important behavior:
    - if ML processing fails, the container must NOT crash
    - in that case satisfaction stays NULL, and the UI/API should show "Не обработано"
    """
    while True:
        await asyncio.sleep(1)

        try:
            raw = RedisTools.get_last_pair()
            if not raw:
                continue

            name_json = raw.decode("utf-8").strip()
            if not name_json:
                continue

            print(f"[ML] Redis task: {name_json}")

            async with engine.begin() as conn:
                db_result = await conn.execute(
                    select(Json.id, Json.json_satisfaction).where(Json.name_json == name_json)
                )

            row = db_result.fetchone()
            if row is None:
                print(f"[ML] JSON not found in DB for name_json={name_json}")
                continue

            result_id, result_json = row
            print(f"[ML] Processing Json.id={result_id}")

            try:
                result_satisfaction = turbo_ml_func(result_json)
                result_satisfaction = int(result_satisfaction)

                if result_satisfaction not in (0, 1, 2):
                    raise ValueError(
                        f"turbo_ml_func returned unexpected class: {result_satisfaction}"
                    )

                async with engine.begin() as conn:
                    updated = await conn.execute(
                        update(Json)
                        .returning(Json.id, Json.satisfaction)
                        .where(Json.id == result_id)
                        .values(satisfaction=result_satisfaction)
                    )

                print(f"[ML] Updated row: {updated.fetchone()}")

            except Exception as ml_error:
                print(f"[ML] Processing error for Json.id={result_id}: {ml_error}")
                traceback.print_exc()
                # IMPORTANT:
                # We do not write fake satisfaction here.
                # It stays NULL -> API/frontend must show 'Не обработано'.
                continue

        except Exception as loop_error:
            print(f"[ML] Loop error: {loop_error}")
            traceback.print_exc()
            # Do not crash the container because of one unexpected error
            continue


asyncio.run(ml())