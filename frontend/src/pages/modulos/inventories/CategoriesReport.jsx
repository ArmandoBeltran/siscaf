import { useEffect, useState } from "react";
import ExpandableCategory from "./reports/ExpandableCategory";
import InventoryLayout from "./InventoryLayout";

function CategoriesReport() {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/categories/get/report")
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setCategories(result.data);
                } else {
                    setCategories([]);
                }
            })
            .catch(() => setCategories([]));
    }, []);

    function handleCategoryChange(e) {
        setCategory(e.target.value);
    }

    return (
        <InventoryLayout
            toolbarTitle="Productos por categoría"
            toolbarActions={
                <input
                    type="text"
                    name="inventory-searchbar"
                    className="toolbar-actions-searchbar"
                    placeholder="Buscar categoría"
                    value={category}
                    onChange={handleCategoryChange}
                />
            }
        >
            <ExpandableCategory categories={categories} filterCategory={category} />
        </InventoryLayout>
    );
}

export default CategoriesReport;
