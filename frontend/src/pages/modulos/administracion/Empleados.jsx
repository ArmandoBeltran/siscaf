import '../../../assets/css/home.css';
import { useEffect, useState } from 'react';
import Navegador from '../../../components/navegador'; 
import Tabla from '../../../components/tabla'; 

function Empleados() {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/usuarios')
      .then(res => {
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        return res.json();
      })
      .then(data => {
        setDatos(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section>
      <Navegador
        ubicacion={"Administracion"}
        page={"Empleados"}
        mod1={"Empleados"}
        mod2={"Departamentos"}
        mod3={"Ejemplo"}
      />
      <section>
        <Tabla datacatch={datos} />
      </section>
    </section>
  );
}

export default Empleados;
