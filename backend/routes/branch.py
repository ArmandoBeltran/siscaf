from flask import Blueprint, request, jsonify
from models.branch import Branch
import logging

branch_bp = Blueprint('branch', __name__)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def validate_branch(data):
    required = ['nombre', 'estado', 'ciudad', 'cp', 'calle', 'colonia', 'empleado_cargo']
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors

@branch_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = Branch()
        response, status = model.get_all()
        return response, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_bp.route('/get/<int:id_sucursal>', methods=['GET'])
def get_by_id(id_sucursal):
    try:
        model = Branch()
        result, status = model.load(id_sucursal, get_data=True)
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_bp.route('/create', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_branch(data)
        if errors:
            return jsonify({"errors": errors, "success": False}), 400

        model = Branch(data)
        result, status = model.save()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_bp.route('/update/<int:id_sucursal>', methods=['PUT'])
def update(id_sucursal):
    try:
        data = request.get_json()
        # Optional: validate again on update
        model = Branch()
        instance = model.load(id_sucursal)

        if not instance:
            return jsonify({"message": "Sucursal no encontrada", "success": False}), 404

        result, status = instance.update(data)
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_bp.route('/delete/<int:id_sucursal>', methods=['DELETE'])
def delete(id_sucursal):
    try:
        model = Branch()
        instance = model.load(id_sucursal)
        if not instance:
            return jsonify({"message": "Sucursal no encontrada", "success": False}), 404

        result, status = instance.delete()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500
    
@branch_bp.route('/get_with_totals', methods=['GET'])
def get_all_with_totals():
    try:
        model = Branch()
        response, status = model.get_all_with_total_products()
        return jsonify(response), status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500
