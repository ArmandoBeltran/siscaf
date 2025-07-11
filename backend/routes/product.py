from flask import Blueprint, request, jsonify
from models.product import Product
import logging

product_bp = Blueprint('product', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def validate_product(data):
    required = ['material', 'talla', 'color', 'ocasion', 'tipo_tacon', 'id_categoria', 'descripcion', 'precio', 'nombre', 'altura_tacon']
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors

@product_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = Product()
        response, status = model.get_all()

        return response, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500
    
@product_bp.route('/get_by', methods=['GET'])
def get_by():
    try:
        field = request.args.get('field')
        value = request.args.get('value')

        if not field or value is None:
            return jsonify({"message": "Missing 'field' or 'value' parameter", 'success': False}), 400

        model = Product()
        result, status = model.load(field, value, get_data=True)

        return result, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500

@product_bp.route('/create', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_product(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = Product(data)
        result, status = model.save()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500
    
@product_bp.route('/update/<int:id_producto>', methods=['PUT'])
def update(id_producto):
    try:
        data = request.get_json()
        #errors = validate_product(data)
        #if errors:
        #    return jsonify({"errors": errors}), 400
        
        model = Product()
        product = model.load(id_producto)

        if not product:
            return jsonify({"message": "Producto no encontrado"}), 404
        
        result, status = product.update(data)

        return result, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500
    
@product_bp.route('/delete/<int:id_producto>', methods=['DELETE'])
def delete(id_producto):
    try:
        model   = Product()
        product = model.load(id_producto) 
        if not product:
            return jsonify({"message": "Producto no encontrado", "success": False}), 404
        
        result, status = model.delete()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500