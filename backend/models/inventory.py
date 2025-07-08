from .database import DataBase

class Inventory():

    def __init__(self, data=None):
        self._table = "catalogos.inventario"
        self._database = DataBase()

        self.id_inventario = None
        self.id_producto = None
        self.cantidad_producida = None
        self.existencia = None
        self.cantidad_vendida = None
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
            "id_inventario": self.id_inventario,
            "id_producto": self.id_producto,
            "cantidad_producida": self.cantidad_producida,
            "existencia": self.existencia,
            "cantidad_vendida": self.cantidad_vendida,
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