import NavBar from "../../../components/NavBar";
import ToolBar from "../../../components/ToolBar";
import { useState } from "react";
import SalesByGender from "./reports/SalesByGender";
import SalesByCategory from "./reports/SalesByCategory";
import SalesByProduct from "./reports/SalesByProduct";
import SalesBySucursal from "./reports/SalesBySucursal";

function SalesGraphs() {
  const [dates, setDates] = useState({
    startDateGender: "",
    endDateGender: "",
    startDateCategory: "",
    endDateCategory: "",
    startDateProducts: "",
    endDateProducts: "",
    startDateOther: "",
    endDateOther: "",
  });
  const [producto, setProducto] = useState("");

  const modules = [
    {
      text: "Reportes",
      submenus: [
        { url: "/Inventarios", text: "Inventario sin Asignar" },
        { url: "/InventariosSucursal", text: "Inventario por Sucursal" },
      ],
    },
    {
      text: "Graficas de Ventas",
      submenus: [
        { url: "/ventasPorGenero", text: "Ventas por genero" },
        { url: "/graficas", text: "Categorías" },
      ],
    },
  ];

  function handleDateChange(e) {
    const { name, value } = e.target;
    setDates((prev) => ({ ...prev, [name]: value }));
  }
  function handleInputChange(e) {
    setProducto(e.target.value);
  }

  return (
    <div>
      <NavBar modules={modules} />
      <div>
        <ToolBar toolbar_title="Gráficas de ventas" />
        <div className="container-fluid text-center">
          <div className="row mb-4">
            <div className="col-sm-12 col-md-12">
              <h1>Ventas por Categoría</h1>
              <label htmlFor="startDateCategory">Fecha Inicio:</label>
              <input
                type="date"
                name="startDateCategory"
                className="dateInput ms-2"
                value={dates.startDateCategory}
                onChange={handleDateChange}
              />
              <label htmlFor="endDateCategory" className="ms-2">
                Fecha Fin:
              </label>
              <input
                type="date"
                name="endDateCategory"
                className="ms-2 dateInput"
                value={dates.endDateCategory}
                onChange={handleDateChange}
              />
            </div>

            {dates.startDateCategory && dates.endDateCategory && (
              <div className="d-flex justify-content-center mt-4">
                <div style={{ width: "100%", maxWidth: 1000, height: "100%", maxHeight: 200 }}>
                  <SalesByCategory
                    start_date={dates.startDateCategory}
                    end_date={dates.endDateCategory}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="row mb-4">
            <div className="col-sm-12 col-lg-12">
              <h1>Gráficas de Ventas por género</h1>
              <div className="d-flex align-items-center justify-content-center flex-wrap mb-3">
                <label htmlFor="startDateGender">Fecha Inicio:</label>
                <input
                  type="date"
                  name="startDateGender"
                  className="dateInput mx-2"
                  value={dates.startDateGender}
                  onChange={handleDateChange}
                />
                <label htmlFor="endDateGender">Fecha Fin:</label>
                <input
                  type="date"
                  name="endDateGender"
                  className="dateInput mx-2"
                  value={dates.endDateGender}
                  onChange={handleDateChange}
                />
              </div>

              {dates.startDateGender && dates.endDateGender && (
                <div className="d-flex justify-content-center">
                  <div style={{ width: "100%", maxWidth: 250, height: 250 }}>
                    <SalesByGender
                      start_date={dates.startDateGender}
                      end_date={dates.endDateGender}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        <div className="row mb-4">
          <div className="col-sm-12 col-lg-12">
            <h1>Ventas de Productos</h1>
            <label htmlFor="startDateProducts">Fecha Inicio:</label>
            <input
              type="date"
              name="startDateProducts"
              className="dateInput ms-2"
              value={dates.startDateProducts}
              onChange={handleDateChange}
            />
            <label htmlFor="endDateProducts" className="ms-2">
              Fecha Fin:
            </label>
            <input
              type="date"
              name="endDateProducts"
              className="ms-2 dateInput"
              value={dates.endDateProducts}
              onChange={handleDateChange}
            />
            <label htmlFor="endDateProducts" className="ms-2">
              Producto:{/*Temporal, Cambiar por un Select*/}
            </label>
            <input
              type="number"
              name="Products"
              className="ms-2"
              value={producto}
              onChange={handleInputChange}
            />
            {dates.startDateProducts && dates.endDateProducts && producto && (
            <div className="d-flex justify-content-center">
              <div style={{ width: "100%", maxWidth: 1000, height: "100%", maxHeight:200 }}>
                <SalesByProduct
                  start_date={dates.startDateProducts}
                  end_date={dates.endDateProducts}
                  id_producto={producto}
                />
              </div>
            </div>
          )}
          </div>

          
        </div>
        <div className="row mb-4">
          <div className="col-sm-12 col-lg-12">
            <h1>Ventas por Sucursales</h1>
            <label htmlFor="startDateOther">Fecha Inicio:</label>
            <input
              type="date"
              name="startDateOther"
              className="dateInput ms-2"
              value={dates.startDateOther}
              onChange={handleDateChange}
            />
            <label htmlFor="endDateOther" className="ms-2">
              Fecha Fin:
            </label>
            <input
              type="date"
              name="endDateOther"
              className="ms-2 dateInput"
              value={dates.endDateOther}
              onChange={handleDateChange}
            />
            {dates.startDateOther && dates.endDateOther  && (
            <div className="d-flex justify-content-center mt-2">
              <div style={{ width: "100%", maxWidth: 1200, height: "100%", maxHeight:1200 }}>
                <SalesBySucursal
                  start_date={dates.startDateOther}
                  end_date={dates.endDateOther}
                />
              </div>
            </div>
             )}
          </div>
        </div>
      </div>
    </div>
    </div >
  );
}

export default SalesGraphs;
