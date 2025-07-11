import '../src/assets/css/base.css'


import Home from './pages/Home'

import GeneralInventory from './pages/modulos/inventories/GeneralInventory';
import BranchInventory from './pages/modulos/inventories/BranchInventory';
import CategoriesReport from './pages/modulos/inventories/CategoriesReport';

import DepartmentsReport from './pages/modulos/administration/reports/DepartmentsReport';

import SalesReport from './pages/modulos/sales/reports/SalesReport';

import { BrowserRouter, Routes, Route } from "react-router-dom";


//Archivo Raiz, colocar las paginas aqui con su ruta
function App() {
  return (
    /*Agregamos todas las paginas con sus rutas */
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Inventario" element={<GeneralInventory />}/>
        <Route path="/InventarioSucursal" element={<BranchInventory />} />
        <Route path="/ReporteProductosCategoria" element={<CategoriesReport />} />

        {/** Administración */}
        <Route path="/ReporteDepartamentosEmpleados" element={<DepartmentsReport />} />

        {/** Ventas */}
        <Route path="/ReporteVentas" element={<SalesReport />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
