from flask import Blueprint, request, jsonify
from models.category import Category

category_bp = Blueprint('category', __name__)

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def validate_category(data):
    required = ["descripcion", "estatus", "genero", "nombre", "temporada"]
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors


@category_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = Category()
        response, status = model.get_all()
        return response, status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@category_bp.route('/get_by', methods=['GET'])
def get_by(field, value):
    try:
        field = request.args.get('field')
        value = request.args.get('value')

        if not field or value is None:
            return jsonify({"message": "Falta parámetros", 'success': False}), 400
        
        model = Category()
        result, status = model.load(field, value, get_data=True)
        return result, status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@category_bp.route('/create', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_category(data)
        logging.debug(data)
        logging.debug("$"*100)
        if errors:
            return jsonify({"errors": errors, "success": False}), 400
        model = Category(data)
        result, status = model.save()
        
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500


@category_bp.route('/update/<int:id_categoria>', methods=['PUT'])
def update(id_categoria):
    try:
        data = request.get_json()

        model = Category()
        instance = model.load("id_categoria", id_categoria)

        if isinstance(instance, tuple):
            response, status = instance
            return jsonify({"message": "Categoría no encontrada", "success": False}), 404

        
        result, status = instance.update(data)
        return result, status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@category_bp.route('/delete/<int:id_categoria>', methods=['DELETE'])
def delete(id_categoria):
    try:
        model = Category()
        instance = model.load("id_categoria", id_categoria)
        if not instance:
            return jsonify({"message": "Categoría no encontrada", "success": False}), 404
        
        result, status = instance.delete()
        
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500
    
@category_bp.route('/get/report', methods=["GET"])
def get_report(): 
    try: 
        model = Category()
        response, status = model.report()
        return jsonify(response), status
    except Exception as e: 
        return jsonify({"message": str(e), "success": False}), 500