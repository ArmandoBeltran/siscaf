from flask import Blueprint, request, jsonify
from models.employee import Employee

employee_bp = Blueprint('employee', __name__)

def validate_employee(data):
    required = []
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors

@employee_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = Employee()
        response = model.get_all()
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/get/<int:id_empleado>', methods=['GET'])
def get_by_id(id_empleado):
    try:
        model = Employee()
        result = model.load(id_empleado)
        return jsonify(model.to_dict()) if result else (jsonify({"error": "Empleado no encontrado"}), 404)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/add', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_employee(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = Employee(data)
        result = model.save()
        return jsonify({"message": "Empleado creado", "result": result}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/update/<int:id_empleado>', methods=['PUT'])
def update(id_empleado):
    try:
        data = request.get_json()
        errors = validate_employee(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = Employee()
        if not model.load(id_empleado):
            return jsonify({"error": "Empleado no encontrado"}), 404
        model._from_dict(data)
        result = model.save()
        return jsonify({"message": "Empleado actualizado", "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/delete/<int:id_empleado>', methods=['DELETE'])
def delete(id_empleado):
    try:
        model = Employee()
        if not model.load(id_empleado):
            return jsonify({"error": "Empleado no encontrado"}), 404
        result = model.delete()
        return jsonify({"message": "Empleado eliminado", "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500