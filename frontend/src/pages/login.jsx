import React from "react";
import '../assets/css/login.css'
import '../assets/css/base.css'
import '../assets/css/inputs.css'
import Zapato from '../assets/img/Zapato.png'
import { login } from "../assets/js/login";
import { useState , useEffect  } from "react";
import { useUser } from "../components/userContext";
import { useNavigate } from 'react-router-dom';


function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setUser} = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // validar si hay una sesión
    useEffect(() => {
            async function checkSession() {
                try {
                    const res = await fetch("http://localhost:5000/api/users/get/session", {
                        method: "GET",
                        credentials: "include",
                    });
                    if (res.ok) {
                        const data = await res.json();
                        navigate("/Home");
                    }
                } catch (error) {
                    console.error("Error al validar sesión:", error);
                } finally {
                    setLoading(false);
                }
            }
    
            checkSession();
        }, []);
    if(loading){
        return(
            <div>Cargando...</div>
        );
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }
    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }


    async function handleLogin(e) {
        e.preventDefault();
        try {
            const data = await login(email, password);
            console.log("Datos del usuario:", data);
            setUser(data.data);
            navigate("/Home");


        } catch (error) {
            alert("Error de inicio de sesión: " + error.message);
        }
    }


    return (
        <div className="login">
            <div className="login-main" >
                <div className="login-main-logo text-center">
                    <img className="login-main-img" src={Zapato} alt="zapatoLogo" />
                    <h1>GRUPO ANDRÉS</h1>
                </div>
                <div className="row-lg-12 mt-5 rounded-3" style={{ backgroundColor: '#201e1eff' }}>
                    <div className="col-sm-12">
                        <div className="px-5 ms-xl-4">
                            <i className="fas fa-crow fa-2x me-3 pt-5 mt-xl-4 "></i>
                            <h3 className="h1 fw-bold mb-0 text-center " style={{ color: '#aa871d', fontFamily: "DM Serif Text" }}>INICIAR SESIÓN</h3>
                        </div>
                        <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
                            <form onSubmit={handleLogin} style={{ width: '23rem', color: '#aa871d' }}>
                                <div className="form-outline mb-5">
                                    <label className="form-label login-text" htmlFor="userEmail">Correo</label>
                                    <input name="email" type="email" id="userEmail" className="textInputLogin" onChange={handleEmailChange} value={email} required />
                                </div>
                                <div className="form-outline mb-5">
                                    <label className="form-label login-text" htmlFor="userPassword">Contraseña</label>
                                    <input name="password" type="password" id="userPassword" className="textInputLogin" onChange={handlePasswordChange} value={password} required />
                                </div>
                                <div className="pt-1 mb-4">
                                    <button className="btn-lg btn-block w-100 p-2 login-buttom login-text mb-5 mt-5" type="submit">Ingresar</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LoginPage;

/* */