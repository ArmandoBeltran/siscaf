from flask import Blueprint, request, jsonify
from models.sale_details import SaleDetails
from datetime import datetime


import logging

sale_details_bp = Blueprint('sale_details', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def validate_sale_details(data):
    required = ["id_venta", "productos"]
    product_required = [ "id_producto", "cantidad", "precio_unitario" ,"importe"] 
    
    errors = {}

    # Validación de los campos principales
    for field in required:
        if field not in data or data[field] in [None, '', []]:
            errors[field] = f"{field} is required."

    # Validar productos solo si existe la lista
    if "productos" in data and isinstance(data["productos"], list):
        productos_errors = []
        for i, prod in enumerate(data["productos"]):
            prod_errors = {}
            for field in product_required:
                if field not in prod or prod[field] in [None, '', 0]:
                    prod_errors[field] = f"{field} is required."
            if prod_errors:
                productos_errors.append({f"producto_{i}": prod_errors})
        
        if productos_errors:
            errors["productos"] = productos_errors

    return errors
@sale_details_bp.route('/getDetail', methods=['GET'])
def get_detail():
    try: 
        saleId = request.args.get("saleid")
        if not saleId:
            return jsonify({"message": "Missing 'saleid' parameter", 'success': False}), 400
        model = SaleDetails()
        result ,status = model.getDetail(saleid=saleId)
        return result, status
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        logging.debug(result)
        return jsonify(result), 200
    except Exception as e:
        logging.debug(str(e))
        logging.debug("#"*1000)
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

@sale_details_bp.route('/get/get_top_products', methods=['GET'] )    
def get_top10_products():
    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        if not start_date or not end_date:
            return jsonify({"message": "Debe proporcionar fecha de inicio y fecha de fin" , "success": False}),400
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

        except ValueError:
            return jsonify({
                "message": "Formato de fecha inválido.",
                "success": True
            }), 400
        model = SaleDetails()
        response, status = model.get_Top_10_products(start_date=start_date , end_date=end_date)
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "message": str(e),
            "success": False
        }), 500 
    
@sale_details_bp.route('/get/year_comparative', methods=['GET'] )    
def get_year_comparative():
    try:
        start_year = int(request.args.get("start_year"))
        end_year = int (request.args.get("end_year"))
        if not start_year or not end_year:
            return jsonify({"message": "Debe proporcionar año de inicio y fin" , "success": False}),400
       
        model = SaleDetails()
        response, status = model.get_Comparative(start_year=start_year , end_year=end_year)
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "message": str(e),
            "success": False
        }), 500 
    
@sale_details_bp.route('/get/seller_performance', methods=['GET'] )    
def get_seller_performance():
    try:
        year = request.args.get("year")
 
        if not year:
            return jsonify({"message": "Debe proporcionar año" , "success": False}),400
        model = SaleDetails()
        response, status = model.get_SellerPerformance(year=year)
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "message": str(e),
            "success": False
        }), 500 
    
@sale_details_bp.route('/get/sales_season', methods=['GET'] )    
def get_season_sales():
    try:
        start_date = request.args.get("start_date")
        end_date= request.args.get('end_date')
 
        if not start_date or not end_date:
            return jsonify({"message": "Debe proporcionar año" , "success": False}),400
        model = SaleDetails()
        response, status = model.get_season_sales(start_date=start_date , end_date=end_date)
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "message": str(e),
            "success": False
        }), 500 
     

    
@sale_details_bp.route('/add', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_sale_details(data)
        if errors:
            return jsonify({"errors": errors}), 400
        for prod in data["productos"]:
            model = SaleDetails({
                "id_venta": data["id_venta"],
                "id_producto": prod["id_producto"],
                "cantidad": prod["cantidad"],
                "precio_unitario": prod["precio_unitario"], 
                "importe": prod["importe"],                  
                "descuento": 0
                
            })
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