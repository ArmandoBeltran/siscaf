import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faBuilding } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/category-card.css"; // Puedes renombrar o duplicar si gustas usar estilos específicos

function DepartmentCard({ department, onEdit, onDelete }) {
    return (
        <div className="card-horizontal">
            <div className="card-icon">
                <FontAwesomeIcon icon={faBuilding} className="icon-category" />
            </div>
            <div className="card-body">
                <div className="info">
                    <h3>{department.nombre}</h3>
                    <p>Fecha de Alta: {department.fecha_alta}</p>
                    {/* Puedes agregar más campos si decides extender el modelo */}
                </div>
                <div className="footer">
                    <div className="actions">
                        <button className="btn-icon" onClick={() => onEdit(department)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn-icon" onClick={() => onDelete(department)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepartmentCard;
