from .database import DataBase

class Employee:
    def __init__(self, data=None):
        self._table = "empleados.empleados"
        self._database = DataBase()

        self.id_empleado = None
        self.nombre = None
        self.apellidos = None
        self.telefono = None
        self.ciudad = None
        self.estado = None
        self.calle = None
        self.colonia = None
        self.cp = None
        self.fecha_nac = None
        self.curp = None
        self.rfc = None
        self.id_departamento = None
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
            "id_empleado": self.id_empleado,
            "nombre": self.nombre,
            "apellidos": self.apellidos,
            "telefono": self.telefono,
            "ciudad": self.ciudad,
            "estado": self.estado,
            "calle": self.calle,
            "colonia": self.colonia,
            "cp": self.cp,
            "fecha_nac": self.fecha_nac,
            "curp": self.curp,
            "rfc": self.rfc,
            "id_departamento": self.id_departamento,
            "fecha_alta": self.fecha_alta,
            "fecha_mod": self.fecha_mod,
        }

    def save(self):
        if self.id_empleado:
            return self._database.update(self._table, self.to_dict(), {"id_empleado": self.id_empleado})
        else:
            return self._database.insert(self._table, self.to_dict())

    def delete(self):
        if self.id_empleado:
            return self._database.delete(self._table, {"id_empleado": self.id_empleado})
        return "Cannot delete: id_empleado is not set."

    def load(self, emp_id):
        response = self._database.get_by("id_empleado", emp_id, self._table)
        results = response.get("data")
        if results:
            self._from_dict(results[0])
            return self
        return None

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
