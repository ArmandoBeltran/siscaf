import React, { useState, useEffect, use } from "react";
import DropSelect from "../../../../components/DropSelect";
import { deleteSaleDetail, updateSaleDetail } from "../../../../assets/js/salesfunctions";

function SaleDetail({ saleId }) {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [productos, setProduct] = useState([]);
  const [selectProduct, setSProduct] = useState(null);
  async function editDetail(id_detalle) {
    const detalle = details.find((d) => d.id_detalle === id_detalle);

    if (!detalle) return;

    updateSaleDetail(detalle)
      .then((res) => {
        alert("Detalle actualizado correctamente");
        // Opcional: recargar datos o actualizar UI
      })
      .catch((err) => {
        alert("Error al actualizar: " + err.message);
      });
  }

  async function delDetail(id_detalle) {
    const detalle ={"id_detalle": id_detalle};
    deleteSaleDetail(detalle)
    .then((res)=>{
      alert("Producto del detalle eliminado")
    }).catch((err) => {
        alert("Error al actualizar: " + err.message);
      });
  }

  function limpiarPrecio(precioStr) {
    if (!precioStr) return 0;
    const limpio = precioStr.replace(/[^0-9.]/g, '');
    return parseFloat(limpio) || 0;
  }
  function handleChangeProduct(e, detalleId) {
    const selectedProductId = e.target.value;

    const producto = productos.find(
      (p) => p.id_producto?.toString() === selectedProductId.toString()
    );

    if (!producto) return;

    setDetails((prev) =>
      prev.map((item) => {
        if (item.id_detalle !== detalleId) return item;

        const precio = limpiarPrecio(producto.precio);
        const cantidad = Number(item.cantidad) || 0;
        const importe = (precio * cantidad).toFixed(2);
        console.log("precio:" + precio + "catidad:" + cantidad + "importe:" + importe)

        return {
          ...item,
          id_producto: selectedProductId,
          precio_unitario: precio,
          importe: importe,
        };
      })
    );
  }
  function handleChangeCantidad(e, detalleId) {
    const nuevaCantidad = Number(e.target.value);

    setDetails((prev) =>
      prev.map((item) => {
        if (item.id_detalle !== detalleId) return item;

        const precio = Number(item.precio_unitario) || 0;
        const importe = precio * nuevaCantidad;

        return {
          ...item,
          cantidad: nuevaCantidad,
          importe: importe
        };
      })
    );
  }




  useEffect(() => {
    fetch(`http://localhost:5000/api/products/get`)
      .then(res => res.json())
      .then(json => setProduct(json.data || []))
      .catch(err => console.error("Error cargando productos", err));
  }, []);


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
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio unitario</th>

          <th>Importe</th>
          <th>Modificar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {details.map((item) => (

          <tr key={item.id_detalle}>
            <td>
              <DropSelect
                name="products"
                value={item.id_producto || selectProduct}
                data={productos}
                onChange={(e) => handleChangeProduct(e, item.id_detalle)} // ← Pasamos el ID del item
                idkey="id_producto"
              />
            </td>
            <td><input type="number" min="1" className="form-control" value={item.cantidad} onChange={(e) => handleChangeCantidad(e, item.id_detalle)} /></td>
            <td>
              <input
                type="text"
                className="form-control"
                value={item.precio_unitario ?? 0}
                readOnly
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                value={isNaN(item.importe) ? 0 : item.importe}
                readOnly
              />
            </td>
            <td>
              <button className="btn btn-warning" onClick={() => editDetail(item.id_detalle)}>Modificar</button>
            </td>
            <td>
              <button className="btn btn-danger" onClick={() => delDetail(item.id_detalle)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default SaleDetail;