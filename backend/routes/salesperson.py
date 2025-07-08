from flask import Blueprint, request, jsonify
from models.salesperson import SalesPerson

salesperson_bp = Blueprint('salesperson', __name__)

def validate_salesperson(data):
    required = []
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors

@salesperson_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = SalesPerson()
        return jsonify(model.get_all()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@salesperson_bp.route('/get/<int:id_vendedor>', methods=['GET'])
def get_by_id(id_vendedor):
    try:
        model = SalesPerson()
        result = model.load(id_vendedor)
        return jsonify(model.to_dict()) if result else (jsonify({"error": "Vendedor no encontrado"}), 404)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@salesperson_bp.route('/add', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_salesperson(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = SalesPerson(data)
        result = model.save()
        return jsonify({"message": "Vendedor creado", "result": result}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@salesperson_bp.route('/update/<int:id_vendedor>', methods=['PUT'])
def update(id_vendedor):
    try:
        data = request.get_json()
        errors = validate_salesperson(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = SalesPerson()
        if not model.load(id_vendedor):
            return jsonify({"error": "Vendedor no encontrado"}), 404
        model._from_dict(data)
        result = model.save()
        return jsonify({"message": "Vendedor actualizado", "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@salesperson_bp.route('/delete/<int:id_vendedor>', methods=['DELETE'])
def delete(id_vendedor):
    try:
        model = SalesPerson()
        if not model.load(id_vendedor):
            return jsonify({"error": "Vendedor no encontrado"}), 404
        result = model.delete()
        return jsonify({"message": "Vendedor eliminado", "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500