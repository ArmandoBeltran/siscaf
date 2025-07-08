from .database import DataBase
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Product(): 

    def __init__(self, data=None):
        self._table       = ""
        self._database    = DataBase()
        self._primary_key = ""

        if data:
            self._from_dict(data)

    def _from_dict(self, data):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def to_dict(self, include_all=None):
        attrs = self.__dict__.keys()

        data = []

        return data if include_all else {key: value for key, value in data.items() if value is not None}

    def save(self):
        return self._database.insert(self._table, self.to_dict())
    
    def update(self, new_data): 
        return self._database.update(self._table, new_data, {"id_producto": self.id_producto})

    def delete(self):
        return self._database.delete(self._table, {"id_producto": self.id_producto})

    def load(self, record_id):
        response = self._database.get_by("id_producto", record_id, self._table)
        results  = response.get("data")

        if results:
            
            columns = list(self.to_dict(True).keys())
            self._from_dict(dict(zip(columns, results[0])))
            
            return self
        
        return None
    
    def get_all(self):
        response = self._database.get_all(self._table)
        results  = response.get('data')
        data = []
        if results:
            columns = list(self.to_dict(True).keys())
            for row in results:
                instance = self.__class__()
                instance._from_dict(dict(zip(columns, row)))
                data.append(instance.to_dict())
        
        response["data"] = data
        return response