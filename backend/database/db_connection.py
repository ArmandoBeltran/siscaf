import psycopg2
import os

class DBConnection():

    def __init__(self):
        self._db_host     = os.getenv("DB_HOST", "localhost")
        self._db_name     = os.getenv("DB_NAME", "andres_db")
        self._db_user     = os.getenv("DB_USER", "postgresql")
        self._db_password = os.getenv("DB_PASSWORD", "admin")

    def get_connection(self): 
        conn = psycopg2.connect(
            host = self._db_host, 
            database = self._db_name,
            user = self._db_user,
            password = self._db_password,
            port = 5432
        )

        return conn