import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import '../assets/css/navbar.css'

import Zapato from '../assets/img/Zapato.png'

function NavBar({ modules })
{
    /*
        TODO: Terminar de diseñar el navbar de forma que incluya el ícono del usuario 
              del lado derecho y sea un desplegable con las acciones de usuario.
    */
    return (
        <nav className="navbar navbar-section navbar-expand-md">
            <a href="/" className="navbar-brand navbar-logo">
                <img src={Zapato} alt="Icon"/>
                <p>GRUPO ANDRÉS</p>
            </a>
            <div className="collapse navbar-collapse navbar-content" id='navbar-supported-content'>
                <ul className="navbar-nav mr-auto navbar-items">
                    {modules.map((element, index) => (
                        <li key={ index } className="nav-item">
                            <Link to={ element.url } className="nav-link">{ element.text }</Link>
                        </li>
                    ))}
                </ul>
                
                <div className="navbar-user dropdown">
                    <FontAwesomeIcon icon={faUser} size="2x"/>
                    
                </div>
            </div>
        </nav>
    )
}

export default NavBar