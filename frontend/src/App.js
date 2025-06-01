
import Home from './pages/Home'
import Admin from './pages/Admin'
import Empleados from './pages/modulos/administracion/Empleados';
import { BrowserRouter, Routes, Route } from "react-router-dom";


//Archivo Raiz, colocar las paginas aqui con su ruta
function App() {
  return (
    /*Agregamos todas las paginas con sus rutas */
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Administración" element={<Admin />} />
        {/*Empieza sistema Administración*/}
        <Route path="/Administracion/Empleados" element={<Empleados/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
