from .database import DataBase
from .product  import Product

import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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

    def to_dict(self, include_all=None):
        data = {
            "id_inventario": self.id_inventario,
            "id_producto": self.id_producto,
            "cantidad_producida": self.cantidad_producida,
            "existencia": self.existencia,
            "cantidad_vendida": self.cantidad_vendida,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }
        return data if include_all else {k: v for k, v in data.items() if v is not None}

    def save(self):
        return self._database.insert(self._table, self.to_dict())
    
    def update(self, new_data):
        return self._database.update(self._table, new_data, {"id_inventario": self.id_inventario})

    def delete(self):
            return self._database.delete(self._table, {"id_inventario": self.id_inventario})

    def load(self, record_id, get_data=False):
        response, status = self._database.get_by("id_inventario", record_id, self._table)
        results = response.get("data")

        if results:
            self._from_dict(results[0])
            if get_data:
                data = []
                for item in results:
                    instance = self.__class__()
                    instance._from_dict(item)
                    product_response, _ = Product().load(record_id=item.get("id_producto"), get_data=True)
                    product_name = None
                    if product_response.get("success"):
                        product_data = product_response.get("data")
                        if isinstance(product_data, dict):
                            product_name = product_data.get("nombre")

                    item_dict = instance.to_dict()
                    if product_name:
                        item_dict["nombre_producto"] = product_name
                    data.append(item_dict)

                response["data"] = data
                return response, status
            return self
        return response, status

    def get_all(self):
        response, status = self._database.get_all(self._table)
        results = response.get("data")
        data = []

        if results:
            for item in results:
                instance = self.__class__()
                instance._from_dict(item)
                product_response, _ = Product().load(record_id=item.get("id_producto"), get_data=True)
                product_name = None
                if product_response.get("success"):
                    product_data = product_response.get("data")
                    if isinstance(product_data, dict):
                        product_name = product_data.get("nombre")

                item_dict = instance.to_dict()
                if product_name:
                    item_dict["nombre_producto"] = product_name
                data.append(item_dict)

        response["data"] = data
        return response, status
