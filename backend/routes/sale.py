from flask import Blueprint, request, jsonify
from models.sale import Sale
from datetime import datetime

sale_bp = Blueprint('sale', __name__)

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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
        response, status = model.get_all()

        return response, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@sale_bp.route('/get_by', methods=['GET'])
def get_by():
    try:
        field = request.args.get('field')
        value = request.args.get('value')

        if not field or value is None:
            return jsonify({"message": "Falta parámetros", 'success': False}), 400

        model = Sale()
        result, status = model.load(field, value, get_data=True)
        return result, status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_bp.route('/create', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_sale(data)
        if errors:
            return jsonify({"errors": errors, "success": False}), 400
        model = Sale(data)
        result, status = model.save()
        
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@sale_bp.route('/update/<int:id_venta>', methods=['PUT'])
def update(id_venta):
    try:
        data = request.get_json()

        model = Sale()
        instance = model.load(id_venta)

        if not instance:
            return jsonify({"message": "Venta no encontrada", "success": False}), 404
        
        result, status = instance.update(data)
        return result, status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_bp.route('/delete/<int:id_venta>', methods=['DELETE'])
def delete(id_venta):
    try:
        model = Sale()
        instance = model.load(id_venta)
        if not instance:
            return jsonify({"message": "Venta no encontrada", "success": False}), 404
        
        result, status = instance.delete()
        
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@sale_bp.route('/get/report_by_date', methods=['GET'])
def get_report():
    try:
        start_date = request.args.get("startDate")
        end_date = request.args.get("endDate")

        if not start_date or not end_date:
            return jsonify({
                "message": "Debe proporcionar fecha de inicio y fecha de fin",
                "success": False
            }), 400

        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({
                "message": "Formato de fecha inválido. Use YYYY-MM-DD",
                "success": False
            }), 400

        model = Sale()
        response, status = model.report_by_date_level_one(start_date=start_date, end_date=end_date)
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "message": str(e),
            "success": False
        }), 500
    
@sale_bp.route('/get/report_by_date_level_two', methods=['GET'])
def get_report_level_two():
    try:
        date = request.args.get("date")

        if not date:
            return jsonify({
                "message": "Debe proporcionar fecha",
                "success": False
            }), 400

        try:
            date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({
                "message": "Formato de fecha inválido. Use YYYY-MM-DD",
                "success": False
            }), 400

        model = Sale()
        response, status = model.report_by_date_level_two(date)
        logging.info(response)
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "message": str(e),
            "success": False
        }), 500