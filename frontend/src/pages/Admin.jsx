
import '../assets/css/home.css';
import Navegador from '../components/navegador'; 

function Admin() {
  return (
    <section>
          {/*Aqui se pueden poner como propiedades los modululos*/}
          <Navegador
            ubicacion={"Administracion"}
            page={"Inicio"}
            mod1 ={"Empleados"}
            mod2={"Departamentos"}
            mod3={"Ejemplo"}
            mod4={"tpm"}

          />
    </section>

  );
}

export default Admin