from flask_cors import CORS  
from flask import Flask
from routes.product import product_bp
from routes.category import category_bp
from routes.sale import sale_bp
from routes.sale_details import sale_details_bp
from routes.salesperson import salesperson_bp
from routes.branch import branch_bp
from routes.inventory import inventory_bp
from routes.branch_inventory import branch_inventory_bp
from routes.employee import employee_bp
'''from routes.user import user_bp'''
from routes.department import department_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(product_bp, url_prefix='/api/products')
app.register_blueprint(category_bp, url_prefix='/api/categories')
app.register_blueprint(sale_bp, url_prefix='/api/sales')
app.register_blueprint(sale_details_bp, url_prefix='/api/sale_details')
app.register_blueprint(salesperson_bp, url_prefix='/api/salesperson')
app.register_blueprint(branch_bp, url_prefix='/api/branches')
app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
app.register_blueprint(branch_inventory_bp, url_prefix='/api/branch_inventory')
app.register_blueprint(employee_bp, url_prefix='/api/employees')
'''app.register_blueprint(user_bp, url_prefix='/api/users')'''
app.register_blueprint(department_bp, url_prefix='/api/departments')

if __name__ == '__main__': 
    app.run(host='0.0.0.0', debug=True)