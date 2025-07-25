from .database import DataBase
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Branch():

    def __init__(self, data=None):
        self._table = "catalogos.sucursal"
        self._database = DataBase()

        self.id_sucursal = None
        self.nombre = None
        self.estado = None
        self.ciudad = None
        self.cp = None
        self.calle = None
        self.colonia = None
        self.empleado_cargo = None
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
            "id_sucursal": self.id_sucursal,
            "nombre": self.nombre,
            "estado": self.estado,
            "ciudad": self.ciudad,
            "cp": self.cp,
            "calle": self.calle,
            "colonia": self.colonia,
            "empleado_cargo": self.empleado_cargo,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }
        return data if include_all else {k: v for k, v in data.items() if v is not None}

    def save(self):
        return self._database.insert(self._table, self.to_dict())

    def update(self, new_data):
        return self._database.update(self._table, new_data, {"id_sucursal": self.id_sucursal})

    def delete(self):
        return self._database.delete(self._table, {"id_sucursal": self.id_sucursal})

    def load(self, record_id, get_data=False):
        response, status = self._database.get_by("id_sucursal", record_id, self._table)
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
        results = response.get("data")
        data = []

        if results:
            for row in results:
                instance = self.__class__()
                instance._from_dict(row)  # sin zip
                data.append(instance.to_dict())

        response["data"] = data
        return response, status
    
    def get_all_with_total_products(self):
        query = '''
            SELECT s.id_sucursal, s.nombre, s.estado, s.ciudad,
                COALESCE(SUM(i.existencia), 0) AS cantidad_total
            FROM catalogos.sucursal s
            LEFT JOIN catalogos.inventario_suc i ON s.id_sucursal = i.id_sucursal
            GROUP BY s.id_sucursal, s.nombre, s.estado, s.ciudad
            ORDER BY s.nombre
        '''
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            conn.close()

            columns = ["id_sucursal", "nombre", "estado", "ciudad", "cantidad_total"]
            data = [dict(zip(columns, row)) for row in results]

            return {
                "success": True,
                "message": "Sucursales con total de productos obtenidas",
                "data": data
            }, 200
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500

