import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faShoePrints } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/product-card.css";

function ProductCard({ product, onEdit, onDelete }) {
    return (
        <div className="card-horizontal">
            <div className="card-icon">
                <FontAwesomeIcon icon={faShoePrints} className="icon-shoe" />
            </div>

            <div className="card-body">
                <div className="info">
                    <h3>{product.nombre}</h3>
                    <p><strong>Material:</strong> {product.material}</p>
                    <p><strong>Color:</strong> {product.color}</p>
                    <p><strong>Precio:</strong> {product.precio}</p>
                </div>

                <div className="footer">
                    <div className="actions">
                        <button className="btn-icon" onClick={() => onEdit(product)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn-icon" onClick={() => onDelete(product)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
