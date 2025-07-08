from flask import Blueprint, request, jsonify
from models.category import Category

category_bp = Blueprint('category', __name__)

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def validate_category(data):
    required = ["descripcion", "estado", "genero", "nombre", "temporada"]
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors


@category_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = Category()
        return jsonify(model.get_all()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@category_bp.route('/get/<int:id_categoria>', methods=['GET'])
def get_by_id(id_categoria):
    try:
        logger.info(id_categoria)
        logger.info("#"*100)
        model = Category()
        result = model.load(id_categoria)
        return jsonify(model.to_dict()) if result else (jsonify({"error": "Categoría no encontrada"}), 404)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@category_bp.route('/add', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_category(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = Category(data)
        result = model.save()
        if result == "ok": 
            return jsonify({"message": "Categoría creada", "result": result}), 201
        else: 
            return jsonify({"error": result}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@category_bp.route('/update/<int:id_categoria>', methods=['PUT'])
def update(id_categoria):
    try:
        logger.info(id_categoria)
        logger.info("#"*100)
        data = request.get_json()
        errors = validate_category(data)

        if errors:
            return jsonify({"errors": errors}), 400
        model = Category()

        if not model.load(id_categoria):
            return jsonify({"error": "Categoría no encontrada"}), 404
        
        model._from_dict(data)
        result = model.save()
        return jsonify({"message": "Categoría actualizada", "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@category_bp.route('/delete/<int:id_categoria>', methods=['DELETE'])
def delete(id_categoria):
    try:
        model = Category()
        if not model.load(id_categoria):
            return jsonify({"error": "Categoría no encontrada"}), 404
        result = model.delete()
        
        if result == "ok":
            return jsonify({"message": "Categoría eliminada"}), 200
        else: 
            return jsonify({"error": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500