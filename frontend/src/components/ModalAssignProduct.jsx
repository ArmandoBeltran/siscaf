import { useState, useEffect } from "react";

function ModalAssignProduct({ show, onClose, producto, onGuardar }) {
  const [sucursales, setSucursales] = useState([]);
  const [idSucursal, setIdSucursal] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [error, setError] = useState("");

  const maxCantidad = producto?.existencia || Infinity;

  useEffect(() => {
    if (show) {
      fetch("http://localhost:5000/api/branches/get") // Cambia la URL si es necesario
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setSucursales(data.data);
          else setSucursales([]);
        })
        .catch(() => setSucursales([]));
    }
  }, [show]);

  const handleGuardar = () => {
    setError("");
    if (!idSucursal) {
      setError("Selecciona una sucursal");
      return;
    }
    const cantidadNum = Number(cantidad);
    if (!cantidad || isNaN(cantidadNum) || cantidadNum <= 0) {
      setError("Cantidad debe ser un número positivo");
      return;
    }
    if (cantidadNum > maxCantidad) {
      setError(`Cantidad no puede ser mayor que la existencia (${maxCantidad})`);
      return;
    }
    onGuardar({ id_producto: producto.id_producto, id_sucursal: idSucursal, cantidad: cantidadNum });
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" aria-modal="true" role="dialog">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Asignar producto: {producto.nombre_producto}</h5>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label htmlFor="selectSucursal" className="form-label">
                Sucursal
              </label>
              <select
                id="selectSucursal"
                className="form-select"
                value={idSucursal}
                onChange={(e) => setIdSucursal(e.target.value)}
              >
                <option value="">-- Selecciona una sucursal --</option>
                {sucursales.map((s) => (
                  <option key={s.id_sucursal} value={s.id_sucursal}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="inputCantidad" className="form-label">
                Cantidad (máximo {maxCantidad})
              </label>
              <input
                type="number"
                id="inputCantidad"
                className="form-control"
                min="1"
                max={maxCantidad}
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleGuardar}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAssignProduct;