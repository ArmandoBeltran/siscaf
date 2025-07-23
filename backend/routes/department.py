from flask import Blueprint, request, jsonify
from models.department import Department

department_bp = Blueprint('department', __name__)

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def validate_department(data):
    required = ["nombre", "id_empleado", "estatus"]
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors


@department_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = Department()
        response, status = model.get_all()
        return response, status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@department_bp.route('/get_by', methods=['GET'])
def get_by():
    try:
        field = request.args.get('field')
        value = request.args.get('value')

        if not field or value is None:
            return jsonify({"message": "Falta parámetros", 'success': False}), 400

        model = Department()
        result, status = model.load(field, value, get_data=True)
        return result, status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@department_bp.route('/create', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_department(data)
        if errors:
            return jsonify({"errors": errors, "success": False}), 400
        model = Department(data)
        result, status = model.save()
        
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500


@department_bp.route('/update/<int:id_department>', methods=['PUT'])
def update(id_department):
    try:
        data = request.get_json()

        model = Department()
        instance = model.load(id_department)

        if not instance:
            return jsonify({"message": "Categoría no encontrada", "success": False}), 404
        
        result, status = instance.update(data)
        return result, status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@department_bp.route('/delete/<int:id_department>', methods=['DELETE'])
def delete(id_department):
    try:
        model = Department()
        instance = model.load(id_department)
        if not instance:
            return jsonify({"message": "Departamento no encontrado", "success": False}), 404
        
        result, status = instance.delete()
        
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500
    
@department_bp.route('/get/report', methods=["GET"])
def get_report(): 
    try: 
        model = Department()
        response, status = model.report()
        return jsonify(response), status
    except Exception as e: 
        return jsonify({"message": str(e), "success": False}), 500