import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUserTie } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/category-card.css"; // Usa los mismos estilos que departamentos

function EmployeeCard({ employee, departmentName, onEdit, onDelete }) {
    return (
        <div className="card-horizontal">
            <div className="card-icon">
                <FontAwesomeIcon icon={faUserTie} className="icon-category" />
            </div>
            <div className="card-body">
                <div className="info">
                    <h3>{employee.nombre} {employee.apellidos}</h3>
                    <p>Departamento: {departmentName}</p>
                    <p>Ciudad: {employee.ciudad}</p>
                </div>
                <div className="footer">
                    <div className="actions">
                        <button className="btn-icon" onClick={() => onEdit(employee)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn-icon" onClick={() => onDelete(employee)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeCard;
