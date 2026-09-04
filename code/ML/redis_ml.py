import redis

from config import REDIS_HOST, REDIS_PORT


class RedisTools:
    """
    Class for working with Redis
    """
    __redis_connect = redis.Redis(host=f"{REDIS_HOST}", port=REDIS_PORT)
    
    @classmethod
    def get_last_pair(cls):
        """
        The function removes from the queue and returns the first file name in the queue that needs
        to be processed in the ML module
        @return: json_name or ''(empty string)
        """
        key = cls.__redis_connect.keys(pattern="*")
        if key:
            return cls.__redis_connect.getdel(key[0])
        return b''
