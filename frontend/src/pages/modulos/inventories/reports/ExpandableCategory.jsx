import ExpandableItem from "../../../../components/reports/ExpandableItem";
import CategoryProducts from "./CategoryProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function ExpandableCategory({ categories, filterCategory }) {

    console.log(filterCategory);
    const filteredCategories = filterCategory
        ? categories.filter(category => category.nombre.toLowerCase().includes(filterCategory.toLowerCase()))
        : categories;

    return (
        <>
            {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                    <ExpandableItem
                        key={category.id_categoria}
                        title={category.nombre}
                        line_content={
                        <>
                            <h4>Temporada: {category.temporada}</h4>
                            <h4>Estado: {category.estado}</h4>
                            <h4>Total productos: {category.cantidad}</h4>
                        </>
                        }
                    >
                        <CategoryProducts categoryId={category.id_categoria} />
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

export default ExpandableCategory;
