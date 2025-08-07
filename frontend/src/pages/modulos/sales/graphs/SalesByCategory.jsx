import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { faBoxOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SalesByCategory({ start_date  , end_date }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSlow, setIsSlow] = useState(false);

    var start = new Date(start_date);
    var end= new Date(end_date);
    

    useEffect(() => {
        if (!start_date || !end_date ) {
            console.error("Fechas de inicio y fin no proporcionadas");
            setError("Fechas de inicio y fin no proporcionadas");
            setLoading(false);
            return;
        }
        if(start <= end) {
            
            setLoading(true);
            setIsSlow(false);
            setError(null);
            setData([]);
            const slowTimeout = setTimeout(() => setIsSlow(true), 5000);

            fetch(`http://localhost:5000/api/sale_details/get/saleByCategory/${start_date}/${end_date}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error ${res.status}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(result => {
                    if (result != null) {
                        const mappedData = result.map(item => ({
                            categoria: item.categoria,
                            ventas: item.ventas
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
    }else{
        console.error("La fecha de inicio debe ser anterior a la fecha de fin");
        setError("La fecha de inicio debe ser anterior a la fecha de fin");
        setLoading(false);

    }}, [start_date, end_date]);

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
   
    return (
      <div className="d-flex justify-content-center py-2">
        <div style={{ width: '100%', maxWidth: '700px', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={20}>
                <XAxis dataKey="categoria" scale="point" padding={{ left: 10, right: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="ventas" fill="#aa871d" background={{ fill: '#eee' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>
    );
} 
