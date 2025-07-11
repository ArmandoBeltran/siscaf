from .database import DataBase
from .product  import Product

import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class SaleDetails(): 

    def __init__(self, data=None):
        self._table = "catalogos.detalle_venta"
        self._database = DataBase()

        self.id_detalle = None
        self.id_venta = None
        self.id_producto = None
        self.cantidad = None
        self.precio_unitario = None
        self.descuento = None
        self.importe = None
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
            "id_detalle": self.id_detalle,
            "id_venta": self.id_venta,
            "id_producto": self.id_producto,
            "cantidad": self.cantidad,
            "precio_unitario": self.precio_unitario,
            "descuento": self.descuento,
            "importe": self.importe,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }

        return data if include_all else {k: v for k, v in data.items() if v is not None}

    def save(self):
        return self._database.insert(self._table, self.to_dict())
    
    def update(self, new_data): 
        return self._database.update(self._table, new_data, {"id_detalle": self.id_detalle})

    def delete(self):
        return self._database.delete(self._table, {"id_detalle": self.id_detalle})

    def load(self, parameter: str, value, get_data=False):
        response, status = self._database.get_by(parameter, value, self._table)
        results = response.get("data")

        if results:
            if isinstance(results, list):
                self._from_dict(results[0])
                if get_data:
                    enriched = [self._clone_with_data(row) for row in results]
                    response["data"] = [row for row in enriched]
                    return response, status
            else:
                self._from_dict(results)
                if get_data:
                    response["data"] = self._clone_with_data(results)
                    return response, status

            return self
        else:
            response["data"] = []
            return response, status

    def _clone_with_data(self, data: dict) -> dict:
        item = self.__class__(data)
        item_dict = item.to_dict()
        
        product_response, _ = Product().load("id_producto", data.get("id_producto"), get_data=True)
        if product_response.get("success"):
            product_data = product_response.get("data")
            if isinstance(product_data, dict):
                item_dict["nombre_producto"] = product_data.get("nombre")
        return item_dict

    def get_all(self):
        response, status = self._database.get_all(self._table)
        results = response.get("data")
        data = []
        if results:
            for row in results:
                data.append(self._clone_with_data(row))
        response["data"] = data
        return response, status