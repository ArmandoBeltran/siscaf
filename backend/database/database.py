import psycopg2
import os

from . import DBConnection

class DataBase(): 

    def __init__(self):
        self._db_host     = os.getenv("DB_HOST", "localhost")
        self._db_name     = os.getenv("DB_NAME", "andres_db")
        self._db_user     = os.getenv("DB_USER", "postgresql")
        self._db_password = os.getenv("DB_PASSWORD", "admin")

    def _get_connection(self): 
        conn = psycopg2.connect(
            host = self._db_host, 
            database = self._db_name,
            user = self._db_user,
            password = self._db_password,
            port = 5432
        )

        return conn

    def get_all(self, table): 
        try:
            conn = self._get_connection()

            query = f'''
                SELECT *
                FROM {table}
            '''
            cursor = conn.execute(query)
            result = cursor.fetchall()

            cursor.close()
            conn.close()

            return result
        except Exception as e: 
            return f"There was an error: {e}"
        
    def get_by(self, field, value, table): 
        try: 
            conn = self._get_connection()

            query = f'''
                SELECT *
                FROM {table}
                WHERE {field} = {value}
            '''

            cursor = conn.execute(query)
            result = cursor.fetchall()

            cursor.close()
            conn.close()

            return result
        except Exception as e:
            return f"There was an error: {e}"



        
    