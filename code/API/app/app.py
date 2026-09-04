import datetime

from fastapi import (
    Depends,
    File,
    FastAPI,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy import (
    and_,
    delete,
    insert,
    select,
    update,
    exc,
    desc,
    func,
)

from app.db import (
    engine,
    create_db_and_tables,
    Role,
    User,
    Group,
    RaspberryPI,
    RaspberryPI_smena,
    Json,
)
from app.errors import (
    default_responses,
    responses_with_no_content,
    responses_with_delete_error,
    Incorrect_RPI_id_responses,
    Incorrect_RPI_id_and_RPI_smena_responses,
    ErrorCode,
)
from app.schemas.user import (
    UserCreate,
    UserRead,
    UserUpdate,
    UserProfileRead,
)
from app.schemas.group import (
    GroupCreate,
    GroupRead,
    GroupUpdate,
)
from app.schemas.main_monitoring import (
    CountAll,
    EmotionSessionRead,
    JsonRead,
    MainTableRead,
    CountMainTableAll,
    CountJsonTableAll,
)
from app.schemas.role import (
    RoleCreate,
    RoleUpdate,
    RoleRead,
)
from app.schemas.rpi import (
    RpiRead,
    RpiUpdate,
    RpiCreate,
    RpiGroupRead,
)
from app.schemas.rpi_smena import (
    RpiSmenaRead,
    RpiSmenaCreate,
    RpiSmenaUpdate,
)
from app.users import (
    fastapi_users,
    current_active_user,
    create_group,
    create_user,
    create_role,
    superuser_with_root_group,
    active_shift_supervisor,
)
from app.cookie import (
    auth_backend,
)


app = FastAPI(docs_url="/documentation", redoc_url=None)

# ----------------------------Endpoints for work with user----------------------------


# Default fastapi_users routers
app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
    dependencies=[Depends(superuser_with_root_group)],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
    dependencies=[Depends(superuser_with_root_group)],
)
app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
    dependencies=[Depends(superuser_with_root_group)],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


@app.get("/auth/check-user", tags=["auth"], responses=default_responses)
async def check_auth_user_exists(username: str):
    """
    Endpoint for checking that a username exists before showing a login error.

    @param username: login entered on the authorization form
    @return: exists flag
    """
    try:
        stmt = select(User.id).where(func.lower(User.username) == func.lower(username))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid username",
                },
            )
    return {"exists": result.fetchone() is not None}


# Endpoint for receiving all users in D$User
@app.get("/users/all/", tags=["users"],
         response_model=list[UserRead], responses=default_responses,
         summary="Output all users", description="Only for admin, output all users in DB")
async def get_data_all_users(count: int, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for get all data users in D$User by 50 users(1 count - first 50 users, 2 count - 50 next users).

    @param count: for pagination
    @param user: auth user schema
    @return: list of UserRead or exception
    """
    try:
        stmt = (select(User.id, User.id_role, User.id_group, User.username,
                       User.is_active, User.is_superuser, User.is_verified)
                .limit(50)
                .offset(50*(count-1)))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({"id": row[0], "id_role": row[1], "id_group": row[2], "username": row[3],
                            "is_active": row[4], "is_superuser": row[5], "is_verified": row[6]})
    return list_result


# Endpoint for receiving current user username, role_name and group_name
@app.get("/users/profile/", tags=["users"],
         response_model=UserProfileRead, responses=default_responses,)
async def get_data_profile(user: User = Depends(current_active_user)):
    """
    Endpoint for get auth user data profile. Joins D$User, D$Role, D$Group.

    @param user: auth user schema
    @return: UserProfileRead or exception
    """
    try:
        stmt = (select(User.username, Role.name, Group.name)
                .join_from(User, Role)
                .join(Group)
                .where(User.id == user.id))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    return {"username": result[0], "role_name": result[1], "group_name": result[2]}


# ----------------------------Endpoints for work with D$Group----------------------------


# Endpoint for receiving all groups in D$Group
@app.get("/users/group/", tags=["group"],
         response_model=list[GroupRead], responses=default_responses,)
async def get_data_group(count: int, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for get all groups in D$Group by 50 groups(1 count - first 50 groups, 2 count - 50 next groups).

    @param count: for pagination
    @param user: auth user schema
    @return: list of GroupRead or exception
    """
    try:
        stmt = (select(Group)
                .limit(50)
                .offset(50*(count-1)))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({"id": row[0], "name": row[1], "location": row[2], "is_active": row[3]})
    return list_result


# Endpoint for write new group in D$Group
@app.post("/users/group/", tags=["group"],
          response_model=GroupRead, responses=default_responses,)
async def post_data_group(group: GroupCreate, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for create Group in D$Group.

    @param group: GroupCreate schema
    @param user: auth user schema
    @return: GroupRead or exception
    """
    try:
        group_dict = group.model_dump()
        async with engine.begin() as conn:
            result = await conn.execute(insert(Group)
                                        .returning(Group.id, Group.name, Group.location, Group.is_active)
                                        .values(group_dict))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    return {"id": result[0], "name": result[1], "location": result[2], "is_active": result[3]}


# Endpoint for update group in D$Group
@app.patch("/users/group/", tags=["group"],
           response_model=GroupRead, responses=responses_with_no_content,)
async def patch_data_group(group: GroupUpdate, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for update Group in D$Group.

    @param group: GroupUpdate schema
    @param user: auth user schema
    @return: GroupRead or exception
    """
    try:
        group_dict = group.model_dump(exclude_unset=True)
        async with engine.begin() as conn:
            result = await conn.execute(update(Group)
                                        .returning(Group.id, Group.name, Group.location, Group.is_active)
                                        .where(Group.id == group.id)
                                        .values(group_dict))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    return {"id": result[0], "name": result[1], "location": result[2], "is_active": result[3]}


# Endpoint for delete group in D$Group
@app.delete("/users/group/", tags=["group"],
            response_model=GroupRead, responses=responses_with_delete_error)
async def delete_data_group(id_group: int, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for delete Group in D$Group.

    @param id_group: primary key in D$Group
    @param user: auth user schema
    @return: GroupRead or exception
    """
    try:
        async with engine.begin() as conn:
            result = await conn.execute(delete(Group)
                                        .returning(Group.id, Group.name, Group.location, Group.is_active)
                                        .where(Group.id == id_group))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    if result is None:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.DELETE_ERROR,
                    "reason": "No id to delete",
                },
            )
    return {"id": result[0], "name": result[1], "location": result[2], "is_active": result[3]}


# ----------------------------Endpoints for work with D$Role----------------------------


@app.get("/users/role/", tags=["role"],
         response_model=list[RoleRead], responses=default_responses)
async def get_data_role(count: int, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for get all roles in D$Role by 50 roles(1 count - first 50 roles, 2 count - 50 next roles).

    @param count: for pagination
    @param user: auth user schema
    @return: list of RoleRead or exception
    """
    stmt = (select(Role)
            .limit(50)
            .offset(50*(count-1)))
    try:
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({"id": row[0], "name": row[1], "is_active": row[2]})
    return list_result


@app.post("/users/role/", tags=["role"],
          response_model=RoleRead, responses=default_responses)
async def post_data_role(role: RoleCreate, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for create Role in D$Role.

    @param role: RoleCreate schema
    @param user: auth user schema
    @return: RoleRead or exception
    """
    try:
        role_dict = role.model_dump()
        async with engine.begin() as conn:
            result = await conn.execute(insert(Role)
                                        .returning(Role.id, Role.name, Role.is_active)
                                        .values(role_dict))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    return {"id": result[0], "name": result[1], "is_active": result[2]}


@app.patch("/users/role/", tags=["role"],
           response_model=RoleRead, responses=responses_with_no_content)
async def patch_data_role(role: RoleUpdate, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for update Role in D$Role.

    @param role: RoleUpdate schema
    @param user: auth user schema
    @return: RoleRead or exception
    """
    try:
        role_dict = role.model_dump(exclude_unset=True)
        async with engine.begin() as conn:
            result = await conn.execute(update(Role)
                                        .returning(Role.id, Role.name, Role.is_active)
                                        .where(Role.id == role.id)
                                        .values(role_dict))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    return {"id": result[0], "name": result[1], "is_active": result[2]}


@app.delete("/users/role/", tags=["role"],
            response_model=RoleRead, responses=responses_with_delete_error)
async def delete_data_role(id_role: int, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for delete Role in D$Role.

    @param id_role: primary key in D$Role
    @param user: auth user schema
    @return: RoleRead or exception
    """
    try:
        async with engine.begin() as conn:
            result = await conn.execute(delete(Role)
                                        .returning(Role.id, Role.name, Role.is_active)
                                        .where(Role.id == id_role))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    if result is None:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.DELETE_ERROR,
                    "reason": "No id to delete",
                },
            )
    return {"id": result[0], "name": result[1], "is_active": result[2]}


# ----------------------------Endpoints for work with F$JSON----------------------------


@app.get("/data/countAll", tags=["Main data"],
         response_model=list[CountAll], responses=default_responses)
async def get_count_classes_main_table(date_from: datetime.datetime | None = None,
                                       date_to: datetime.datetime | None = None,
                                       user: User = Depends(current_active_user)):
    """
    Endpoint for get data from F$JSON, count of satisfaction.

    @param date_from: date and time when user wants the client's emotions began
    @param date_to: date and time when user wants the client's emotions end
    @param user: auth user schema
    @return: list of CountAll or exception
    """
    try:
        if date_from is not None and date_to is not None:
            if user.id_group == 1:
                stmt = (select(Json.satisfaction, func.count(Json.id))
                        .where(Json.date_from >= date_from, Json.date_to <= date_to)
                        .group_by(Json.satisfaction)
                        .order_by(Json.satisfaction))
            else:
                stmt = (select(Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(Json.date_from >= date_from, Json.date_to <= date_to,
                               RaspberryPI.id_group == user.id_group)
                        .group_by(Json.satisfaction)
                        .order_by(Json.satisfaction))
        elif date_from is not None:
            if user.id_group == 1:
                stmt = (select(Json.satisfaction, func.count(Json.id))
                        .where(Json.date_from >= date_from)
                        .group_by(Json.satisfaction)
                        .order_by(Json.satisfaction))
            else:
                stmt = (select(Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(Json.date_from >= date_from,
                               RaspberryPI.id_group == user.id_group)
                        .group_by(Json.satisfaction)
                        .order_by(Json.satisfaction))
        elif date_to is not None:
            if user.id_group == 1:
                stmt = (select(Json.satisfaction, func.count(Json.id))
                        .where(Json.date_to <= date_to)
                        .group_by(Json.satisfaction)
                        .order_by(Json.satisfaction))
            else:
                stmt = (select(Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(Json.date_to <= date_to,
                               RaspberryPI.id_group == user.id_group)
                        .group_by(Json.satisfaction)
                        .order_by(Json.satisfaction))
        else:
            if user.id_group == 1:
                stmt = (select(Json.satisfaction, func.count(Json.id))
                        .group_by(Json.satisfaction)
                        .order_by(Json.satisfaction))
            else:
                stmt = (select(Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group)
                        .group_by(Json.satisfaction)
                        .order_by(Json.satisfaction))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": ErrorCode.SQL_ERROR,
                "reason": "Invalid id",
            },
        )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({"satisfaction": row[0], "count": row[1]})
    return list_result

@app.get("/data/countMainTable", tags=["Main data"],
         response_model=list[CountMainTableAll], responses=default_responses)
async def get_count_id_worker_classes_main_table(date_from: datetime.datetime | None = None,
                                                 date_to: datetime.datetime | None = None,
                                                 user: User = Depends(current_active_user)):
    """
    Endpoint for get data from F$JSON and F$RaspberryPI_smena, count of satisfaction group by id_worker.

    @param date_from: date and time when user wants the client's emotions began
    @param date_to: date and time when user wants the client's emotions end
    @param user: auth user schema
    @return: list of CountMainTableAll or exception
    """
    try:
        if date_from is not None and date_to is not None:
            if user.id_group == 1:
                stmt = (select(RaspberryPI_smena.id_worker, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .where(Json.date_from >= date_from, Json.date_to <= date_to)
                        .group_by(RaspberryPI_smena.id_worker, Json.satisfaction)
                        .order_by(RaspberryPI_smena.id_worker, Json.satisfaction))
            else:
                stmt = (select(RaspberryPI_smena.id_worker, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(Json.date_from >= date_from, Json.date_to <= date_to,
                               RaspberryPI.id_group == user.id_group)
                        .group_by(RaspberryPI_smena.id_worker, Json.satisfaction)
                        .order_by(RaspberryPI_smena.id_worker, Json.satisfaction))
        elif date_from is not None:
            if user.id_group == 1:
                stmt = (select(RaspberryPI_smena.id_worker, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .where(Json.date_from >= date_from)
                        .group_by(RaspberryPI_smena.id_worker, Json.satisfaction)
                        .order_by(RaspberryPI_smena.id_worker, Json.satisfaction))
            else:
                stmt = (select(RaspberryPI_smena.id_worker, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(Json.date_from >= date_from,
                               RaspberryPI.id_group == user.id_group)
                        .group_by(RaspberryPI_smena.id_worker, Json.satisfaction)
                        .order_by(RaspberryPI_smena.id_worker, Json.satisfaction))
        elif date_to is not None:
            if user.id_group == 1:
                stmt = (select(RaspberryPI_smena.id_worker, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .where(Json.date_to <= date_to)
                        .group_by(RaspberryPI_smena.id_worker, Json.satisfaction)
                        .order_by(RaspberryPI_smena.id_worker, Json.satisfaction))
            else:
                stmt = (select(RaspberryPI_smena.id_worker, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(Json.date_to <= date_to,
                               RaspberryPI.id_group == user.id_group)
                        .group_by(RaspberryPI_smena.id_worker, Json.satisfaction)
                        .order_by(RaspberryPI_smena.id_worker, Json.satisfaction))
        else:
            if user.id_group == 1:
                stmt = (select(RaspberryPI_smena.id_worker, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .group_by(RaspberryPI_smena.id_worker, Json.satisfaction)
                        .order_by(RaspberryPI_smena.id_worker, Json.satisfaction))
            else:
                stmt = (select(RaspberryPI_smena.id_worker, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group)
                        .group_by(RaspberryPI_smena.id_worker, Json.satisfaction)
                        .order_by(RaspberryPI_smena.id_worker, Json.satisfaction))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": ErrorCode.SQL_ERROR,
                "reason": "Invalid id",
            },
        )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({"id_worker": row[0], "satisfaction": row[1], "count": row[2]})
    return list_result

@app.get("/data/countJsonTable", tags=["Main data"],
         response_model=list[CountJsonTableAll], responses=default_responses)
async def get_count_id_raspberry_classes_json_table(date_from: datetime.datetime | None = None,
                                                    date_to: datetime.datetime | None = None,
                                                    user: User = Depends(current_active_user)):
    """
    Endpoint for get data from F$JSON, count satisfaction group by id_raspberry.

    @param date_from: date and time when user wants the client's emotions began
    @param date_to: date and time when user wants the client's emotions end
    @param user: auth user schema
    @return: list of CountJsonTableAll or exception
    """
    try:
        if date_from is not None and date_to is not None:
            if user.id_group == 1:
                stmt = (select(Json.id_raspberry, Json.satisfaction, func.count(Json.id))
                        .where(Json.date_from >= date_from, Json.date_to <= date_to)
                        .group_by(Json.id_raspberry, Json.satisfaction)
                        .order_by(Json.id_raspberry, Json.satisfaction))
            else:
                stmt = (select(Json.id_raspberry, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(Json.date_from >= date_from, Json.date_to <= date_to,
                               RaspberryPI.id_group == user.id_group)
                        .group_by(Json.id_raspberry, Json.satisfaction)
                        .order_by(Json.id_raspberry, Json.satisfaction))
        elif date_from is not None:
            if user.id_group == 1:
                stmt = (select(Json.id_raspberry, Json.satisfaction, func.count(Json.id))
                        .where(Json.date_from >= date_from)
                        .group_by(Json.id_raspberry, Json.satisfaction)
                        .order_by(Json.id_raspberry, Json.satisfaction))
            else:
                stmt = (select(Json.id_raspberry, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(Json.date_from >= date_from,
                               RaspberryPI.id_group == user.id_group)
                        .group_by(Json.id_raspberry, Json.satisfaction)
                        .order_by(Json.id_raspberry, Json.satisfaction))
        elif date_to is not None:
            if user.id_group == 1:
                stmt = (select(Json.id_raspberry, Json.satisfaction, func.count(Json.id))
                        .where(Json.date_to <= date_to)
                        .group_by(Json.id_raspberry, Json.satisfaction)
                        .order_by(Json.id_raspberry, Json.satisfaction))
            else:
                stmt = (select(Json.id_raspberry, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(Json.date_to <= date_to,
                               RaspberryPI.id_group == user.id_group)
                        .group_by(Json.id_raspberry, Json.satisfaction)
                        .order_by(Json.id_raspberry, Json.satisfaction))
        else:
            if user.id_group == 1:
                stmt = (select(Json.id_raspberry, Json.satisfaction, func.count(Json.id))
                        .group_by(Json.id_raspberry, Json.satisfaction)
                        .order_by(Json.id_raspberry, Json.satisfaction))
            else:
                stmt = (select(Json.id_raspberry, Json.satisfaction, func.count(Json.id))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group)
                        .group_by(Json.id_raspberry, Json.satisfaction)
                        .order_by(Json.id_raspberry, Json.satisfaction))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": ErrorCode.SQL_ERROR,
                "reason": "Invalid id",
            },
        )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({"id_raspberry": row[0], "satisfaction": row[1], "count": row[2]})
    return list_result

@app.get("/data/mainTable", tags=["Main data"],
         response_model=list[MainTableRead], responses=default_responses)
async def get_data_main_table(count: int, date_from: datetime.datetime | None = None,
                              date_to: datetime.datetime | None = None, user: User = Depends(current_active_user)):
    """
    Endpoint for get data from F$JSON and F$RaspberryPI_smena 50 rows
    (1 count - first 50 rows, 2 count - 50 next rows), joined by id_raspberry, date_from and date_to.

    @param count: for pagination
    @param date_from: date and time when user wants the client's emotions began
    @param date_to: date and time when user wants the client's emotions end
    @param user: auth user schema
    @return: list of MainTableRead or exception
    """
    try:
        if date_from is not None and date_to is not None:
            if user.id_group == 1:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa)
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .where(Json.date_from >= date_from, Json.date_to <= date_to)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa)
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group,
                               Json.date_from >= date_from, Json.date_to <= date_to)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
        elif date_from is not None:
            if user.id_group == 1:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa)
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .where(Json.date_from >= date_from)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa)
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group, Json.date_from >= date_from)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
        elif date_to is not None:
            if user.id_group == 1:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa)
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .where(Json.date_to <= date_to)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa)
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group, Json.date_to <= date_to)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
        else:
            if user.id_group == 1:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa)
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa)
                        .join(RaspberryPI_smena,
                              and_(RaspberryPI_smena.id_raspberry == Json.id_raspberry,
                                   RaspberryPI_smena.date_from <= Json.date_from,
                                   RaspberryPI_smena.date_to >= Json.date_to))
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({"date_from": row[0], "date_to": row[1], "satisfaction": row[2],
                            "id_worker": row[3], "id_raspberry": row[4], "id_kassa": row[5]})
    return list_result


@app.get("/data/Json", tags=["Main data"],
         response_model=list[JsonRead], responses=default_responses)
async def get_data_main_json(count: int, date_from: datetime.datetime | None = None,
                             date_to: datetime.datetime | None = None, user: User = Depends(current_active_user)):
    """
    Endpoint for get data from F$JSON 50 rows(1 count - first 50 rows, 2 count - 50 next rows).

    @param count: for pagination
    @param date_from: date and time when user wants the client's emotions began
    @param date_to: date and time when user wants the client's emotions end
    @param user: auth user schema
    @return: list of JsonRead or exception
    """
    try:
        if date_from is not None and date_to is not None:
            if user.id_group == 1:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction, Json.id_raspberry)
                        .where(Json.date_from >= date_from, Json.date_to <= date_to)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction, Json.id_raspberry)
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group,
                               Json.date_from >= date_from, Json.date_to <= date_to)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
        elif date_from is not None:
            if user.id_group == 1:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction, Json.id_raspberry)
                        .where(Json.date_from >= date_from)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction, Json.id_raspberry)
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group, Json.date_from >= date_from)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
        elif date_to is not None:
            if user.id_group == 1:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction, Json.id_raspberry)
                        .where(Json.date_to <= date_to)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction, Json.id_raspberry)
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group, Json.date_to <= date_to)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
        else:
            if user.id_group == 1:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction, Json.id_raspberry)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(Json.date_from, Json.date_to, Json.satisfaction, Json.id_raspberry)
                        .join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
                        .where(RaspberryPI.id_group == user.id_group)
                        .order_by(desc(Json.id))
                        .limit(50)
                        .offset(50*(count-1)))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({"date_from": row[0], "date_to": row[1], "satisfaction": row[2], "id_raspberry": row[3]})
    return list_result


@app.get("/data/emotionSessions", tags=["Main data"],
         response_model=list[EmotionSessionRead], responses=default_responses)
async def get_data_emotion_sessions(count: int = 1, date_from: datetime.datetime | None = None,
                                    date_to: datetime.datetime | None = None,
                                    user: User = Depends(current_active_user)):
    """
    Endpoint for get customer emotion sessions with raw JSON by 50 rows.

    @param count: for pagination
    @param date_from: date and time when user wants the client's emotions began
    @param date_to: date and time when user wants the client's emotions end
    @param user: auth user schema
    @return: list of EmotionSessionRead or exception
    """
    try:
        base_stmt = select(
            Json.id,
            Json.id_raspberry,
            Json.name_json,
            Json.json_satisfaction,
            Json.satisfaction,
            Json.date_from,
            Json.date_to,
        )

        filters = []
        if date_from is not None:
            filters.append(Json.date_from >= date_from)
        if date_to is not None:
            filters.append(Json.date_to <= date_to)

        if user.id_group != 1:
            base_stmt = base_stmt.join(RaspberryPI, RaspberryPI.id == Json.id_raspberry)
            filters.append(RaspberryPI.id_group == user.id_group)

        if filters:
            base_stmt = base_stmt.where(*filters)

        stmt = (base_stmt
                .order_by(desc(Json.id))
                .limit(50)
                .offset(50 * (count - 1)))

        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({
            "id": row[0],
            "id_raspberry": row[1],
            "name_json": row[2],
            "json_satisfaction": row[3],
            "satisfaction": row[4],
            "date_from": row[5],
            "date_to": row[6],
        })
    return list_result


# ----------------------------Endpoints for work with F$RaspberryPI_smena----------------------------


@app.get("/data/rpiSmena", tags=["RasspberryPI Smena"],
         response_model=list[RpiSmenaRead], responses=default_responses)
async def get_data_rpi_smena(count: int, date_from: datetime.datetime | None = None,
                             date_to: datetime.datetime | None = None, user: User = Depends(active_shift_supervisor)):
    """
    Endpoint for get data from F$RaspberryPI_smena 50 rows(1 count - first 50 rows, 2 count - 50 next rows).

    @param count: for pagination
    @param date_from: date and time when user wants the shift began
    @param date_to: date and time when user wants the shift end
    @param user: auth user schema
    @return: list of RpiSmenaRead or exception
    """
    try:
        if date_from is not None and date_to is not None:
            if user.id_group == 1:
                stmt = (select(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                        .where(RaspberryPI_smena.date_from >= date_from, RaspberryPI_smena.date_to <= date_to)
                        .order_by(desc(RaspberryPI_smena.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                        .join_from(RaspberryPI_smena, RaspberryPI)
                        .where(RaspberryPI.id_group == user.id_group,
                               RaspberryPI_smena.date_from >= date_from,
                               RaspberryPI_smena.date_to <= date_to)
                        .order_by(desc(RaspberryPI_smena.id))
                        .limit(50)
                        .offset(50*(count-1)))
        elif date_from is not None:
            if user.id_group == 1:
                stmt = (select(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                        .where(RaspberryPI_smena.date_from >= date_from)
                        .order_by(desc(RaspberryPI_smena.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                        .join_from(RaspberryPI_smena, RaspberryPI)
                        .where(RaspberryPI.id_group == user.id_group, RaspberryPI_smena.date_from >= date_from)
                        .order_by(desc(RaspberryPI_smena.id))
                        .limit(50)
                        .offset(50*(count-1)))
        elif date_to is not None:
            if user.id_group == 1:
                stmt = (select(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                        .where(RaspberryPI_smena.date_to <= date_to)
                        .order_by(desc(RaspberryPI_smena.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                        .join_from(RaspberryPI_smena, RaspberryPI)
                        .where(RaspberryPI.id_group == user.id_group, RaspberryPI_smena.date_to <= date_to)
                        .order_by(desc(RaspberryPI_smena.id))
                        .limit(50)
                        .offset(50*(count-1)))
        else:
            if user.id_group == 1:
                stmt = (select(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                        .order_by(desc(RaspberryPI_smena.id))
                        .limit(50)
                        .offset(50*(count-1)))
            else:
                stmt = (select(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                        .join_from(RaspberryPI_smena, RaspberryPI)
                        .where(RaspberryPI.id_group == user.id_group)
                        .order_by(desc(RaspberryPI_smena.id))
                        .limit(50)
                        .offset(50*(count-1)))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({"id": row[0], "id_raspberry": row[1], "id_kassa": row[2],
                            "id_worker": row[3], "date_from": row[4], "date_to": row[5]})
    return list_result


@app.post("/data/rpiSmena", tags=["RasspberryPI Smena"],
          response_model=RpiSmenaRead, responses=Incorrect_RPI_id_responses)
async def post_data_rpi_smena(rpismena: RpiSmenaCreate, user: User = Depends(active_shift_supervisor)):
    """
    Endpoint for create work shift in F$RaspberryPI_smena.

    @param rpismena: RpiSmenaCreate schema
    @param user: auth user schema
    @return: RpiSmenaRead or exception
    """
    try:
        rpismena_dict = rpismena.model_dump()
        if user.id_group == 1:
            stmt = (insert(RaspberryPI_smena)
                    .returning(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                    .values(rpismena_dict))
        else:
            stmt = (insert(RaspberryPI_smena)
                    .returning(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry, RaspberryPI_smena.id_kassa,
                               RaspberryPI_smena.id_worker, RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                    .values(rpismena_dict))
        async with engine.begin() as conn:
            if user.id_group == 1:
                result = await conn.execute(stmt)
            else:
                result = await conn.execute(select(RaspberryPI.id)
                                            .where(RaspberryPI.id_group == user.id_group))
                result = result.fetchall()
                list_result = [res[0] for res in result]
                if rpismena.id_raspberry not in list_result:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail={
                            "code": ErrorCode.INCORRECT_RASPBERRYPI_ID,
                            "reason": "Incorrect raspberryPI id",
                        },
                    )
                result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    return {"id": result[0], "id_raspberry": result[1], "id_kassa": result[2],
            "id_worker": result[3], "date_from": result[4], "date_to": result[5]}


@app.patch("/data/rpiSmena", tags=["RasspberryPI Smena"],
           response_model=RpiSmenaRead, responses=Incorrect_RPI_id_and_RPI_smena_responses)
async def patch_data_rpi_smena(rpismena: RpiSmenaUpdate, user: User = Depends(active_shift_supervisor)):
    """
    Endpoint for update work shift in F$RaspberryPI_smena.

    @param rpismena: RpiSmenaUpdate schema
    @param user: auth user schema
    @return: RpiSmenaRead or exception
    """
    try:
        async with engine.begin() as conn:
            if user.id_group != 1:
                if rpismena.id_raspberry is not None:
                    result = await conn.execute(select(RaspberryPI.id)
                                                .where(RaspberryPI.id_group == user.id_group))
                    result = result.fetchall()
                    list_result = [res[0] for res in result]
                    if rpismena.id_raspberry not in list_result:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail={
                                "code": ErrorCode.INCORRECT_RASPBERRYPI_ID,
                                "reason": "Incorrect raspberryPI id",
                            },
                        )
                result = await conn.execute(select(RaspberryPI.id_group)
                                            .join_from(RaspberryPI, RaspberryPI_smena)
                                            .where(RaspberryPI_smena.id == rpismena.id))
                result = result.fetchall()
                list_result = [res[0] for res in result]
                if user.id_group not in list_result:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail={
                            "code": ErrorCode.INCORRECT_RaspberryPI_smena_ID,
                            "reason": "Incorrect RaspberryPI Smena id",
                        },
                    )
            rpismena_dict = rpismena.model_dump(exclude_unset=True)
            result = await conn.execute(update(RaspberryPI_smena)
                                        .returning(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry,
                                                   RaspberryPI_smena.id_kassa, RaspberryPI_smena.id_worker,
                                                   RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                                        .where(RaspberryPI_smena.id == rpismena.id)
                                        .values(rpismena_dict))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    return {"id": result[0], "id_raspberry": result[1], "id_kassa": result[2],
            "id_worker": result[3], "date_from": result[4], "date_to": result[5]}


@app.delete("/data/rpiSmena", tags=["RasspberryPI Smena"],
            response_model=RpiSmenaRead, responses=responses_with_delete_error)
async def delete_data_rpi_smena(id_smena: int, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for create work shift in F$RaspberryPI_smena.

    @param id_smena: primary key in F$RaspberryPI_smena
    @param user: auth user schema
    @return: RpiSmenaRead or exception
    """
    try:
        async with engine.begin() as conn:
            result = await conn.execute(delete(RaspberryPI_smena)
                                        .returning(RaspberryPI_smena.id, RaspberryPI_smena.id_raspberry,
                                                   RaspberryPI_smena.id_kassa, RaspberryPI_smena.id_worker,
                                                   RaspberryPI_smena.date_from, RaspberryPI_smena.date_to)
                                        .where(RaspberryPI_smena.id == id_smena))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    if result is None:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.DELETE_ERROR,
                    "reason": "No id to delete",
                },
            )
    return {"id": result[0], "id_raspberry": result[1], "id_kassa": result[2],
            "id_worker": result[3], "date_from": result[4], "date_to": result[5]}


# ----------------------------Endpoints for work with D$RaspberryPI----------------------------


@app.get("/data/rpi", tags=["RasspberryPI"],
         response_model=list[RpiGroupRead], responses=default_responses)
async def get_data_rpi(count: int, user: User = Depends(active_shift_supervisor)):
    """
    Endpoint for get data from D$RaspberryPI and D$Group 50 rows(1 count - first 50 rows, 2 count - 50 next rows),
    joins id_group and id.

    @param count: for pagination
    @param user: auth user schema
    @return: list of RpiGroupRead or exception
    """
    try:
        if user.id_group == 1:
            stmt = (select(RaspberryPI, Group.name)
                    .join_from(RaspberryPI, Group)
                    .limit(50)
                    .offset(50*(count-1)))
        else:
            stmt = (select(RaspberryPI, Group.name)
                    .join_from(RaspberryPI, Group)
                    .where(RaspberryPI.id_group == user.id_group)
                    .limit(50)
                    .offset(50*(count-1)))
        async with engine.begin() as conn:
            result = await conn.execute(stmt)
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchall()
    list_result = []
    for row in result:
        list_result.append({"id": row[0], "id_group": row[1], "group_name": row[4], "mac": row[2], "is_active": row[3]})
    return list_result


@app.post("/data/rpi", tags=["RasspberryPI"],
          response_model=RpiRead, responses=default_responses)
async def post_data_rpi(rpi: RpiCreate, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for create Raspberry PI in D$RaspberryPI.

    @param rpi: RpiCreate schema
    @param user: auth user schema
    @return: RpiRead or exception
    """
    try:
        rpi_dict = rpi.model_dump()
        async with engine.begin() as conn:
            result = await conn.execute(insert(RaspberryPI)
                                        .returning(RaspberryPI)
                                        .values(rpi_dict))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    return {"id": result[0], "id_group": result[1], "mac": result[2], "is_active": result[3]}


@app.patch("/data/rpi", tags=["RasspberryPI"],
           response_model=RpiRead, responses=responses_with_no_content)
async def patch_data_rpi(rpi: RpiUpdate, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for update Raspberry PI in D$RaspberryPI.

    @param rpi: RpiUpdate schema
    @param user: auth user schema
    @return: RpiRead or exception
    """
    try:
        rpi_dict = rpi.model_dump(exclude_unset=True)
        async with engine.begin() as conn:
            result = await conn.execute(update(RaspberryPI)
                                        .returning(RaspberryPI)
                                        .where(RaspberryPI.id == rpi.id)
                                        .values(rpi_dict))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    return {"id": result[0], "id_group": result[1], "mac": result[2], "is_active": result[3]}


@app.delete("/data/rpi", tags=["RasspberryPI"],
            response_model=RpiRead, responses=responses_with_delete_error)
async def delete_data_rpi(id_rpi: int, user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for delete Raspberry PI in D$RaspberryPI.

    @param id_rpi: primary key in D$RaspberryPI
    @param user: auth user schema
    @return: RoleRead or exception
    """
    try:
        async with engine.begin() as conn:
            result = await conn.execute(delete(RaspberryPI)
                                        .returning(RaspberryPI)
                                        .where(RaspberryPI.id == id_rpi))
    except exc.IntegrityError:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.SQL_ERROR,
                    "reason": "Invalid id",
                },
            )
    result = result.fetchone()
    if result is None:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": ErrorCode.DELETE_ERROR,
                    "reason": "No id to delete",
                },
            )
    return {"id": result[0], "id_group": result[1], "mac": result[2], "is_active": result[3]}


# ----------------------------Endpoint for upload new weights for ML----------------------------


@app.post("/rpi/uploadfile", tags=["replace_scales"])
def create_upload_files(upload_file: UploadFile = File(...), user: User = Depends(superuser_with_root_group)):
    """
    Endpoint for upload new .h5 file with weights for ML.

    @param upload_file: .h5 file
    @param user: auth user schema
    @return: string
    """
    contents = upload_file.file.read()
    with open('/weights/model_weights.h5', 'wb') as f:
        f.write(contents)
    upload_file.file.close()
    return "Success"


# ----------------------------At startup this code is executed----------------------------


@app.on_event("startup")
async def on_startup():
    """
    When the application starts this function is executed.
    Create Database, 3 roles(admin, shift supervisor, manager), 1 group(root), user(admin)
    """
    # Not needed if you setup a migration system like Alembic
    await create_db_and_tables()
    # Create role
    await create_role("admin")
    await create_role("shift supervisor")
    await create_role("manager")
    # Create groups
    await create_group("root", "root")
    # Create first admin user
    await create_user(1, 1, "admin", "12345", True)
