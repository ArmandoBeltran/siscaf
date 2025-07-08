from .database import DataBase
from datetime import date


class Category(): 

    def __init__(self, data=None):
        self._table = "catalogos.categoria"
        self._database = DataBase()

        self.id_categoria = None
        self.nombre = None
        self.descripcion = None
        self.genero = None
        self.temporada = None
        self.estado = None
        self.fecha_alta = None
        self.fecha_mod = None

        if data:
            self._from_dict(data)

    def _from_dict(self, data):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def to_dict(self, include_id=False, operation=None):
        data = {
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "genero": self.genero,
            "temporada": self.temporada,
            "estado": self.estado,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }
        
        if operation == "insert": 
            data["fecha_alta"] = date.today()
            data["fecha_mod"]  = date.today()
        elif operation == "update": 
            data["fecha_mod"] = date.today()

        if include_id: 
            data["id_categoria"] = self.id_categoria

        return data

    def save(self):
        if self.id_categoria:
            return self._database.update(self._table, self.to_dict(operation="update"), {"id_categoria": self.id_categoria})
        else:
            return self._database.insert(self._table, self.to_dict(operation="insert"))

    def delete(self):
        if hasattr(self, 'id_categoria') and self.id_categoria:
            return self._database.delete(self._table, {"id_categoria": self.id_categoria})
        return "Cannot delete: id_categoria is not set."

    def load(self, record_id):
        result = self._database.get_by("id_categoria", record_id, self._table)
        if result:
            columns = list(self.to_dict(True).keys())
            self._from_dict(dict(zip(columns, result[0])))
            return self
        return None
    
    def get_all(self):
        results = self._database.get_all(self._table)
        data = []
        if results:
            columns = list(self.to_dict(include_id=True).keys())
            for row in results:
                instance = self.__class__()
                instance._from_dict(dict(zip(columns, row)))
                data.append(instance.to_dict())
        
        return data