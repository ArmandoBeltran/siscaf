import ExpandableItem from "../../../../components/reports/ExpandableItem";
import ExpandableSale from "./ExpandableSale";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function ExpandableDateData({ dateData }) {
    return (
        <>
            {dateData.length > 0 ? (
                dateData.map((day, idx) => {
                    const formattedDate = new Date(day.fecha).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });

                    return (
                        <ExpandableItem
                            key={idx}
                            title={`Ventas del ${formattedDate}`}
                            line_content={
                                <>
                                    <h4>Total de Ventas: {day.total_ventas}</h4>
                                    <h4>Total de Pares Vendidos: {day.total_pares_vendidos}</h4>
                                    <h4>Total de Ingresos: {day.total_ingresos}</h4>
                                </>
                            }
                        >   
                            <ExpandableSale date={day.fecha} />
                        </ExpandableItem>
                    );
                })
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
                        No se encontraron ventas en este rango de fechas
                    </p>
                </div>
            )}
        </>
    );
}

export default ExpandableDateData;
