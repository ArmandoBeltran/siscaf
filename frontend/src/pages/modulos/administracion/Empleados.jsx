
import '../../../assets/css/home.css';
import Navegador from '../../../components/navegador'; 
function Empleados() {
    return(
        <section>
          {/*Aqui se pueden poner como propiedades los modululos*/}
          <Navegador
            ubicacion={"Administracion"}
            page ={"Empleados"}
            mod1 ={"Empleados"}
            mod2={"Departamentos"}
            mod3={"Ejemplo"}
          />
        </section>
    );

}
export default Empleados;