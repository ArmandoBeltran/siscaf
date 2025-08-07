import { useEffect, useState } from "react";
import { faBoxOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailItem from "../../../../components/reports/DetailItem";
import ModalAssignProduct from "../../../../components/ModalAssignProduct";

function InventoryProducts({ filterProductName }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSlow, setIsSlow] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductForAssign, setSelectedProductForAssign] = useState(null);

  const headers = ["Producto", "Existencia", "Fecha de Alta", "Fecha de Modificación", "Acciones"];

  const fetchData = () => {
    setLoading(true);
    const slowTimeout = setTimeout(() => setIsSlow(true), 5000);

    fetch(`http://localhost:5000/api/inventory/get`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((result) => {
        if (result.success) {
          const mappedData = result.data.map((item) => ({
            ...item,
            nombre_producto: item.nombre_producto || item.Producto,
            existencia: item.existencia || item.Existencia,
            fecha_alta: item.fecha_alta,
            fecha_mod: item.fecha_mod || item.fecha_alta,
          }));
          setData(mappedData);
          setError(null);
        } else {
          setError("No se encontraron datos");
        }
      })
      .catch(() => setError("Error al obtener datos"))
      .finally(() => {
        clearTimeout(slowTimeout);
        setLoading(false);
        setIsSlow(false);
      });

    return () => clearTimeout(slowTimeout);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = data
    .filter((product) => product.existencia > 0)
    .filter((product) =>
      filterProductName
        ? product.nombre_producto.toLowerCase().includes(filterProductName.toLowerCase())
        : true
    );

  const openModalForProduct = (product) => {
    setSelectedProductForAssign(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProductForAssign(null);
    setModalVisible(false);
  };

  const handleGuardarAsignacion = ({ id_producto, id_sucursal, cantidad }) => {
    fetch("http://localhost:5000/api/branch_inventory/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_producto,
        id_sucursal,
        existencia: cantidad
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert("Asignación exitosa");
          closeModal();
          fetchData();
        } else {
          alert("Error al asignar: " + (res.message || "Error desconocido"));
        }
      })
      .catch((err) => {
        alert("Error en la asignación: " + err.message);
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-gray-500 text-center bg-white">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p className="mt-2 text-lg">{isSlow ? "Esto está tardando más de lo normal..." : "Cargando productos..."}</p>
      </div>
    );
  }

  const noData = error || filteredProducts.length === 0;

  return (
    <div className="text-center">
      {noData ? (
        <div className="flex flex-col items-center justify-center text-gray-500 py-6">
          <FontAwesomeIcon icon={faBoxOpen} size="4x" />
          <p className="mt-2 text-lg">{error ? "No se pudo obtener el inventario" : "No hay productos que coincidan"}</p>
        </div>
      ) : (
        <>
          <DetailItem
            headers={headers}
            data={filteredProducts.map((item) => ({
              Producto: item.nombre_producto,
              Existencia: item.existencia,
              "Fecha de Alta": item.fecha_alta,
              "Fecha de Modificación": item.fecha_mod,
              Acciones: (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => openModalForProduct(item)}
                  disabled={item.existencia <= 0}
                >
                  Asignar
                </button>
              ),
            }))}
          />

          {selectedProductForAssign && (
            <ModalAssignProduct
              show={modalVisible}
              onClose={closeModal}
              producto={selectedProductForAssign}
              onGuardar={handleGuardarAsignacion}
            />
          )}
        </>
      )}
    </div>
  );
}

export default InventoryProducts;