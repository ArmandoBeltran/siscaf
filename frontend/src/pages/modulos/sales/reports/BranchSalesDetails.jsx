import React, { useState, useEffect } from "react";


function SaleDetail({ saleId }) {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);    
  const [error, setError] = useState(null);

  useEffect(() => {
  setLoading(true);
  fetch(`http://localhost:5000/api/sale_details/getDetail?saleid=${saleId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(result => {
      const response = Array.isArray(result) ? result[0] : result;

      if (response.success) {
        setDetails(response.data);
      } else {
        console.error("Error en la respuesta del servidor:", response.message);
        setError(response.message || "No se encontraron datos");
      }
    })
    .catch(err => {
      console.error("Error al obtener datos:", err);
      setError(err.message);
    })
    .finally(() => {
      setLoading(false); // <- Esto garantiza que loading se desactive pase lo que pase
    });
}, [saleId]);

  if (loading) return <div>Cargando detalle...</div>;
  if (details.length === 0) return <div>No hay productos en esta venta.</div>;

  return (
    <table className="table table-sm table-bordered mb-0">
      <thead>
        <tr>
          <th>Detalle</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio unitario</th>
          <th>Importe</th>
        </tr>
      </thead>
      <tbody>
        {details.map((item) => (
          <tr key={item.id_detalle}>
            <td>{item.producto}</td>
            <td>{item.cantidad}</td>
            <td>${item.precio_unitario}</td>
            <td>${item.importe}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default SaleDetail;