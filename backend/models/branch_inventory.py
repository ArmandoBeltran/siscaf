from .database import DataBase
from .product  import Product

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class BranchInventory():

    def __init__(self, data=None):
        self._table    = "catalogos.inventario_suc"
        self._database = DataBase()

        self.id_inv_suc        = None
        self.id_producto       = None
        self.existencia        = None
        self.cantidad_vendida  = None
        self.id_sucursal       = None
        self.fecha_alta        = None
        self.fecha_mod         = None
        self.cantidad_total    = None

        if data:
            self._from_dict(data)

    def _from_dict(self, data):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def to_dict(self, include_all=None):
        data = {
            "id_inv_suc": self.id_inv_suc,
            "id_producto": self.id_producto,
            "existencia": self.existencia,
            "cantidad_vendida": self.cantidad_vendida,
            "id_sucursal": self.id_sucursal,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
            "cantidad_total": self.cantidad_total,
        }
        return data if include_all else {k: v for k, v in data.items() if v is not None}

    def save(self):
        return self._database.insert(self._table, self.to_dict())

    def update(self, new_data):
        return self._database.update(self._table, new_data, {"id_inv_suc": self.id_inv_suc})

    def delete(self):
        return self._database.delete(self._table, {"id_inv_suc": self.id_inv_suc})

    def load(self, record_id, get_data=False):
        response, status = self._database.get_by("id_sucursal", record_id, self._table)
        results = response.get("data", [])

        if results:
            self._from_dict(results[0])

            if get_data:
                data = []
                for item in results:
                    instance = self.__class__()
                    instance._from_dict(item)
                    product_response, _ = Product().load("id_producto", item.get("id_producto"), get_data=True)
                    product_name = None
                    if product_response.get("success"):
                        product_data = product_response.get("data")[0]
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
        results  = response.get('data')
        data = []
        if results:
            for row in results:
                instance = self.__class__()
                instance._from_dict(row)
                data.append(instance.to_dict())
        
        response["data"] = data
        return response, status
