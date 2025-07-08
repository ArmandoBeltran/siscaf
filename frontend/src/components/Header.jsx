import {Link} from 'react-router-dom'
import {props} from 'react'
import logo from '../logo.svg';


function Header(props) {
    return(
        <header className="p-3 bg-dark text-white">
            <div className="container-fluid">
                <div className=" align-items-center justify-content-center m-0 p-0">
                    <a href="/" className="  text-white text-decoration-none">
                    <img src={logo} alt="React logo" width={50} height={50} />
                    ANDRES
                    </a>
                </div>
            </div>
        </header>
    );
}
export default Header;