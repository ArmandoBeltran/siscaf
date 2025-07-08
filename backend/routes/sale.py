from flask import Blueprint, request, jsonify
from models.sale import Sale

sale_bp = Blueprint('sale', __name__)

def validate_sale(data):
    required = []
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors

@sale_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = Sale()
        return jsonify(model.get_all()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_bp.route('/get/<int:id_venta>', methods=['GET'])
def get_by_id(id_venta):
    try:
        model = Sale()
        result = model.load(id_venta)
        return jsonify(model.to_dict()) if result else (jsonify({"error": "Empleado no encontrado"}), 404)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_bp.route('/add', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_sale(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = Sale(data)
        result = model.save()
        return jsonify({"message": "Empleado creado", "result": result}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_bp.route('/update/<int:id_venta>', methods=['PUT'])
def update(id_venta):
    try:
        data = request.get_json()
        errors = validate_sale(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = Sale()
        if not model.load(id_venta):
            return jsonify({"error": "Empleado no encontrado"}), 404
        model._from_dict(data)
        result = model.save()
        return jsonify({"message": "Empleado actualizado", "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_bp.route('/delete/<int:id_venta>', methods=['DELETE'])
def delete(id_venta):
    try:
        model = Sale()
        if not model.load(id_venta):
            return jsonify({"error": "Empleado no encontrado"}), 404
        result = model.delete()
        return jsonify({"message": "Empleado eliminado", "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500