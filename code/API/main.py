import uvicorn

from rpi_app.rpi_app import rpi_app
from app.app import app


# Mount rpi_app
app.mount("/rpi_app", rpi_app)


if __name__ == "__main__":
    # start app
    uvicorn.run(app, host="0.0.0.0", log_level="info")
    