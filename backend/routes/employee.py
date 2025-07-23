from flask import Blueprint, request, jsonify
from models.employee import Employee

import logging

employee_bp = Blueprint('employee', __name__)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def validate_employee(data):
    required = [
        "nombre",
        "apellidos",
        "telefono",
        "ciudad",
        "estado",
        "calle",
        "colonia",
        "cp",
        "fecha_nac",
        "curp",
        "rfc",
        "id_departamento",
        "estatus"
    ]
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors

@employee_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = Employee()
        response, status = model.get_all()
        return response, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500

@employee_bp.route('/get_by', methods=['GET'])
def get_by():
    try:
        field = request.args.get('field')
        value = request.args.get('value')

        if not field or value is None:
            return jsonify({"message": "Missing 'field' or 'value' parameter", 'success': False}), 400
        
        model = Employee()
        result, status = model.load(field, value, get_data=True)

        logging.debug(result)

        return result, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500

@employee_bp.route('/create', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_employee(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = Employee(data)
        result, status = model.save()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500

@employee_bp.route('/update/<int:id_empleado>', methods=['PUT'])
def update(id_empleado):
    try:
        data = request.get_json()
        
        model = Employee()
        employee = model.load(id_empleado)

        if not employee:
            return jsonify({"message": "Empleado no encontrado"}), 404
        
        result, status = employee.update(data)

        return result, status    
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500

@employee_bp.route('/delete/<int:id_empleado>', methods=['DELETE'])
def delete(id_employee):
    try:
        model   = Employee()
        employee = model.load(id_employee) 
        if not employee:
            return jsonify({"message": "Producto no encontrado", "success": False}), 404
        
        result, status = model.delete()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500