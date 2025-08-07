from .database import DataBase

import logging

class Department():

    def __init__(self, data=None):
        self._table = "empleados.departamentos"
        self._database = DataBase()

        self.id_departamento = None
        self.nombre = None
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
            "id_departamento": self.id_departamento,
            "nombre": self.nombre,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }
    
        return data if include_all else {k: v for k, v in data.items() if v is not None}

    def save(self):
        return self._database.insert(self._table, self.to_dict())
        
    def update(self, new_data): 
        if 'id_departamento' in new_data:
            logging.debug("#"*100)
            new_data = dict(new_data)
            new_data.pop('id_departamento')
        logging.debug(new_data)
        return self._database.update(self._table, new_data, {"id_departamento": self.id_departamento})

    def delete(self):
        if hasattr(self, 'id_departamento') and self.id_departamento:
            return self._database.delete(self._table, {"id_departamento": self.id_departamento})
        return "Cannot delete: id_departamento is not set."

    def load(self, field, value, get_data=False):
        response, status = self._database.get_by(field, value, self._table)
        results = response.get("data", [])

        if results: 
            self._from_dict(results[0])
            if get_data:
                response["data"] = self.to_dict()
                return response, status
            return self
        return response, status
    
    def get_all(self):
        response, status = self._database.get_all(self._table)
        results = response.get("data")
        data = []

        if results:
            for row in results:
                instance = self.__class__()
                instance._from_dict(row)
                data.append(instance.to_dict())

        response["data"] = data
        return response, status
    
    def report(self): 
        query = '''
            SELECT departamento.id_departamento, departamento.nombre, 
                   COALESCE(COUNT(empleado.id_empleado), 0) AS numero_empleados
            FROM empleados.departamentos AS departamento
            LEFT JOIN empleados.empleados AS empleado ON empleado.id_departamento = departamento.id_departamento
            GROUP BY departamento.id_departamento, departamento.nombre
            ORDER BY departamento.nombre;
        '''
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            columns = ["id_departamento", "nombre", "numero_empleados"]
            data = [dict(zip(columns, row)) for row in results]

            return {
                "success": True,
                "message": "Departamentos con total de empleados obtenidos",
                "data": data
            }, 200
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500