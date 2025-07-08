import '../src/assets/css/base.css'


import Home from './pages/Home'
import BranchInventory from './pages/modulos/inventories/BranchInventory';

import { BrowserRouter, Routes, Route } from "react-router-dom";


//Archivo Raiz, colocar las paginas aqui con su ruta
function App() {
  return (
    /*Agregamos todas las paginas con sus rutas */
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/InventariosSucursal" element={<BranchInventory />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
