from .database import DataBase
import uuid
import json

from datetime import datetime, timedelta



class User(): 

    def __init__(self, data=None):
        self._table = "empleados.usuarios"
        self._database = DataBase()

        self.id_usu = None
        self.nombre_usu = None
        self.correo = None
        self.clave = None
        self.id_departamento = None
        self.id_empleado = None
        self.fecha_alta = None
        self.fecha_mod = None

        if data:
            self._from_dict(data)

    def _from_dict(self, data):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def to_dict(self):
        return {
            "id_usu": self.id_usu,
            "nombre_usu": self.nombre_usu,
            "correo": self.correo,
            "clave": self.clave,
            "id_departamento": self.id_departamento,
            "id_empleado": self.id_empleado,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }

    def save(self):
        if self.id_empleado if hasattr(self, 'id_empleado') else None:
            return self._database.update(self._table, self.to_dict(), {"id_empleado": self.id_empleado})
        else:
            return self._database.insert(self._table, self.to_dict())

    def delete(self):
        if hasattr(self, 'id_empleado') and self.id_empleado:
            return self._database.delete(self._table, {"id_empleado": self.id_empleado})
        return "Cannot delete: id_empleado is not set."

    def load(self, record_id):
        result = self._database.get_by(self._table, list(self.to_dict().keys())[0], record_id)
        if result:
            columns = list(self.to_dict().keys())
            self._from_dict(dict(zip(columns, result[0])))
            return self
        return None
    
    def get_all(self):
        results = self._database.get_all(self._table)
        data = []
        if results:
            columns = list(self.to_dict().keys())
            for row in results:
                instance = self.__class__()
                instance._from_dict(dict(zip(columns, row)))
                data.append(instance.to_dict())
        
        return data
    
    def create_session(self, user_id, extra_data=None):
        session_id = str(uuid.uuid4())
        expires_at = datetime.now() + timedelta(days=1)

        # Si no te pasan datos extra, crea un JSON vacío
        data_json = json.dumps(extra_data or {})

        self._database.execute_query(
            '''INSERT INTO empleados.sesiones (session_id, user_id, data, expires_at) 
            VALUES (%s, %s, %s, %s)''',
            (session_id, user_id, data_json, expires_at)
        )
        return session_id
    

    def validate_session(self, session_id): 
        result=self._database.execute_query(''' SELECT user_id FROM sessions WHERE session_id = %s AND expires_at > NOW() ''' ,(session_id))
        return result[0] if result else None

    def loginUser(self, email, clave):
        result = self._database.execute_query(
            '''SELECT id_usu, id_empleado, nombre_usu, id_departamento, correo 
            FROM empleados.usuarios 
            WHERE correo = %s AND clave = %s AND estatus = 'true' ''',
            (email, clave)
        )
        if result:
            columns = ["id_usu", "id_empleado", "nombre_usu", "id_departamento", "correo"]
            data = [dict(zip(columns, row)) for row in result]
            
            user_data = data[0]
            session_id = self.create_session(user_data['id_usu'] , user_data)
        
            
            return user_data , session_id
        
        return None
    
    def delete_Session(self, session_id):
        return self._database.delete("empleados.sesiones", {"session_id": session_id})

    
    def get_session(self, session_id):
        result = self._database.execute_query('''
            SELECT session_id, user_id, expires_at
            FROM empleados.sesiones
            WHERE session_id = %s
        ''', (session_id,))
        
        if result:
            columns = ["session_id", "user_id", "expires_at"]
            return dict(zip(columns, result[0]))
        return None

    def get_user_by_id(self, user_id):
        result = self._database.execute_query('''
            SELECT id_usu, id_empleado, nombre_usu, id_departamento, correo
            FROM empleados.usuarios
            WHERE id_usu = %s
        ''', (user_id,))
        
        if result:
            columns = ["id_usu", "id_empleado", "nombre_usu", "id_departamento", "correo"]
            return dict(zip(columns, result[0]))
        return None