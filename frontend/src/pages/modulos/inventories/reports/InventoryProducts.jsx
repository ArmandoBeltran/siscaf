import { useEffect, useState } from "react";
import { faBoxOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailItem from "../../../../components/reports/DetailItem";

function InventoryProducts({ filterProductName }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSlow, setIsSlow] = useState(false);

    const headers = ["Producto", "Existencia", "Fecha de Alta", "Fecha de Modificación", "Acciones"];

    useEffect(() => {
        const slowTimeout = setTimeout(() => setIsSlow(true), 5000);

        fetch(`http://localhost:5000/api/inventory/get`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(result => {
                if (result.success) {
                    const mappedData = result.data.map(item => ({
                        "Producto": item.nombre_producto,
                        "Existencia": item.existencia,
                        "Fecha de Alta": item.fecha_alta,
                        "Fecha de Modificación": item.fecha_mod || item.fecha_alta,
                        "Acciones": (
                            <button className="px-2 py-1 rounded">
                                Asignar
                            </button>
                        )
                    }));
                    setData(mappedData);
                } else {
                    console.error("Error en la respuesta del servidor:", result.message);
                    setError("No se encontraron datos");
                }
            })
            .catch(err => {
                console.error("Error al obtener datos:", err);
                setError("Error al obtener datos");
            })
            .finally(() => {
                clearTimeout(slowTimeout);
                setLoading(false);
            });

        return () => clearTimeout(slowTimeout);
    }, []);

    const filteredProducts = data
        .filter(product => product["Existencia"] > 0)
        .filter(product =>
            filterProductName
                ? product["Producto"].toLowerCase().includes(filterProductName.toLowerCase())
                : true
        );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-6 text-gray-500 text-center bg-white">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                <p className="mt-2 text-lg">
                    {isSlow ? "Esto está tardando más de lo normal..." : "Cargando productos..."}
                </p>
            </div>
        );
    }

    const noData = error || filteredProducts.length === 0;

    return (
        <div className="text-center">
            {noData ? (
                <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                    <FontAwesomeIcon icon={faBoxOpen} size="4x" />
                    <p className="mt-2 text-lg">
                        {error ? "No se pudo obtener el inventario" : "No hay productos que coincidan"}
                    </p>
                </div>
            ) : (
                <DetailItem headers={headers} data={filteredProducts} />
            )}
        </div>
    );
}

export default InventoryProducts;
