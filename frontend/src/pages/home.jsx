import '../assets/css/home.css'

import InventoryImg from '../assets/img/botones/InventoryImg.png'
import AdministrationImg from '../assets/img/botones/AdministrationImg.png'
import Zapato from '../assets/img/Zapato.png'

import HomeButton from '../components/buttons/HomeButton';

function Home() {
  
  return (
    
    <div className="home">
        <div className="home-main">
          <div className="home-main-logo">
            <img src={Zapato} alt="Icon" />
            <h1>GRUPO ANDRÉS</h1>
          </div>
          <div className="home-main-titles">
            <h1>Sistema Integral para el Control Administrativo y de Fabricación</h1>
          </div>
        </div>
        <div className="home-buttons">
          <HomeButton 
            route="/Inventario"
            img={InventoryImg}
            alt="Módulo de Inventarios"
            text="Inventarios"
            description="Gestión de productos, materiales y existencias."/>
          <HomeButton 
            route="#"
            img={AdministrationImg}
            alt="Módulo de Administración"
            text="Administración"
            description="Organización de áreas, empleados y procesos internos."/>
          <HomeButton 
            route="/Ventas"
            img={InventoryImg}
            alt="Módulo de Ventas"
            text="Ventas"
            description="Registro y seguimiento de ventas y clientes."/>
        </div>
    </div>

  );
}

export default Home