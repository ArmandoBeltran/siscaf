import {Link} from 'react-router-dom'
import {props} from 'react'

function Navegador(props) {

  return(
    <nav className="navbar navbar-expand-md bg-body-light">
    <div className="container-fluid">
      <a className="navbar-brand" href="/">
      ANDRES
      </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">

          <li className="nav-item">
            <a className={`nav-link ${props.page == "Inicio" ? "active" : "" }`} aria-current="page" href="/Administración">Inicio</a>
          </li>
            {Object.entries(props).filter(([key]) => !["ubicacion", "page"].includes(key)) // Excluye la propiedad "ubicacion"
              .map(([key, value]) => (
                
                <li key={key} className="nav-item">
                    <Link 
                      className={`nav-link ${props.page === value ? "active" : ""}`}
                      to={`/${props.ubicacion}/${value}`}  // Elimina duplicados
                    >
                      {value}
                    </Link>
                </li>
            ))
            }
          <li className="nav-item">
            <a className="nav-link disabled" aria-disabled="true">{props.ubicacion}</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  );
} 
export default Navegador
