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
def create_or_update_inventory():
    try:
        data = request.get_json()
        id_producto = data.get('id_producto')
        cantidad_nueva = float(data.get('cantidad_producida', 0))
        logging.debug(id_producto)
        logging.debug(data)

        if not id_producto or cantidad_nueva <= 0:
            return jsonify({"message": "Datos inválidos", "success": False}), 400

        # Verificar si ya existe inventario para este producto
        model = Inventory()
        response, status = model.get_by_producto(id_producto)
        inventarios = response.get("data", [])

        if inventarios:
            # Ya existe: actualizar sumando la cantidad
            inventario_existente = inventarios[0]
            model._from_dict(inventario_existente)
            nueva_existencia = (model.existencia or 0) + cantidad_nueva
            nueva_cantidad_producida = (model.cantidad_producida or 0) + cantidad_nueva

            update_data = {
                "cantidad_producida": nueva_cantidad_producida,
                "existencia": nueva_existencia
            }

            result, status = model.update(update_data)
        else:
            # No existe: crear nuevo registro
            data["existencia"] = cantidad_nueva
            model = Inventory(data)
            result, status = model.save()

        return result, status

    except Exception as e:
        logger.error(f"Error al crear/actualizar inventario: {e}")
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
