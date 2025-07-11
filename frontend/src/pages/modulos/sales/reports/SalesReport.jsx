import { useEffect, useState } from "react";
import SalesLayout from "../SalesLayout";
import ExpandableDateData from "./ExpandableDateData";

function SalesReport() {
    const rawToday = new Date();
    const rawOneWeekAgo = new Date();
    rawOneWeekAgo.setDate(rawToday.getDate() - 7);

    const today = rawToday.toISOString().split("T")[0];
    const defaultStart = rawOneWeekAgo.toISOString().split("T")[0];

    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(today);
    const [dateData, setDateData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSalesData(defaultStart, today);
    }, []);

    function fetchSalesData(start = "", end = "") {
        let url = "http://localhost:5000/api/sales/get/report_by_date";
        if (start && end) {
            url += `?startDate=${start}&endDate=${end}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setDateData(result.data);
                } else {
                    setDateData([]);
                }
            })
            .catch(() => setDateData([]));
    }

    function handleStartDateChange(e) {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        if (endDate && newStartDate > endDate) {
            setError("La fecha de inicio debe ser anterior a la fecha de fin.");
        } else {
            setError("");
            if (endDate) {
                fetchSalesData(newStartDate, endDate);
            }
        }
    }

    function handleEndDateChange(e) {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);

        if (startDate && newEndDate <= startDate) {
            setError("La fecha de fin debe ser posterior a la fecha de inicio.");
        } else {
            setError("");
            if (startDate) {
                fetchSalesData(startDate, newEndDate);
            }
        }
    }

    return (
        <SalesLayout
            toolbarTitle="Reporte de Ventas"
            toolbarActions={
                <div className="flex items-center gap-4">
                    <label className="font-medium">Desde </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        max={today}
                        className="bg-[#2c2c2c] border border-yellow-600 rounded px-2 py-1"
                    />
                    <label className="font-medium">Hasta </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        min={startDate || undefined}
                        max={today}
                        className="bg-[#2c2c2c] border border-yellow-600 rounded px-2 py-1"
                    />
                    {error && (
                        <span className="text-red-400 text-sm ml-4">{error}</span>
                    )}
                </div>
            }
        >
            <ExpandableDateData dateData={dateData} />
        </SalesLayout>
    );
}

export default SalesReport;
