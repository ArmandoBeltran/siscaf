import React, { useState, useEffect } from "react";
import SaleDetail from "./BranchSalesDetails";


export default function SalesTable() {
  const [sales, setSales] = useState([]);
  const [expandedSale, setExpandedSale] = useState(null);
    const [error, setError] = useState(null);


  // Obtener todas las ventas al cargar
  useEffect(() => {
  fetch("http://localhost:5000/api/sales/get/generalSales")
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(result => {
      const response = Array.isArray(result) ? result[0] : result; // Tomar el primer elemento si es array

      if (response.success) {
        setSales(response.data);
      } else {
        console.error("Error en la respuesta del servidor:", response.message);
        setError(response.message || "No se encontraron datos");
      }
    })
    .catch(err => {
      console.error("Error al obtener datos:", err);
      setError(err.message);
    });
}, []);


  const toggleExpand = (saleId) => {
    setExpandedSale(expandedSale === saleId ? null : saleId);
  };

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>ID Venta</th>
          <th>Vendedor</th>
          <th>Sucursal</th>
          <th>Fecha</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale) => (
          <React.Fragment key={sale.id_venta}>
            <tr onClick={() => toggleExpand(sale.id_venta)} style={{ cursor: "pointer" }}>
              <td>{sale.id_venta}</td>
              <td>{sale.vendedor}</td>
              <td>{sale.sucursal}</td>
              <td>{sale.fecha_venta}</td>
              <td>{expandedSale === sale.id_venta ? "▲" : "▼"}</td>
            </tr>

            {expandedSale === sale.id_venta && (
              <tr>
                <td colSpan={5}>
                  <SaleDetail saleId={sale.id_venta} />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}