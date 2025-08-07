import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import '../assets/css/navbar.css';
import Zapato from '../assets/img/Zapato.png';
import DropdownUser from './dropdownUser';

function NavBar({ modules }) {
    return (
        <nav className="navbar navbar-section navbar-expand-md">
            <a href="/" className="navbar-brand navbar-logo">
                <img src={Zapato} alt="Icon" />
                <p>GRUPO ANDRÉS</p>
            </a>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse navbar-content" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto navbar-items">
                    {modules.map((module, index) =>
                        module.submenus ? (
                            <li key={index} className="nav-item dropdown">
                                <span
                                    className="nav-link dropdown-toggle"
                                    id={`navbarDropdown${index}`}
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ cursor: "pointer" }}
                                >
                                    {module.text}
                                </span>
                                <ul className="dropdown-menu" aria-labelledby={`navbarDropdown${index}`}>
                                    {module.submenus.map((submenu, subIndex) => (
                                        <li key={subIndex}>
                                            <Link className="dropdown-item" to={submenu.url}>
                                                {submenu.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ) : (
                            <li key={index} className="nav-item">
                                <Link to={module.url} className="nav-link">
                                    {module.text}
                                </Link>
                            </li>
                        )
                    )}
                </ul>

                <div className="navbar-user dropdown">
                    <DropdownUser></DropdownUser>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
