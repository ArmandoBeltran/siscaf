import '../src/assets/css/base.css'


import Home from './pages/home'

import GeneralInventory from './pages/modulos/inventories/GeneralInventory';
import BranchInventory from './pages/modulos/inventories/BranchInventory';
import GeneralSales from './pages/modulos/sales/GeneralSales';
import ProtectedRoute from './components/protectedRoute';
import { UserProvider } from './components/userContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SalesByGender from './pages/modulos/sales/reports/SalesByGender';
import SalesGrahps from './pages/modulos/sales/SalesGrahps';
import LoginPage from './pages/login,';
import Pagina404 from './pages/page404';


//Archivo Raiz, colocar las paginas aqui con su ruta
function App() {
  return (
    /*Agregamos todas las paginas con sus rutas */
    <UserProvider>{/*Estos componentes estan en desarrollo (Session)*/}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/Home" element={<Home />} />
            <Route path="/Inventarios" element={<GeneralInventory />} />
            <Route path="/InventariosSucursal" element={<BranchInventory />} />
            <Route path="/ventas" element={<GeneralSales />} />
            <Route path="/ventasPorGenero" element={<SalesByGender />} />
            <Route path="/GraficasVentas" element={<SalesGrahps />} />
          </Route>
        <Route path="/404"element={<Pagina404/>} ></Route>
        </Routes>
      </BrowserRouter>

    </UserProvider>
  )
}

export default App

