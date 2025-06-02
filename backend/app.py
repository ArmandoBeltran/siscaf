from flask import Flask, jsonify
from flask_cors import CORS  

app = Flask(__name__)
CORS(app) 

@app.route('/')
def hello(): 
    return jsonify({"message" : "Hola mundo"})

@app.route('/api/usuarios')
def obtener_usuarios():
    datos = [
        {"id": 1, "nombre": "Ana", "email": "ana@example.com"},
        {"id": 2, "nombre": "Carlos", "email": "carlos@example.com"}
    ]
    return jsonify(datos)

if __name__ == '__main__': 
    app.run(host='0.0.0.0', debug=True)