import { useEffect, useState } from "react";
import { faBoxOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




function SellerPerformance({ performanceYear }) {
    //URL http://localhost:5000/api/sale_details/get/seller_performance?year=2024
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSlow, setIsSlow] = useState(false);

    useEffect(() => {
        if (!performanceYear) {
            console.error("Año no proporcionadas");
            setError("Año no proporcionadas");
            setLoading(false);
            return;
        }
        if (performanceYear) {

            setLoading(true);
            setIsSlow(false);
            setError(null);
            setData([]);
            const slowTimeout = setTimeout(() => setIsSlow(true), 5000);

            fetch(`http://localhost:5000/api/sale_details/get/seller_performance?year=${performanceYear}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error ${res.status}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(result => {
                    if (result.success) {
                        const mappedData = result.data.map(item => ({
                            vendedor: item.vendedor,
                            ganancias: item.ganancias,
                            mes: item.mes
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
    }, [performanceYear,]);

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
    const formattedData = Object.values(
        data.reduce((acc, { vendedor, ganancias, mes }) => {
            if (!acc[mes]) acc[mes] = { mes };
            acc[mes][vendedor] = parseFloat(ganancias);
            return acc;
        }, {})
    );


    const vendedores = Object.keys(formattedData[0]).filter(key => key !== "mes");

    const colors = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE",
        "#00C49F", "#FFBB28", "#FF8042", "#a83279", "#32a852"
    ];

    return (
        <div style={{ width: '100%', maxWidth: '1000px', height: '500px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={formattedData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {vendedores.map((vendedor, i) => (
                        <Line
                            key={vendedor}
                            type="monotone"
                            dataKey={vendedor}
                            stroke={colors[i % colors.length]}
                            strokeWidth={2}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
export default SellerPerformance