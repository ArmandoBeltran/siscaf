from flask import Blueprint, request, jsonify
from models.branch_inventory import BranchInventory
import logging

branch_inventory_bp = Blueprint('branch_inventory', __name__)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def validate_inventory(data):
    required = ['id_producto', 'existencia', 'cantidad_vendida', 'id_sucursal']
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors

@branch_inventory_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = BranchInventory()
        response, status = model.get_all()
        return response, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_inventory_bp.route('/get/branch/<int:branch_id>', methods=['GET'])
def get_by_branch_id(branch_id):
    try:
        model = BranchInventory()
        result, status = model.load(branch_id, get_data=True)
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_inventory_bp.route('/create', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_inventory(data)
        if errors:
            return jsonify({"errors": errors, "success": False}), 400

        model = BranchInventory(data)
        result, status = model.save()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_inventory_bp.route('/update/<int:id_inv_suc>', methods=['PUT'])
def update(id_inv_suc):
    try:
        data = request.get_json()

        model = BranchInventory()
        instance = model.load(id_inv_suc)

        if not instance:
            return jsonify({"message": "Inventario no encontrado", "success": False}), 404

        result, status = instance.update(data)
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_inventory_bp.route('/delete/<int:id_inv_suc>', methods=['DELETE'])
def delete(id_inv_suc):
    try:
        model = BranchInventory()
        instance = model.load(id_inv_suc)
        if not instance:
            return jsonify({"message": "Inventario no encontrado", "success": False}), 404

        result, status = instance.delete()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500
