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
        <ul className="container navbar-nav">

          <li className="nav-item">
            <a className={`nav-link ${props.page == "Inicio" ? "active" : "" }`} aria-current="page" href="/Administración">Inicio</a>
          </li>
            {Object.entries(props).filter(([key]) => !["ubicacion", "page"].includes(key)) 
              .map(([key, value]) => (
                
                <li key={key} className="nav-item">
                    <Link 
                      className={`nav-link ${props.page === value ? "active" : ""}`}
                      to={`/${props.ubicacion}/${value}`}  
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
        <div className="container-fluid d-flex justify-content-end ">
            <div className="row">
              <div className="col ">
                <img src="" alt="Sesion" />
              </div>
              <div className="col">
              <span id="Username" >Nombre de ususario</span>
            </div>
            </div>
            

        </div>
      </div>

    </div>
        
  </nav>
  );
} 
export default Navegador
