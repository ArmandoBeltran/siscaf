import { useContext } from 'react';
import { UserContext } from './userContext';
import "../assets/css/navbar.css"
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function DropdownUser(){
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null); // si usas errores visibles

    function logout() {
        const configuraciones = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", 
        };

        fetch(`http://localhost:5000/api/users/post/logout`, configuraciones)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(result => {
                if (result.success || result.message === "Sesión cerrada") {
                    navigate("/");
                } else {
                    console.error("Error en la respuesta del servidor:", result.message);
                    setError("No se pudo cerrar sesión");
                }
            })
            .catch(err => {
                console.error("Error al obtener datos:", err);
                setError("Error al cerrar sesión");
            });
    }
    return(
       <div id="dropDownUSer" className="dropdown dropdown-container me-5 h-100 w-50">
            <div className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                <i className='me-3'><FontAwesomeIcon icon={faUser} size='20px'/></i>
                {user.nombre_usu}
            </div>
            <ul className="dropdown-menu me-2" aria-labelledby="dropdownMenuButton1">
                <li><a className="dropdown-item" href="#" onClick={logout}>logout</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
            </ul>
        </div>
    );
}
export default DropdownUser