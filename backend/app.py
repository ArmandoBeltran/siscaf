from flask import Flask, jsonify
from flask_cors import CORS  

from database import DBConnection

app = Flask(__name__)
CORS(app) 

@app.route('/')
def hello(): 
    try:
        conn = DBConnection().get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM catalogos.categoria")
        result = cur.fetchall()
        cur.close()
        conn.close()
        return f"Connected to DB! Time: {result}"
    except Exception as e:
        return f"DB connection failed: {e}"
    #return jsonify({"message" : "Hola mundo"})

@app.route('/api/usuarios')
def obtener_usuarios():
    datos = [
        {"id": 1, "nombre": "Ana", "email": "ana@example.com"},
        {"id": 2, "nombre": "Carlos", "email": "carlos@example.com"}
    ]
    return jsonify(datos)

if __name__ == '__main__': 
    app.run(host='0.0.0.0', debug=True)