from flask import Blueprint, request, jsonify
from models.sale_details import SaleDetails

import logging

sale_details_bp = Blueprint('sale_details', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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
        response, status = model.get_all()

        return response, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500

@sale_details_bp.route('/get_by', methods=['GET'])
def get_by():
    try:
        field = request.args.get('field')
        value = request.args.get('value')

        if not field or value is None:
            return jsonify({"message": "Missing 'field' or 'value' parameter", 'success': False}), 400
        
        model = SaleDetails()
        result, status = model.load(field, value, get_data=True)
        return result, status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@sale_details_bp.route('/get/saleByGender/<start_date>/<end_date>',methods=['GET'])
def get_sale_Gender(start_date, end_date):
    try:
        model = SaleDetails()
        result = model.get_saleByGender(start_date , end_date)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    
@sale_details_bp.route('/get/saleByCategory/<start_date>/<end_date>',methods=['GET'])
def get_sale_Category(start_date, end_date):
    try:
        model = SaleDetails()
        result = model.get_categorySales(start_date , end_date)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    
@sale_details_bp.route('/get/productSales/<start_date>/<end_date>/<int:id_producto>',methods=['GET'])
def get_sale_ProductSales(start_date, end_date , id_producto ):
    try:
        model = SaleDetails()
        result = model.get_productSales(start_date , end_date , id_producto)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    
@sale_details_bp.route('/get/saleBySucursal/<start_date>/<end_date>',methods=['GET'])
def get_sale_Sucursal(start_date, end_date):
    try:
        model = SaleDetails()
        result = model.get_sucursalSales(start_date , end_date)
        return jsonify(result), 200
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
        result, status = model.save()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500

@sale_details_bp.route('/update/<int:id_detalle>', methods=['PUT'])
def update(id_detalle):
    try:
        data = request.get_json()

        model = SaleDetails()
        sale_detail = model.load(id_detalle)
        if not sale_detail:
            return jsonify({"message": "Detalle de venta no encontrado"}), 404
        
        result, status = model.update(data)
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500

@sale_details_bp.route('/delete/<int:id_detalle>', methods=['DELETE'])
def delete(id_detalle):
    try:
        model = SaleDetails()
        sale_detail = model.load(id_detalle)

        if not sale_detail:
            return jsonify({"message": "Detalle de venta no encontrado", "success": False}), 404
        
        result, status = model.delete()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), 'success': False}), 500