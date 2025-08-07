from flask import Blueprint, request, jsonify ,make_response
from models.user import User
from datetime import datetime, timedelta


user_bp = Blueprint('user', __name__)



@user_bp.route('/post/login',methods=['POST'])
def user_login():
    try:
        if request.is_json:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
        else:
            email = request.form.get('email')
            password = request.form.get('password')
        model = User()
        result ,session_id = model.loginUser(email, password)   

        if result:
            response = make_response(jsonify({"data" :result , "message": "login exitoso"}), 200)
            response.set_cookie(
            'session_id',
            value=session_id,
            httponly=True,
            secure=False,  # Solo en HTTPS
            samesite='Lax',
            path='/'
            )
            return response
        else:
            return jsonify({"message": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500  

@user_bp.route('/post/logout' , methods = ['POST'])
def user_logout():
    session_id = request.cookies.get('session_id')
    
    if not session_id:
        return jsonify({"error": "No hay sesión activa"}), 400

    try:
        model = User()
        model.delete_Session(session_id)  # <-- aquí pasas el session_id
        response = make_response(jsonify({"message": "Sesión cerrada" , "success" : True}))
        response.delete_cookie('session_id')
        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@user_bp.route('/get/session', methods=['GET'])
def check_session():
    session_id = request.cookies.get('session_id')
    
    if not session_id:
        return jsonify({"error": "No hay sesión activa"}), 401
    
    try:
        model = User()
        session = model.get_session(session_id)
        
        if session:
            # Opcional: validar si la sesión expiró
            #if session['expires_at'] < datetime.now():
             #   return jsonify({"error": "Sesión expirada"}), 401
            user_info = model.get_user_by_id(session['user_id'])
            return jsonify({"data": user_info}), 200
        else:
            return jsonify({"error": "Sesión inválida"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500