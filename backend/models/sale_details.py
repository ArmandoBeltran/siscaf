from .database import DataBase
from datetime import datetime

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

    def to_dict(self):
        return {
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
    def fomatDate(self, date):
        dt = datetime.strptime(date, "%a, %d %b %Y %H:%M:%S %Z")
        return dt.strftime("%Y-%m-%d")

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