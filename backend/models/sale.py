from .database import DataBase
import logging


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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

    def to_dict(self, include_all=None):
        data = {
            "id_venta": self.id_venta,
            "id_vendedor": self.id_vendedor,
            "id_sucursal": self.id_sucursal,
            "fecha_venta": self.fecha_venta,
        }

        return data if include_all else {k: v for k, v in data.items() if v is not None}

    def save(self ,id_vendedor, id_sucursal ): 
       id_venta = self._database.insert_and_return_id('''
            INSERT INTO catalogos.ventas(
            id_vendedor, id_sucursal)
            VALUES (%s, %s) RETURNING id_venta;
        ''', (id_vendedor, id_sucursal))
       return id_venta

    def update(self, new_data):
        return self._database.update(self._table, new_data, {"id_venta": self.id_venta})

    def delete(self):
        return self._database.delete(self._table, {"id_venta": self.id_venta})

    def load(self, field, value, get_data=False):
        response, status = self._database.get_by(field, value, self._table)
        results = response.get("data", [])

        if results: 
            self._from_dict(results[0])
            if get_data:
                response["data"] = self.to_dict()
                return response, status
            return self
        return None
    
    def getSales(self):
        query = '''
            SELECT a.id_venta , b2.nombre , c.nombre , fecha_venta 
            FROM catalogos.ventas a 
            JOIN catalogos.vendedores b1 ON (a.id_vendedor = b1.id_vendedor)
            JOIN empleados.empleados b2 ON (b1.id_empleado = b2.id_empleado)
            JOIN catalogos.sucursal c ON (a.id_sucursal = c.id_sucursal)
			ORDER BY fecha_venta DESC
            '''
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            columns = ["id_venta", "vendedor" ,"sucursal" ,"fecha_venta"]
            data = [dict(zip(columns, row)) for row in results]

            logging.info(data)

            return {
                "success": True,
                "message": "Datos para grafica de comparativa recuperados con exito",
                "data": data
            }, 200
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500
    
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
    
    def report_by_date_level_one(self, start_date, end_date):
        query = '''
            SELECT
                DATE(v.fecha_venta) AS fecha,
                COUNT(DISTINCT v.id_venta) AS total_ventas,
                COALESCE(SUM(dv.cantidad), 0) AS total_pares_vendidos,
                COALESCE(SUM(dv.importe), 0::money) AS total_ingresos
            FROM catalogos.ventas AS v
            LEFT JOIN catalogos.detalle_venta AS dv ON dv.id_venta = v.id_venta
            WHERE v.fecha_venta BETWEEN %s AND %s
            GROUP BY DATE(v.fecha_venta)
            ORDER BY fecha;
        '''
        logging.debug(query)
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query, (start_date, end_date))
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            columns = ["fecha", "total_ventas", "total_pares_vendidos", "total_ingresos"]
            data = [dict(zip(columns, row)) for row in results]

            return {
                "success": True,
                "message": "Reporte de ventas por fecha generado correctamente",
                "data": data
            }, 200
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500
        
    def report_by_date_level_two(self, date):
        query = '''
            SELECT
                v.id_venta,
                DATE(v.fecha_venta) AS fecha,
                emp.nombre AS vendedor,
                suc.nombre AS sucursal,
                COUNT(DISTINCT v.id_venta) AS total_ventas,
                COALESCE(SUM(dv.cantidad), 0) AS total_pares_vendidos,
                COALESCE(SUM(dv.importe), 0::money) AS total_ingresos
            FROM catalogos.ventas AS v
            LEFT JOIN catalogos.detalle_venta AS dv ON dv.id_venta = v.id_venta
            LEFT JOIN catalogos.vendedores AS ven ON v.id_vendedor = ven.id_vendedor
            LEFT JOIN empleados.empleados AS emp ON ven.id_empleado = emp.id_empleado
            LEFT JOIN catalogos.sucursal AS suc ON v.id_sucursal = suc.id_sucursal
            WHERE DATE(v.fecha_venta) = %s
            GROUP BY v.id_venta, fecha, emp.nombre, v.id_sucursal, suc.nombre
            ORDER BY fecha, vendedor, sucursal;
        '''
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query, (date,))
            results = cursor.fetchall()
            logging.debug(results)
            logging.debug(date)
            cursor.close()
            conn.close()
            columns = ["id_venta", "fecha", "vendedor", "sucursal",
                    "total_ventas", "total_pares_vendidos", "total_ingresos"]
            data = [dict(zip(columns, row)) for row in results]

            logging.info(data)

            return {
                "success": True,
                "message": "Reporte de ventas por vendedor y sucursal generado correctamente",
                "data": data
            }, 200
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500