from .database import DataBase
from datetime import datetime
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

        self.cantidadVentas=None
        self.genero=None
        
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
    

    def fomatDate(self, date):
        dt = datetime.strptime(date, "%a, %d %b %Y %H:%M:%S %Z")
        return dt.strftime("%Y-%m-%d")

       

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
    def getDetail(self , saleid):
        query='''SELECT a.id_detalle , b.nombre , a.cantidad, a.precio_unitario , a.importe  FROM catalogos.detalle_venta a 
            JOIN catalogos.producto b ON (a.id_producto = b.id_producto) WHERE id_venta = %s;'''
        try: 
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query, (saleid,))
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            columns = ["id_detalle", "producto" ,"cantidad" ,"precio_unitario", "importe"]
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
    
    '''Obtener ventas por género de una fecha a otra fecha'''
    def get_saleByGender(self , start_date=None, end_date=None): 
        result = self._database.execute_query(
            '''SELECT COUNT(a.id_detalle) AS ventas, c.genero
                FROM catalogos.detalle_venta a
                JOIN catalogos.producto b ON (a.id_producto = b.id_producto)
                JOIN catalogos.categoria c ON (b.id_categoria = c.id_categoria)
                WHERE a.fecha_alta BETWEEN %s AND %s
                GROUP BY c.genero''', (start_date, end_date))
        if result:
            data = []
            for row in result:
                data.append({
                    'ventas': row[0],
                    'genero': row[1]
                })
            return data
        return None
    
    '''Ventas por categoria de zapato de una fecha a otra'''
    
    def get_categorySales(self , start_date=None ,end_date=None):
        result = self._database.execute_query('''SELECT COUNT (a.id_detalle) AS ventas, c.nombre AS categoria
            FROM catalogos.detalle_venta a
            JOIN catalogos.producto b ON (a.id_producto = b.id_producto)
            JOIN catalogos.categoria c ON (b.id_categoria = c.id_categoria)
            WHERE a.fecha_alta BETWEEN %s AND %s
            GROUP BY c.nombre
            ORDER BY ventas DESC''', (start_date, end_date))
        if result:
            data=[]
            for row in result:
                data.append({
                    'ventas': row[0],
                    'categoria': row[1]
                })
            return data
        return None
    
    def get_productSales(self , start_date=None ,end_date=None , id_producto=None):
        result = self._database.execute_query('''SELECT b.nombre, SUM (a.cantidad) AS cantidad, a.fecha_alta
            FROM catalogos.detalle_venta a
            JOIN catalogos.producto b ON (a.id_producto = b.id_producto)
            WHERE (a.fecha_alta BETWEEN %s AND %s) AND a.id_producto = %s AND a.fecha_alta != '2025-07-03'
            GROUP BY b.nombre , a.fecha_alta
            ORDER BY a.fecha_alta''', (start_date, end_date , id_producto) )
        if result:
            data=[]
            for row in result:
                data.append({
                    'nombre': row[0],
                    'ventas': row[1],
                    'fecha_alta': format(row[2])
                })
            return data
        return None
    def get_sucursalSales(self , start_date=None ,end_date=None ):
        result = self._database.execute_query('''SELECT 
                b.nombre, 
                SUM(c.cantidad) AS cantidad, 
                DATE_PART('month', a.fecha_venta) AS mes_numero --Solo tomo el mes
            FROM catalogos.ventas a 
            JOIN catalogos.sucursal b ON (a.id_sucursal = b.id_sucursal)
            JOIN catalogos.detalle_venta c ON (a.id_venta = c.id_venta)
            WHERE a.fecha_venta BETWEEN %s AND %s
            GROUP BY b.nombre, DATE_PART('month', a.fecha_venta)
            ORDER BY mes_numero''', (start_date, end_date ) )
        if result:
            data=[]
            for row in result:
                data.append({
                    'sucursal': row[0],
                    'ventas': row[1],
                    'mes': int(row[2])
                })
            return data
        return None
    
    def get_Top_10_products(self, start_date, end_date):
        query = '''
        SELECT b.nombre, (SUM(a.cantidad) * precio_unitario) AS Ganancias 
        FROM catalogos.ventas v
        JOIN  catalogos.detalle_venta a ON (a.id_venta = v.id_venta)
        JOIN catalogos.producto b ON (a.id_producto = b.id_producto)
        WHERE v.fecha_venta BETWEEN %s AND %s
        GROUP BY b.nombre, a.precio_unitario, a.importe
        ORDER by Ganancias DESC 
        LIMIT 10'''
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query, (start_date, end_date))
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            columns = ["producto", "ganancias"]
            data = [dict(zip(columns, row)) for row in results]

            logging.info(data)

            return {
                "success": True,
                "message": "Datos para grafica de productos mas vendidos recuperados con exito",
                "data": data
            }, 200
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500
        
    def get_Comparative(self, start_year, end_year):
        query = '''
        WITH meses AS (
            SELECT generate_series(1, 12) AS mes
        ),anios AS (
            SELECT %s AS anio UNION SELECT %s
        ),meses_anios AS (
            SELECT m.mes, a.anio
            FROM meses m
            CROSS JOIN anios a
        )SELECT 
            COALESCE(COUNT(v.id_venta), 0) as ventas, ma.mes, ma.anio
        FROM meses_anios ma
        LEFT JOIN catalogos.ventas v ON EXTRACT(MONTH FROM v.fecha_venta) = ma.mes 
            AND EXTRACT(YEAR FROM v.fecha_venta) = ma.anio
            AND (ma.anio = %s OR ma.anio = %s)
        GROUP BY 
            ma.mes, ma.anio
        ORDER BY 
            ma.anio, ma.mes;'''
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query, (start_year, end_year, start_year, end_year))
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            columns = ["sale", "month", "year"]
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


    def get_SellerPerformance(self, year):
        query = '''
            SELECT c.nombre as Vendedor, SUM(dt.cantidad *  CAST(dt.precio_unitario AS NUMERIC)) AS total , EXTRACT(MONTH FROM fecha_venta)AS mes
            FROM catalogos.detalle_venta dt
            JOIN catalogos.ventas a ON (a.id_venta = dt.id_venta)
            JOIN catalogos.vendedores b ON (a.id_vendedor = b.id_vendedor)
            JOIN empleados.empleados c ON (b.id_empleado = c.id_empleado)
            WHERE EXTRACT(YEAR FROM a.fecha_venta) = %s
            GROUP BY c.nombre , mes
            ORDER BY mes ;'''
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query, (year,))
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            columns = ["vendedor", "ganancias", "mes"]
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
        
    def get_season_sales( self , start_date , end_date):
        query = '''SELECT SUM(b.cantidad) AS ventas, d.temporada
                FROM catalogos.ventas a 
                JOIN catalogos.detalle_venta b ON (a.id_venta = b.id_venta)
                JOIN catalogos.producto c ON (b.id_producto = c.id_producto)
                JOIN catalogos.categoria d ON (c.id_categoria = d.id_categoria)
                WHERE a.fecha_venta BETWEEN '2025-01-01' AND '2025-12-31'
                GROUP BY d.temporada'''
        try: 
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(query, (start_date, end_date))
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            columns = ["ventas", "temporada"]
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