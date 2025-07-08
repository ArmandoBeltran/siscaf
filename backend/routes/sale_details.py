from flask import Blueprint, request, jsonify
from models.sale_details import SaleDetails

sale_details_bp = Blueprint('sale_details', __name__)

def validate_sale_details(data):
    required = []
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors

@sale_details_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = SaleDetails()
        return jsonify(model.get_all()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_details_bp.route('/get/<int:id_detalle>', methods=['GET'])
def get_by_id(id_detalle):
    try:
        model = SaleDetails()
        result = model.load(id_detalle)
        return jsonify(model.to_dict()) if result else (jsonify({"error": "Detalle de venta no encontrado"}), 404)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_details_bp.route('/add', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_sale_details(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = SaleDetails(data)
        result = model.save()
        return jsonify({"message": "Detalle de venta creado", "result": result}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_details_bp.route('/update/<int:id_detalle>', methods=['PUT'])
def update(id_detalle):
    try:
        data = request.get_json()
        errors = validate_sale_details(data)
        if errors:
            return jsonify({"errors": errors}), 400
        model = SaleDetails()
        if not model.load(id_detalle):
            return jsonify({"error": "Detalle de venta no encontrado"}), 404
        model._from_dict(data)
        result = model.save()
        return jsonify({"message": "Detalle de venta actualizado", "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_details_bp.route('/delete/<int:id_detalle>', methods=['DELETE'])
def delete(id_detalle):
    try:
        model = SaleDetails()
        if not model.load(id_detalle):
            return jsonify({"error": "Detalle de venta no encontrado"}), 404
        result = model.delete()
        return jsonify({"message": "Detalle de venta eliminado", "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500