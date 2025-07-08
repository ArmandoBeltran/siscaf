import { useEffect, useState } from "react";
import { faBoxOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailItem from "../../../../components/reports/DetailItem";

function BranchProducts({ branchId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSlow, setIsSlow] = useState(false);

    const headers = ["Producto", "Cantidad", "Última Fecha de Modificación"];

    useEffect(() => {
        if (!branchId) return;

        // Timeout para detectar carga lenta
        const slowTimeout = setTimeout(() => setIsSlow(true), 5000);

        fetch(`http://localhost:5000/api/branches/get/branch/${branchId}`)
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    const mappedData = result.data.map(item => ({
                        "Producto": item.nombre_producto,
                        "Cantidad": item.existencia,
                        "Última Fecha de Modificación": item.fecha_mod || item.fecha_alta
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
    }, [branchId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                <p className="mt-2 text-lg">
                    {isSlow ? "Esto está tardando más de lo normal..." : "Cargando productos..."}
                </p>
            </div>
        );
    }

    const noData = error || data.length === 0;

    return (
        <div>
            <h2 className="text-lg font-bold mb-2">Productos en la sucursal</h2>
            {noData ? (
                <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                    <FontAwesomeIcon icon={faBoxOpen} size="4x" />
                    <p className="mt-2 text-lg">
                        {error ? "No se pudo obtener el inventario" : "No hay inventario en esta sucursal"}
                    </p>
                </div>
            ) : (
                <DetailItem headers={headers} data={data} />
            )}
        </div>
    );
}

export default BranchProducts;
