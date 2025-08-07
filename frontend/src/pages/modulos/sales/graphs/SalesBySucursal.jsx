import { useEffect, useState } from "react";
import { faBoxOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Plot from 'react-plotly.js';

export default function SalesBySucursal({ start_date, end_date }) {
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

            fetch(`http://localhost:5000/api/sale_details/get/saleBySucursal/${start_date}/${end_date}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error ${res.status}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(result => {
                    if (result != null) {
                        const mappedData = result.map(item => ({
                            cantidad: item.ventas,
                            mes: item.mes,
                            nombre: item.sucursal
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
    //console.log("Data:", data);

    const sucursales = [...new Set(data.map(d => d.nombre))].sort();

    // Obtener meses únicos y ordenados numéricamente
    const meses = [...new Set(data.map(d => d.mes))].sort((a, b) => a - b);
    //console.log("Meses:", meses);

    // Preparar matriz Z para el heatmap
    const z = sucursales.map(sucursal => {
        return meses.map(mes => {
            const item = data.find(d => d.nombre === sucursal && d.mes === mes);
            return item ? item.cantidad : 0;
        });
    });
    //console.log("Z:", z);

    const heatmap = {
        x: meses,
        y: sucursales,
        z: z,
        type: 'heatmap',
        colorscale: 'Viridis',
        hoverongaps: true
    };

    return (
        <Plot
            data={[heatmap]}
            layout={{
                width: 800,
                height: 600,
                title: { text: 'Ventas por Sucursal', font: { size: 24 } },
                xaxis: {
                    title: 'Mes',
                    tickvals: meses,
                    ticktext: meses.map(m => `Mes ${m}`)
                },
                yaxis: { title: 'Sucursal' },
                margin: { t: 40, b: 60, l: 80, r: 40 }
            }}
            config={{ responsive: false }}
        />
    );
}