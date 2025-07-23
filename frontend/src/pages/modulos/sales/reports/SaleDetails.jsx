import { useEffect, useState } from "react";
import { faBoxOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailItem from "../../../../components/reports/DetailItem";

function SaleDetails({ saleId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSlow, setIsSlow] = useState(false);

    const headers = ["Producto", "Cantidad", "Importe"];

    useEffect(() => {
        if (!saleId) return;

        const slowTimeout = setTimeout(() => setIsSlow(true), 5000);

        fetch(`http://localhost:5000/api/sale_details/get_by?field=id_venta&value=${saleId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(result => {
                if (result.success) {
                    const mappedData = result.data.map(item => ({
                        "Producto" : item.nombre_producto,
                        "Cantidad" : item.cantidad, 
                        "Importe"  : item.importe
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
    }, [saleId]);

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

    const noData = error || data.length === 0;

    return (
        <div className="text-center">
            {noData ? (
                <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                    <FontAwesomeIcon icon={faBoxOpen} size="4x" />
                    <p className="mt-2 text-lg">
                        {error ? "No se pudo obtener los productos de esta categoría" : "No hay productos en esta categoría"}
                    </p>
                </div>
            ) : (
                <DetailItem headers={headers} data={data} />
            )}
        </div>
    );
}

export default SaleDetails;
