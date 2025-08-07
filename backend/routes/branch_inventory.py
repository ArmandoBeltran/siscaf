from flask import Blueprint, request, jsonify
from models.branch_inventory import BranchInventory
import logging

branch_inventory_bp = Blueprint('branch_inventory', __name__)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def validate_inventory(data):
    required = ['id_producto', 'existencia', 'cantidad_vendida', 'id_sucursal']
    errors = {}
    for field in required:
        if field not in data or data[field] in [None, '']:
            errors[field] = f"{field} is required."
    return errors

@branch_inventory_bp.route('/get', methods=['GET'])
def get_all():
    try:
        model = BranchInventory()
        response, status = model.get_all()
        return response, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_inventory_bp.route('/get/branch/<int:branch_id>', methods=['GET'])
def get_by_branch_id(branch_id):
    try:
        model = BranchInventory()
        result, status = model.load(branch_id, get_data=True)
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_inventory_bp.route('/create', methods=['POST'])
def create():
    try:
        data = request.get_json()
        errors = validate_inventory(data)
        if errors:
            return jsonify({"errors": errors, "success": False}), 400

        model = BranchInventory(data)
        result, status = model.save()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_inventory_bp.route('/update/<int:id_inv_suc>', methods=['PUT'])
def update(id_inv_suc):
    try:
        data = request.get_json()

        model = BranchInventory()
        instance = model.load(id_inv_suc)

        if not instance:
            return jsonify({"message": "Inventario no encontrado", "success": False}), 404

        result, status = instance.update(data)
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_inventory_bp.route('/delete/<int:id_inv_suc>', methods=['DELETE'])
def delete(id_inv_suc):
    try:
        model = BranchInventory()
        instance = model.load(id_inv_suc)
        if not instance:
            return jsonify({"message": "Inventario no encontrado", "success": False}), 404

        result, status = instance.delete()
        return result, status
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 500

@branch_inventory_bp.route('/assign', methods=['POST'])
def assign_product_to_branch():
    try:
        data = request.get_json()
        id_producto = data.get("id_producto")
        id_sucursal = data.get("id_sucursal")
        cantidad = int(data.get("existencia", 0))
        logging.debug(data)

        if not all([id_producto, id_sucursal, cantidad]):
            return jsonify({"success": False, "message": "Datos incompletos"}), 400

        from models.inventory import Inventory
        inventory_model = Inventory()
        all_inv, _ = inventory_model.get_all()
        matching = next((item for item in all_inv["data"] if item["id_producto"] == id_producto), None)

        if not matching:
            return jsonify({"success": False, "message": "Producto no existe en inventario general"}), 404
        if matching["existencia"] < cantidad:
            return jsonify({"success": False, "message": "Stock insuficiente"}), 400

        # 2. Restar del inventario general
        inventory = Inventory()
        inventory.id_inventario = matching["id_inventario"]
        updated_existencia = matching["existencia"] - cantidad
        inventory.update({"existencia": updated_existencia})

        # 3. Verificar si ya existe inventario_suc para ese producto y sucursal
        db = inventory._database  # Reutilizamos la instancia de DB
        check_result, _ = db.get_by_multiple(
            {"id_producto": id_producto, "id_sucursal": id_sucursal},
            "catalogos.inventario_suc"
        )
        existing_rows = check_result.get("data", [])

        if existing_rows:
            existing = existing_rows[0]
            logging.debug(existing)
            id_inv_suc = existing["id_inv_suc"]
            nueva_existencia = existing["existencia"] + cantidad
            nueva_total = (existing["cantidad_total"] or 0) + cantidad

            db.update("catalogos.inventario_suc", {
                "existencia": nueva_existencia,
                "cantidad_total": nueva_total
            }, {"id_inv_suc": id_inv_suc})
        else:
            suc_model = BranchInventory({
                "id_producto": id_producto,
                "id_sucursal": id_sucursal,
                "existencia": cantidad,
                "cantidad_vendida": 0,
                "cantidad_total": cantidad
            })
            suc_model.save()

        return jsonify({"success": True, "message": "Producto asignado correctamente"}), 200

    except Exception as e:
        logger.exception("Error en asignación de producto")
        return jsonify({"success": False, "message": str(e)}), 500