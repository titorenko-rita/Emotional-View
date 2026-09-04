import redis
from config import REDIS_HOST, REDIS_PORT


class RedisTools:
    """
    Class for working with Redis
    """
    __redis_connect = redis.Redis(host=f"{REDIS_HOST}", port=REDIS_PORT)
    
    @classmethod
    def set_pair(cls, name_json: str):
        """
        This function add name_json in Redis queue
        """
        cls.__redis_connect.set(name_json, name_json)
