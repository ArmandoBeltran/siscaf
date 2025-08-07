import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { faBoxOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SalesComparative({ start_year, end_year }) {
    // URL http://localhost:5000/api/sale_details/get/year_comparative?start_year=2020&end_year=2024
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSlow, setIsSlow] = useState(false);



    useEffect(() => {
        if (!start_year || !end_year) {
            console.error("Año de inicio y fin no proporcionadas");
            setError("Año de inicio y fin no proporcionadas");
            setLoading(false);
            return;
        }
        if (start_year && end_year && start_year < end_year) {

            setLoading(true);
            setIsSlow(false);
            setError(null);
            setData([]);
            const slowTimeout = setTimeout(() => setIsSlow(true), 5000);

            fetch(`http://localhost:5000/api/sale_details/get/year_comparative?start_year=${start_year}&end_year=${end_year}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error ${res.status}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(result => {
                    if (result.success) {
                        setData(result.data);

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
            console.error("La Año de inicio debe ser anterior a la Año de fin");
            setError("La Año de inicio debe ser anterior a la Año de fin");
            setLoading(false);

        }
    }, [start_year, end_year]);

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
  data.reduce((acc, { month, sale, year }) => {
    const key = String(month);
    if (!acc[key]) acc[key] = { month: key };

    acc[key][year] = Number(sale) || 0;
    return acc;
  }, {})
);

console.log(formattedData);

const years = Object.keys(formattedData[0]).filter(k => k !== "month");
const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

return (
  <div className="d-flex justify-content-center mb-0">
    <div style={{ width: '100%', maxWidth: '1000px', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {years.map((year, i) => (
            <Bar key={year} dataKey={year} fill={colors[i % colors.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
    );
}
export default SalesComparative;