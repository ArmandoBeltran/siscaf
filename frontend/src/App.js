import '../src/assets/css/base.css'


import Home from './pages/home'

import GeneralInventory from './pages/modulos/inventories/GeneralInventory';
import BranchInventory from './pages/modulos/inventories/BranchInventory';
import SalesLayout from './pages/modulos/sales/SalesLayout';
import ProtectedRoute from './components/protectedRoute';
import { UserProvider } from './components/userContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SalesByGender from './pages/modulos/sales/graphs/SalesByGender';
import SalesGrahps from './pages/modulos/sales/SalesGrahps';
import LoginPage from './pages/login';
import Pagina404 from './pages/page404';
import ProductList from './pages/modulos/inventories/ProductList';
import CategoryList from './pages/modulos/inventories/CategoryList';
import CategoriesReport from './pages/modulos/inventories/CategoriesReport';
import DepartmentList from './pages/modulos/administration/DepartmentList';
import DepartmentsReport from './pages/modulos/administration/reports/DepartmentsReport';
import EmployeeList from './pages/modulos/administration/EmployeeList';
import UserList from './pages/modulos/administration/UserList';
import Sales from './pages/modulos/sales/Sales';
//Archivo Raiz, colocar las paginas aqui con su ruta
function App() {
  return (
    /*Agregamos todas las paginas con sus rutas */
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/Home" element={<Home />} />
            <Route path="/Inventarios" element={<GeneralInventory />} />
            <Route path="/InventariosSucursal" element={<BranchInventory />} />
            <Route path="/ReporteCategorias" element={<CategoriesReport />} />
            <Route path="/Productos" element={<ProductList />}/>
            <Route path="/Categorias" element={<CategoryList />}/>
            <Route path="/ventas" element={<Sales />} />
            <Route path="/ventasPorGenero" element={<SalesByGender />} />
            <Route path="/GraficasVentas" element={<SalesGrahps />} />
            <Route path="/Departamentos" element={<DepartmentList />} />
            <Route path="/Empleados" element={<EmployeeList/>}/>
            <Route path="/Usuarios" element={<UserList/>}/>
            <Route path="/ReporteDepartamentosEmpleados" element={<DepartmentsReport />} />
          </Route>
        <Route path="/404"element={<Pagina404/>} ></Route>
        </Routes>
      </BrowserRouter>

    </UserProvider>
  )
}

export default App

