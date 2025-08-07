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

    def to_dict(self, include_all=None):
        data = {
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

        return data if include_all else {k: v for k, v in data.items() if v is not None}

    def save(self):
        return self._database.insert(self._table, self.to_dict())
        
    def update(self, new_data):
        if "id_empleado" in new_data: 
            new_data = dict(new_data)
            new_data.pop("id_empleado")
        return self._database.update(self._table, new_data, {"id_empleado": self.id_empleado})
    
    def delete(self):
        return self._database.delete(self._table, {"id_empleado": self.id_empleado})

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
                    response["data"] = [self.to_dict()]
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
