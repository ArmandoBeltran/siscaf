from .database import DataBase
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

from datetime import datetime

#import requests

ODOO_API = "https://ea0c7dc76b51.ngrok-free.app/external_api/products"

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
        logging.debug(data)
        logging.debug("#"*1000)
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
        if 'id_producto' in new_data:
            new_data = dict(new_data)
            new_data.pop('id_producto')
        return self._database.update(self._table, new_data, {"id_producto": self.id_producto})

    def delete(self):
        return self._database.delete(self._table, {"id_producto": self.id_producto})

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
                    response["data"] = self.to_dict()
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
    
    def format_date(self, value, with_time=False):
        if isinstance(value, datetime):
            return value.strftime('%Y-%m-%d %H:%M:%S') if with_time else value.strftime('%Y-%m-%d')
        return value  # si ya viene como string o None

    
    def sync_with_odoo(self, action):
        # Diccionario original de datos
        data = self.to_dict(include_all=True)

        # Mapea los campos de tu objeto a los nombres esperados en Odoo:
        precio_raw = data.get('precio', 0)
        if isinstance(precio_raw, str):
            precio_raw = precio_raw.replace('$', '').replace(',', '').strip()
        try:
            list_price = float(precio_raw)
        except:
            list_price = 0.0  # O maneja el error como quieras

        payload = {
            'x_id_producto': data.get('id_producto'),
            'x_color': data.get('color'),
            'x_talla': data.get('talla'),
            'x_altura_tacon': float(data.get('altura_tacon', 0)) if data.get('altura_tacon') else 0.0,
            'x_fecha_alta': self.format_date(data.get('fecha_alta')),           # Formato Y-m-d
            'x_fecha_mod': self.format_date(data.get('fecha_mod'), True),       # Formato Y-m-dTH:M:S
            'x_material': data.get('material'),
            'x_ocasion': data.get('ocasion'),
            'x_tipo_tacon': data.get('tipo_tacon'),
            'x_id_categoria': int(data.get('id_categoria')) if data.get('id_categoria') else None,
            'x_estatus': bool(data.get('estatus')) if 'estatus' in data else True,
            'name': data.get('nombre'),
            'list_price': list_price
        }

        logging.debug(f"[Odoo Payload] {payload}")

        try:
            if action == 'create':
                requests.post(ODOO_API, json=payload)
            elif action == 'update':
                requests.put(f"{ODOO_API}/{self.id_producto}", json=payload)
            elif action == 'delete':
                requests.delete(f"{ODOO_API}/{self.id_producto}")
        except Exception as e:
            logging.error(f"Error syncing with Odoo: {str(e)}")
