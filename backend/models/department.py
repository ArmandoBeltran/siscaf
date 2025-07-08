from .database import DataBase

class Department():

    def __init__(self, data=None):
        self._table = "empleados.departamentos"
        self._database = DataBase()

        self.id_departamento = None
        self.nombre = None
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
            "id_departamento": self.id_departamento,
            "nombre": self.nombre,
            "id_empleado": self.id_empleado,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }

    def save(self):
        if self.id_departamento:
            return self._database.update(self._table, self.to_dict(), {"id_departamento": self.id_departamento})
        else:
            return self._database.insert(self._table, self.to_dict())

    def delete(self):
        if hasattr(self, 'id_departamento') and self.id_departamento:
            return self._database.delete(self._table, {"id_departamento": self.id_departamento})
        return "Cannot delete: id_departamento is not set."

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