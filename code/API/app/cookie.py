from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    JWTStrategy,
)

from config import SECRET


# cookie config
cookie_transport = CookieTransport(cookie_name="user_auth",
                                   cookie_max_age=3600,
                                   cookie_secure=False,
                                   cookie_httponly=True)


def get_jwt_strategy() -> JWTStrategy:
    """
    Create JWT strategy.

    @return: JWTStrategy
    """
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)


# auth with cookie transport and JWT strategy
auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)
