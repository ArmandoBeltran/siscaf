import ExpandableItem from "../../../../components/reports/ExpandableItem";
import SaleDetails from "./SaleDetails";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function ExpandableSale({ date }) {
    const [sales, setSales] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchLevelTwoData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/sales/get/report_by_date_level_two?date=${new Date(date).toISOString().split("T")[0]}`);
                const result = await res.json();
                if (result.success) {
                    setSales(result.data);
                } else {
                    setSales([]);
                }
            } catch {
                setSales([]);
            } finally {
                setLoaded(true);
            }
        };

        if (!loaded) {
            fetchLevelTwoData();
        }
    }, [date, loaded]);

    return (
        <>
            {sales.length > 0 ? (
                sales.map((sale, idx) => (
                    <ExpandableItem
                        key={idx}
                        title={`Vendedor: ${sale.vendedor}`}
                        line_content={
                            <>
                                <h4>Sucursal: {sale.sucursal}</h4>
                                <h4>Total de Ventas: {sale.total_ventas}</h4>
                                <h4>Total de Pares Vendidos: {sale.total_pares_vendidos}</h4>
                                <h4>Total de Ingresos: {sale.total_ingresos}</h4>
                            </>
                        }
                    >
                        <SaleDetails saleId={sale.id_venta}/>
                    </ExpandableItem>
                ))
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        color: "#666",
                    }}
                >
                    <FontAwesomeIcon icon={faCircleExclamation} size="4x" />
                    <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
                        No se encontraron ventas en esta fecha
                    </p>
                </div>
            )}
        </>
    );
}

export default ExpandableSale;
