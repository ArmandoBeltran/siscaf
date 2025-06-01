import {Link} from 'react-router-dom'
import {props} from 'react'

function Navegador(props) {
  return(
    <header>

      <nav className="navbar navbar-light bg-light">
        <div className="navbar-brand border">
            <a href="/" >
              <img src="../logo_andres.png" width="250" height="90" />
            </a>
        </div>
        <div className="text-left">
          <span className="text-right">{props.ubicacion}</span>
        </div>
      </nav>
    </header>
  );
} 
export default Navegador
