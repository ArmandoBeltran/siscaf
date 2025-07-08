from .database import DataBase

class Sale(): 

    def __init__(self, data=None):
        self._table = "catalogos.ventas"
        self._database = DataBase()

        self.id_venta = None
        self.id_vendedor = None
        self.id_sucursal = None
        self.fecha_venta = None

        if data:
            self._from_dict(data)

    def _from_dict(self, data):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def to_dict(self):
        return {
            "id_venta": self.id_venta,
            "id_vendedor": self.id_vendedor,
            "id_sucursal": self.id_sucursal,
            "fecha_venta": self.fecha_venta,
        }

    def save(self):
        if self.id_venta if hasattr(self, 'id_venta') else None:
            return self._database.update(self._table, self.to_dict(), {"id_venta": self.id_venta})
        else:
            return self._database.insert(self._table, self.to_dict())

    def delete(self):
        if hasattr(self, 'id_venta') and self.id_venta:
            return self._database.delete(self._table, {"id_venta": self.id_venta})
        return "Cannot delete: id_venta is not set."

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