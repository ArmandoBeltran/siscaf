import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { faBoxOpen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RADIAN = Math.PI / 180;
const COLORS = ['#3a76ff', '#ff3a73'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SalesByGender({ start_date  , end_date }) {
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

            fetch(`http://localhost:5000/api/sale_details/get/saleByGender/${start_date}/${end_date}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error ${res.status}: ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(result => {
                  var res = result[0].success;
                  if (res) {
                        const data = result[0].data;
                        const mappedData = data.map(item => ({
                            genero: item.genero,
                            ventas: item.ventas
                        }));
                        setData(mappedData);
                    } else {
                        console.error("Error en la respuesta del servidor:", result[0].message);
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

  <div style={{ width: '100%', maxWidth: '200px', height: '200px' }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="ventas"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.genero}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <div>
      {data.map((entry, index) => (
        <div
          key={`legend-${entry.genero}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '4px'
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: COLORS[index % COLORS.length],
              marginRight: '8px'
            }}
          ></div>
          <span>{entry.genero}</span>
        </div>
      ))}
    </div>
  </div>
</div>


    );
} 
