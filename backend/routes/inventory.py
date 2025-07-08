from flask import Blueprint, request, jsonify
from models.inventory import Inventory
import logging

inventory_bp = Blueprint('inventory', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@inventory_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = Inventory()
        response, status = model.get_all()
        return response, status
    except Exception as e:
        logger.error(f"Error al obtener inventarios: {e}")
        return jsonify({"message": str(e), "success": False}), 500

@inventory_bp.route('/get/<int:id_inventario>', methods=['GET'])
def get_by_id(id_inventario):
    try:
        model = Inventory()
        response, status = model.load(id_inventario, get_data=True)
        return response, status
    except Exception as e:
        logger.error(f"Error al obtener inventario: {e}")
        return jsonify({"message": str(e), "success": False}), 500

@inventory_bp.route('/create', methods=['POST'])
def create():
    try:
        data = request.get_json()
        model = Inventory(data)
        result, status = model.save()
        return result, status
    except Exception as e:
        logger.error(f"Error al crear inventario: {e}")
        return jsonify({"message": str(e), "success": False}), 500

@inventory_bp.route('/update/<int:id_inventario>', methods=['PUT'])
def update(id_inventario):
    try:
        data = request.get_json()
        model = Inventory()
        inventory = model.load(id_inventario)

        if not inventory:
            return jsonify({"message": "Inventario no encontrado", "success": False}), 404

        result, status = inventory.update(data)
        return result, status
    except Exception as e:
        logger.error(f"Error al actualizar inventario: {e}")
        return jsonify({"message": str(e), "success": False}), 500

@inventory_bp.route('/delete/<int:id_inventario>', methods=['DELETE'])
def delete(id_inventario):
    try:
        model = Inventory()
        inventory = model.load(id_inventario)
        if not inventory:
            return jsonify({"message": "Inventario no encontrado", "success": False}), 404

        result, status = inventory.delete()
        return result, status
    except Exception as e:
        logger.error(f"Error al eliminar inventario: {e}")
        return jsonify({"message": str(e), "success": False}), 500
