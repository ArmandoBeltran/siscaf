import { useEffect, useState } from "react";
import ExpandableDepartment from "./ExpandableDepartment";
import AdminLayout from "../AdminLayout";

function DepartmentsReport() {
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/departments/get/report")
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setDepartments(result.data);
                } else {
                    setDepartments([]);
                }
            })
            .catch(() => setDepartments([]));
    }, []);

    function handleDepartmentChange(e) {
        setDepartment(e.target.value);
    }

    return (
        <AdminLayout
            toolbarTitle="Empleados por Departamento"
            toolbarActions={
                <input
                    type="text"
                    name="department-searchbar"
                    className="toolbar-actions-searchbar"
                    placeholder="Buscar departamento"
                    value={department}
                    onChange={handleDepartmentChange}
                />
            }
        >
            <ExpandableDepartment departments={departments} filterDepartment={department} />
        </AdminLayout>
    );
}

export default DepartmentsReport;
