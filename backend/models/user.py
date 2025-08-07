from .database import DataBase
import uuid
import json

from datetime import datetime, timedelta

import logging

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
        self.estatus = None
        self.fecha_alta = None
        self.fecha_mod = None

        if data:
            self._from_dict(data)

    def _from_dict(self, data):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def to_dict(self, include_all=None):
        data = {
            "id_usu": self.id_usu,
            "nombre_usu": self.nombre_usu,
            "correo": self.correo,
            "clave": self.clave,
            "id_departamento": self.id_departamento,
            "id_empleado": self.id_empleado,
            "estatus" : self.estatus,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }
    
        return data if include_all else {key: value for key, value in data.items() if value is not None}

    def save(self):
        return self._database.insert(self._table, self.to_dict())
        
    def update(self, new_data): 
        if "id_usu" in new_data: 
            new_data = dict(new_data)
            new_data.pop("id_usu")
        return self._database.update(self._table, new_data, {"id_usu": self.id_usu})

    def delete(self):
        return self._database.delete(self._table, {"id_usu": self.id_usu})
    
    def load(self, parameter, value, get_data=False):
        response, status = self._database.get_by(parameter, value, self._table)
        results = response.get("data")

        if results:
            if isinstance(results, list):
                self._from_dict(results[0])
                if get_data:
                    response["data"] = [self._clone_with_data(row).to_dict() for row in results]
                    return response, status
            else:
                self._from_dict(results)
                if get_data:
                    response["data"] = [self.to_dict()]
                    return response, status

            return self
        else:
            response["data"] = []
            return response, status
    
    def _clone_with_data(self, data):
        instance = self.__class__()
        instance._from_dict(data)
        return instance

    def get_all(self):
        response, status = self._database.get_all(self._table)
        results  = response.get('data')
        data = []
        if results:
            for row in results:
                instance = self.__class__()
                instance._from_dict(row)
                data.append(instance.to_dict())
        
        response["data"] = data
        return response, status
    
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
            user_data = result[0]
            logging.debug(f"Login user_data: {user_data}")
            
            # Validación para asegurar que sea int
            user_id = int(user_data['id_usu'])

            session_id = self.create_session(user_id, user_data)
            return user_data, session_id

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
            return result[0]  # ← ya es un dict real
        return None

    def get_user_by_id(self, user_id):
        try:
            user_id = int(user_id)
        except ValueError:
            return None

        result = self._database.execute_query('''
            SELECT id_usu, id_empleado, nombre_usu, id_departamento, correo
            FROM empleados.usuarios
            WHERE id_usu = %s
        ''', (user_id,))
        
        if result:
            return result[0]  # Ya es dict por RealDictCursor
        return None