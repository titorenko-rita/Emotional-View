from enum import Enum
from typing import Dict, Union

from pydantic import BaseModel
from fastapi import status


class ErrorModel(BaseModel):
    """
    Error model.

    @var detail: details of error
    """
    detail: Union[str, Dict[str, str]]


class ErrorCode(str, Enum):
    """
    All Errors codes.
    """
    SQL_ERROR = "SQL_ERROR"
    NO_CONTENT_PARAMETRS_ERROR = "NO_CONTENT_PARAMETRS_ERROR"
    DELETE_ERROR = "DELETE_ERROR"
    INCORRECT_RASPBERRYPI_ID = "INCORRECT_RASPBERRYPI_ID"
    INCORRECT_RaspberryPI_smena_ID = "INCORRECT_RaspberryPI_smena_ID"
    INCORRECT_MAC = "INCORRECT_MAC"


# default responses
default_responses = {
    status.HTTP_401_UNAUTHORIZED: {
        "description": "Missing token or inactive user.",
    },
    status.HTTP_400_BAD_REQUEST: {
        "model": ErrorModel,
        "content": {
            "application/json": {
                "examples": {
                    ErrorCode.SQL_ERROR: {
                        "summary": "Invalid id.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.SQL_ERROR,
                                "reason": "Invalid id"
                            }
                        },
                    },
                }
            }
        },
    },
    status.HTTP_404_NOT_FOUND: {
        "description": "Not found"
    }
}

# for endpoints where needs one or more parameters but all is Optional
responses_with_no_content = {
    status.HTTP_401_UNAUTHORIZED: {
        "description": "Missing token or inactive user.",
    },
    status.HTTP_400_BAD_REQUEST: {
        "model": ErrorModel,
        "content": {
            "application/json": {
                "examples": {
                    ErrorCode.SQL_ERROR: {
                        "summary": "Invalid id.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.SQL_ERROR,
                                "reason": "Invalid id"
                            }
                        },
                    },
                    ErrorCode.NO_CONTENT_PARAMETRS_ERROR: {
                        "summary": "No content parametrs error.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.NO_CONTENT_PARAMETRS_ERROR,
                                "reason": "Not a single optional parameter"
                            }
                        },
                    },
                }
            }
        },
    },
    status.HTTP_404_NOT_FOUND: {
        "description": "Not found"
    }
}

# for DELETE endpoints
responses_with_delete_error = {
    status.HTTP_401_UNAUTHORIZED: {
        "description": "Missing token or inactive user.",
    },
    status.HTTP_400_BAD_REQUEST: {
        "model": ErrorModel,
        "content": {
            "application/json": {
                "examples": {
                    ErrorCode.SQL_ERROR: {
                        "summary": "Invalid id.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.SQL_ERROR,
                                "reason": "Invalid id"
                            }
                        },
                    },
                    ErrorCode.DELETE_ERROR: {
                        "summary": "No id to delete.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.DELETE_ERROR,
                                "reason": "No id to delete"
                            }
                        },
                    },
                }
            }
        },
    },
    status.HTTP_404_NOT_FOUND: {
        "description": "Not found"
    }
}

# for endpoints with control rpi id
Incorrect_RPI_id_responses = {
    status.HTTP_401_UNAUTHORIZED: {
        "description": "Missing token or inactive user.",
    },
    status.HTTP_400_BAD_REQUEST: {
        "model": ErrorModel,
        "content": {
            "application/json": {
                "examples": {
                    ErrorCode.SQL_ERROR: {
                        "summary": "Invalid id.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.SQL_ERROR,
                                "reason": "Invalid id"
                            }
                        },
                    },
                    ErrorCode.INCORRECT_RASPBERRYPI_ID: {
                        "summary": "Incorrect raspberryPI id.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.INCORRECT_RASPBERRYPI_ID,
                                "reason": "Incorrect raspberryPI id"
                            }
                        },
                    },
                }
            }
        },
    },
    status.HTTP_404_NOT_FOUND: {
        "description": "Not found"
    }
}

# for endpoints rpi smena
Incorrect_RPI_id_and_RPI_smena_responses = {
    status.HTTP_401_UNAUTHORIZED: {
        "description": "Missing token or inactive user.",
    },
    status.HTTP_400_BAD_REQUEST: {
        "model": ErrorModel,
        "content": {
            "application/json": {
                "examples": {
                    ErrorCode.SQL_ERROR: {
                        "summary": "Invalid id.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.SQL_ERROR,
                                "reason": "Invalid id"
                            }
                        },
                    },
                    ErrorCode.INCORRECT_RASPBERRYPI_ID: {
                        "summary": "Incorrect raspberryPI id.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.INCORRECT_RASPBERRYPI_ID,
                                "reason": "Incorrect raspberryPI id"
                            }
                        },
                    },
                    ErrorCode.INCORRECT_RaspberryPI_smena_ID: {
                        "summary": "Incorrect RaspberryPI Smena id.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.INCORRECT_RaspberryPI_smena_ID,
                                "reason": "Incorrect RaspberryPI Smena id"
                            }
                        },
                    },
                    ErrorCode.NO_CONTENT_PARAMETRS_ERROR: {
                        "summary": "No content parametrs error.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.NO_CONTENT_PARAMETRS_ERROR,
                                "reason": "Not a single optional parameter"
                            }
                        },
                    },
                }
            }
        },
    },
    status.HTTP_404_NOT_FOUND: {
        "description": "Not found"
    }
}

# for rpi_app
rpi_mac_responses = {
    status.HTTP_401_UNAUTHORIZED: {
        "description": "Missing token or inactive user.",
    },
    status.HTTP_400_BAD_REQUEST: {
        "model": ErrorModel,
        "content": {
            "application/json": {
                "examples": {
                    ErrorCode.INCORRECT_MAC: {
                        "summary": "Incorrect_mac.",
                        "value": {
                            "detail": {
                                "code": ErrorCode.INCORRECT_MAC,
                                "reason": "Incorrect_mac"
                            }
                        },
                    },
                }
            }
        },
    },
    status.HTTP_404_NOT_FOUND: {
        "description": "Not found"
    }
}
