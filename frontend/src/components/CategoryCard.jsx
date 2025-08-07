import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faThList } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/category-card.css";

function CategoryCard({ category, onEdit, onDelete}) {
    return (
        <div className="card-horizontal">
            <div className="card-icon">
                <FontAwesomeIcon icon={faThList} className="icon-category" />
            </div>
            <div className="card-body">
                <div className="info">
                    <h3>{category.nombre}</h3>
                    <p>Género: {category.genero}</p>
                    <p>Temporada: {category.temporada}</p>
                    <p>Estado: {(category.estatus) ? 'Activo' : 'Inactivo'}</p>
                </div>
                <div className="footer">
                    <div className="actions">
                        <button className="btn-icon" onClick={() => onEdit(category)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn-icon" onClick={() => onDelete(category)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryCard;
