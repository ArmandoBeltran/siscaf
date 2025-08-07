import NavBar from "../../../components/NavBar";
import ToolBar from "../../../components/ToolBar";
import { useState } from "react";
import SalesByGender from "./graphs/SalesByGender";
import SalesByCategory from "./graphs/SalesByCategory";
import SalesByProduct from "./graphs/SalesByProduct";
import SalesBySucursal from "./graphs/SalesBySucursal";
import SalesTopProducts from "./graphs/SalesTopProducts";
import SellerPerformance from "./graphs/SalesSellerPerformance";
import SalesComparative from "./graphs/SalesComparative";
import SalesBySeasons from "./graphs/SalesByseasons";

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
    startDateT10P: "",
    endDateT10P: "",
    performanceYear: "",
    start_year: "",
    end_year: "",
    startDateSV: "",
    endDateSV: ""
  });
  const [producto, setProducto] = useState("");

  const modules = [
    {
        text: "Ventas", 
        submenus: [
            {url: "/Ventas", text: "Ventas"},
            { url: "/GraficasVentas", text: "Reporte de Ventas",}
        ]
    }
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
            <ul class="nav nav-tabs" id="myTab" role="tablist" >
              <li class="nav-item" role="tactico" >
                <button class="nav-link active" id="categoria-tab" data-bs-toggle="tab" data-bs-target="#categoria" type="button" role="tab" aria-controls="categoria" aria-selected="true">Ventas por Categoría</button>
              </li>
              <li class="nav-item" role="tactico">
                <button class="nav-link" id="genero-tab" data-bs-toggle="tab" data-bs-target="#genero" type="button" role="tab" aria-controls="genero" aria-selected="false">Ventas por Genero</button>
              </li>
              <li class="nav-item" role="tactico">
                <button class="nav-link" id="producto-tab" data-bs-toggle="tab" data-bs-target="#producto" type="button" role="tab" aria-controls="producto" aria-selected="false">Ventas por Producto</button>
              </li>
              <li class="nav-item" role="tactico">
                <button class="nav-link" id="sucursal-tab" data-bs-toggle="tab" data-bs-target="#sucursal" type="button" role="tab" aria-controls="sucursal" aria-selected="false">Ventas por Sucursal</button>
              </li>
              <li class="nav-item" role="estrategico">
                <button class="nav-link" id="T10P-tab" data-bs-toggle="tab" data-bs-target="#T10P" type="button" role="tab" aria-controls="T10P" aria-selected="false">Top 10 productos</button>
              </li>

              <li class="nav-item" role="estrategico">
                <button class="nav-link" id="comparativa-tab" data-bs-toggle="tab" data-bs-target="#comparativa" type="button" role="tab" aria-controls="comparativa" aria-selected="false"> Comparativa de Ventas</button>
              </li>
              <li class="nav-item" role="estrategico">
                <button class="nav-link" id="productividad-tab" data-bs-toggle="tab" data-bs-target="#productividad" type="button" role="tab" aria-controls="productividad" aria-selected="false">Reporte de productividad</button>
              </li>
              <li class="nav-item" role="estrategico">
                <button class="nav-link" id="temporada-tab" data-bs-toggle="tab" data-bs-target="#temporada" type="button" role="tab" aria-controls="temporada" aria-selected="false">Ventas por temporada</button>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="categoria" role="tabpanel" aria-labelledby="categoria-tab">
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
              <div class="tab-pane fade" id="genero" role="tabpanel" aria-labelledby="genero-tab">
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
              <div class="tab-pane fade" id="producto" role="tabpanel" aria-labelledby="producto-tab">
                <h1>Ventas de Producto</h1>
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
                    <div style={{ width: "100%", maxWidth: 4000, height: "100%", maxHeight: 1000 }}>
                      <SalesByProduct
                        start_date={dates.startDateProducts}
                        end_date={dates.endDateProducts}
                        id_producto={producto}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div class="tab-pane fade" id="sucursal" role="tabpanel" aria-labelledby="sucursal-tab">
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
                {dates.startDateOther && dates.endDateOther && (
                  <div className="d-flex justify-content-center mt-2">
                    <div style={{ width: "100%", maxWidth: 1200, height: "100%", maxHeight: 1200 }}>
                      <SalesBySucursal
                        start_date={dates.startDateOther}
                        end_date={dates.endDateOther}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div class="tab-pane fade" id="T10P" role="tabpanel" aria-labelledby="T10P-tab">
                <h1>Top 10 Productos más vendidos</h1>
                <label htmlFor="startDateT10P">Fecha Inicio:</label>
                <input
                  type="date"
                  name="startDateT10P"
                  className="dateInput ms-2"
                  value={dates.startDateT10P}
                  onChange={handleDateChange}
                />
                <label htmlFor="endDateT10P" className="ms-2">
                  Fecha Fin:
                </label>
                <input
                  type="date"
                  name="endDateT10P"
                  className="ms-2 dateInput"
                  value={dates.endDateT10P}
                  onChange={handleDateChange}
                />
                {dates.startDateT10P && dates.endDateT10P && (
                  <div className="d-flex justify-content-center mt-2">
                    <div style={{ width: "100%", maxWidth: 1200, height: "100%", maxHeight: 1200 }}>
                      <SalesTopProducts
                        start_date={dates.startDateT10P}
                        end_date={dates.endDateT10P}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div class="tab-pane fade" id="comparativa" role="tabpanel" aria-labelledby="T10P-tab">
                <h1>Comparativas de ventas</h1>
                <label htmlFor="start_year">Fecha Inicio:</label>
                <input
                  type="number"
                  name="start_year"
                  className="dateInput ms-2"
                  min="2000"
                  max="2099"
                  step="1"
                  value={dates.start_year || 2025}
                  onChange={handleDateChange}
                />
                <label htmlFor="end_year">Fecha Inicio:</label>
                <input
                  type="number"
                  name="end_year"
                  className="dateInput ms-2"
                  min="2000"
                  max="2099"
                  step="1"
                  value={dates.end_year || 2025}
                  onChange={handleDateChange}
                />
                {dates.start_year && dates.end_year && (
                  <div className="d-flex justify-content-center mt-2">
                    <div style={{ width: "100%", maxWidth: 1200, height: "100%", maxHeight: 1200 }}>
                      <SalesComparative
                        start_year={dates.start_year}
                        end_year={dates.end_year}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div class="tab-pane fade" id="productividad" role="tabpanel" aria-labelledby="T10P-tab">
                <h1>Top 10 Productos más vendidos</h1>
                <label htmlFor="performanceYear">Fecha Inicio:</label>
                <input
                  type="number"
                  name="performanceYear"
                  className="dateInput ms-2"
                  min="2000"
                  max="2099"
                  step="1"
                  value={dates.performanceYear || 2025}
                  onChange={handleDateChange}
                />
                {dates.performanceYear && (
                  <div className="d-flex justify-content-center mt-2">
                    <div style={{ width: "100%", maxWidth: 1200, height: "100%", maxHeight: 1200 }}>
                      <SellerPerformance
                        performanceYear={dates.performanceYear}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div class="tab-pane fade" id="temporada" role="tabpanel" aria-labelledby="T10P-tab">
                <h1>Ventas por temporada</h1>
                <label htmlFor="startDateSV">Fecha Inicio:</label>
                <input
                  type="date"
                  name="startDateSV"
                  className="dateInput ms-2"
                  value={dates.startDateSV}
                  onChange={handleDateChange}
                />
                <label htmlFor="endDateSV" className="ms-2">
                  Fecha Fin:
                </label>
                <input
                  type="date"
                  name="endDateSV"
                  className="ms-2 dateInput"
                  value={dates.endDateSV}
                  onChange={handleDateChange}
                />
                {dates.startDateSV && dates.endDateSV && (
                  <div className="d-flex justify-content-center mt-2">
                    <div style={{ width: "100%", maxWidth: 1200, height: "100%", maxHeight: 1200 }}>
                      <SalesBySeasons
                        start_date={dates.startDateSV}
                        end_date={dates.endDateSV}
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SalesGraphs;