import psycopg2
import os
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class DataBase(): 

    def __init__(self):
        self._db_host     = os.getenv("DB_HOST", "localhost")
        self._db_name     = os.getenv("DB_NAME", "andres_db")
        self._db_user     = os.getenv("DB_USER", "postgres")
        self._db_password = os.getenv("DB_PASSWORD", "usuario")

    def _get_connection(self): 
        conn = psycopg2.connect(
            host = "localhost",
            database = "andres_db",
            user = "postgres",
            password = "usuario",
            port = 5432
        )
        return conn
    
    def _prepare_response(self, success, message, data, status):
        return {
            'success' : success,
            'message' : message,
            'data'    : data
        }, status

    def get_all(self, table): 
        try:
            conn   = self._get_connection()
            cursor = conn.cursor()
            query = f"SELECT * FROM {table}"
            cursor.execute(query)
            result = cursor.fetchall()

            columns = [desc[0] for desc in cursor.description]
            data = [dict(zip(columns, row)) for row in result]

            cursor.close()
            conn.close()

            response, status = self._prepare_response(True, "success", data, 200)
            return response, status
        except Exception as e: 
            return self._prepare_response(False, "error", str(e), 400)

    def get_by(self, field, value, table): 
        try: 
            conn   = self._get_connection()
            cursor = conn.cursor()
            query = f"SELECT * FROM {table} WHERE {field} = %s"
            cursor.execute(query, (value,))
            result = cursor.fetchall()

            columns = [desc[0] for desc in cursor.description]
            data = [dict(zip(columns, row)) for row in result]

            cursor.close()
            conn.close()

            response = self._prepare_response(True, "success", data, 200)
            return response
        except Exception as e:
            return self._prepare_response(False, "error", str(e), 400)
        
    def insert(self, table, data: dict):
        try:
            conn = self._get_connection()
            cursor = conn.cursor()

            columns = ', '.join(data.keys())
            placeholders = ', '.join(['%s'] * len(data))
            values = tuple(data.values())

            if table == "catalogos.producto":
                query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders}) RETURNING id_producto;"
                cursor.execute(query, values)
                inserted_id = cursor.fetchone()[0]
                response = self._prepare_response(True, "success", {"id_producto": inserted_id}, 201)
            else:
                query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
                cursor.execute(query, values)
                response = self._prepare_response(True, "success", {"message": "Dato insertado"}, 201)

            conn.commit()

            cursor.close()
            conn.close()

            return response

        except Exception as e:
            logger.error(f"[insert] Error al insertar en {table}: {str(e)}")
            return self._prepare_response(False, "error", str(e), 400)

    def update(self, table, data: dict, where_clause: dict):
        try:
            conn = self._get_connection()
            cursor = conn.cursor()

            set_expr = ', '.join([f"{k} = %s" for k in data])
            where_expr = ' AND '.join([f"{k} = %s" for k in where_clause])

            query = f"UPDATE {table} SET {set_expr} WHERE {where_expr};"
            values = tuple(data.values()) + tuple(where_clause.values())

            cursor.execute(query, values)
            conn.commit()

            cursor.close()
            conn.close()
            
            response = self._prepare_response(True, "success", "Record successfully updated", 201)

            return response
        except Exception as e:
            return self._prepare_response(False, "error", str(e), 400)

    def delete(self, table, where_clause: dict):
        try:
            conn = self._get_connection()
            cursor = conn.cursor()

            where_expr = ' AND '.join([f"{k} = %s" for k in where_clause])
            query = f"DELETE FROM {table} WHERE {where_expr};"
            values = tuple(where_clause.values())

            cursor.execute(query, values)
            conn.commit()

            cursor.close()
            conn.close()

            response = self._prepare_response(True, "success", "Record successfully deleted", 200)

            return response
        except Exception as e:
            return self._prepare_response(False, "error", str(e), 400)
        
    import psycopg2.extras

    def execute_query(self, query, params=None):
        try:
            with self._get_connection() as conn:
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
                    cursor.execute(query, params or ())
                    if query.strip().upper().startswith("SELECT"):
                        return cursor.fetchall()
                    conn.commit()
                    return None
        except Exception as e:
            logger.error(f"Query failed: {query} | Error: {str(e)}")
            raise

    
    def get_by_multiple(self, filters: dict, table: str):
        where_clauses = " AND ".join(f"{k} = %s" for k in filters)
        values = list(filters.values())
        query = f"SELECT * FROM {table} WHERE {where_clauses}"
        try:
            results = self.execute_query(query, values)
            response = {
                "success": True,
                "data": results
            }
            status = 200
        except Exception as e:
            response = {
                "success": False,
                "message": str(e),
                "data": []
            }
            status = 500
        return response, status