import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/category-card.css";

function UserCard({ user, departmentName, employeeName, onEdit, onDelete }) {
  return (
    <div className="card-horizontal">
      <div className="card-icon">
        <FontAwesomeIcon icon={faUser} className="icon-category" />
      </div>
      <div className="card-body">
        <div className="info">
          <h3>{user.nombre_usu}</h3>
          <p>
            <strong>Empleado:</strong> {employeeName}
          </p>
          <p>
            <strong>Departamento:</strong>{departmentName}
          </p>
          <p>
            <strong>Correo:</strong>{user.correo}
          </p>
        </div>
        <div className="footer">
          <div className="actions">
            <button className="btn-icon" onClick={() => onEdit(user)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="btn-icon" onClick={() => onDelete(user)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
