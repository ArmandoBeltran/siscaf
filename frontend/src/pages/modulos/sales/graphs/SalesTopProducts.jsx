import { useEffect, useState } from "react";
import { faBoxOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Plot from 'react-plotly.js';


function SalesTopProducts({start_date,end_date}){
//URL http://localhost:5000/api/sale_details/get/get_top_products?start_date=2022-01-01&end_date=2024-01-01
const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSlow, setIsSlow] = useState(false);

    var start = new Date(start_date);
    var end = new Date(end_date);


    useEffect(() => {
        if (!start_date || !end_date) {
            console.error("Fechas de inicio y fin no proporcionadas");
            setError("Fechas de inicio y fin no proporcionadas");
            setLoading(false);
            return;
        }
        if (start_date && end_date && start <= end) {

            setLoading(true);
            setIsSlow(false);
            setError(null);
            setData([]);
            const slowTimeout = setTimeout(() => setIsSlow(true), 5000);

            fetch(`http://localhost:5000/api/sale_details/get/get_top_products?start_date=${start_date}&end_date=${end_date}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error ${res.status}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(result => {
                    if (result.success) {
                        const mappedData = result.data.map(item => ({
                            producto: item.producto,
                            ganancias: item.ganancias
                        }));
                        setData(mappedData);
                    } else {
                        console.error("Error en la respuesta del servidor:", result?.message);
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
        } else {
            console.error("La fecha de inicio debe ser anterior a la fecha de fin");
            setError("La fecha de inicio debe ser anterior a la fecha de fin");
            setLoading(false);

        }
    }, [start_date, end_date]);

    // Si no hay datos, mostramos un mensaje de error

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-6 text-gray-500 text-center bg-white">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                <p className="mt-2 text-lg">
                    {isSlow ? "Esto está tardando más de lo normal..." : "Buscando Ventas..."}
                </p>
            </div>
        );
    }


    if (error || data.length === 0) {
        return (
            <div className="text-center">

                <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                    <FontAwesomeIcon icon={faBoxOpen} size="4x" />
                    <p className="mt-2 text-lg">
                        {error ? "No se pudieron tener las ventas" : "No hay ventas registradas"}
                    </p>
                </div>

            </div>
        );
    }
return(
    <div>
     
            <Plot
                data={[
                    {
                        type: "bar",
                        x: data.map( item => ( item.ganancias )),          
                        y: data.map( item => ( item.producto )),       
                        orientation: "h",   
                        marker: { color: "rgba(52, 152, 219, 0.7)" },
                    }
                ]}
                layout={{
                    title: "Ventas por Producto",
                    xaxis: { title: "Ganancias" },
                    yaxis: { title: "Productos" },
                    margin: { l: 100, r: 20, t: 50, b: 50 }, // margen izquierdo grande para etiquetas
                }}
                config={{ responsive: true }}
            />
     
    </div>
);
}
export default SalesTopProducts;