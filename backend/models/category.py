from .database import DataBase
from datetime import date
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Category(): 

    def __init__(self, data=None):
        self._table = "catalogos.categoria"
        self._database = DataBase()

        self.id_categoria = None
        self.nombre = None
        self.descripcion = None
        self.genero = None
        self.temporada = None
        self.estatus = None
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
            "id_categoria" : self.id_categoria,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "genero": self.genero,
            "temporada": self.temporada,
            "estatus": self.estatus,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }

        return data if include_all else {k: v for k, v in data.items() if v is not None}

    def save(self):
        return self._database.insert(self._table, self.to_dict())
        
    def update(self, new_data): 
        if 'id_categoria' in new_data:
            new_data = dict(new_data)
            new_data.pop('id_categoria')
        return self._database.update(self._table, new_data, {"id_categoria": self.id_categoria})

    def delete(self):
        if hasattr(self, 'id_categoria') and self.id_categoria:
            return self._database.delete(self._table, {"id_categoria": self.id_categoria})
        return "Cannot delete: id_categoria is not set."

    def load(self, field, value, get_data=False):
        response, status = self._database.get_by(field, value, self._table)
        results = response.get("data", [])
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
                instance._from_dict(row)
                data.append(instance.to_dict())

        response["data"] = data
        return response, status
    
    def report(self): 
        query = '''
            SELECT categoria.id_categoria, categoria.nombre, categoria.temporada, 
                   COALESCE(COUNT(producto.id_producto), 0) AS cantidad,
                    CASE 
                        WHEN categoria.estatus = true THEN 'Activa'
                    ELSE
                        'Inactiva'
                    END AS estado
            FROM catalogos.categoria AS categoria
            LEFT JOIN catalogos.producto AS producto ON producto.id_categoria = categoria.id_categoria
            GROUP BY categoria.id_categoria, categoria.nombre, categoria.temporada, categoria.estatus
            ORDER BY categoria.nombre;
        '''
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            logging.info(results)
            columns = ["id_categoria", "nombre", "temporada", "cantidad", "estado"]
            data = [dict(zip(columns, row)) for row in results]

            return {
                "success": True,
                "message": "Categorias con total de productos obtenidas",
                "data": data
            }, 200
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500