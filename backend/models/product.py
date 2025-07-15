from .database import DataBase
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Product(): 

    def __init__(self, data=None):
        self._table    = "catalogos.producto"
        self._database = DataBase()

        self.id_producto  = None
        self.nombre       = None
        self.material     = None
        self.talla        = None
        self.color        = None
        self.ocasion      = None
        self.tipo_tacon   = None
        self.altura_tacon = None
        self.id_categoria = None
        self.descripcion  = None
        self.costo        = None
        self.precio       = None
        self.fecha_alta   = None
        self.fecha_mod    = None

        if data:
            self._from_dict(data)

    def _from_dict(self, data):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def to_dict(self, include_all=None):
        data = {
            "id_producto": self.id_producto,
            "nombre" : self.nombre,
            "material": self.material,
            "talla": self.talla,
            "color": self.color,
            "ocasion": self.ocasion,
            "tipo_tacon": self.tipo_tacon,
            "altura_tacon": self.altura_tacon,
            "id_categoria": self.id_categoria,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }

        return data if include_all else {key: value for key, value in data.items() if value is not None}

    def save(self):
        return self._database.insert(self._table, self.to_dict())
    
    def update(self, new_data): 
        return self._database.update(self._table, new_data, {"id_producto": self.id_producto})

    def delete(self):
        return self._database.delete(self._table, {"id_producto": self.id_producto})

    
    def load(self, record_id, get_data=False):
        response, status = self._database.get_by("id_producto", record_id, self._table)
        results = response.get("data")

        if results:
            self._from_dict(results[0])
            if get_data:
                response["data"] = self.to_dict()
                return response, status
            return self
        return response, status

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