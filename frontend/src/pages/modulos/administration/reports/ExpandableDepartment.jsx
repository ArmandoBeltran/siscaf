import ExpandableItem from "../../../../components/reports/ExpandableItem";
import DepartmentEmployees from "./DepartmentEmployees";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function ExpandableDepartment({ departments, filterDepartment }) {

    const filteredDepartments = filterDepartment
        ? departments.filter(department => department.nombre.toLowerCase().includes(filterDepartment.toLowerCase()))
        : departments;

    return (
        <>
            {filteredDepartments.length > 0 ? (
                filteredDepartments.map(department => (
                    <ExpandableItem
                        key={department.id_departamento}
                        title={department.nombre}
                        line_content={
                        <>
                            <h4>Total empleados: {department.numero_empleados}</h4>
                        </>
                        }
                    >
                        <DepartmentEmployees departmentId={department.id_departamento} />
                    </ExpandableItem>
                ))
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    color: '#666'
                }}>
                    <FontAwesomeIcon icon={faCircleExclamation} size="4x" />
                    <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>No se encontraron datos a mostrar</p>
                </div>
            )}
        </>
    );
}

export default ExpandableDepartment;
