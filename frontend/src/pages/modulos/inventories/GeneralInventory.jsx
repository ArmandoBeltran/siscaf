import { useState } from "react";
import InventoryLayout from "./InventoryLayout";
import InventoryProducts from "./reports/InventoryProducts";

function GeneralInventory() {
    const [product, setProduct] = useState("");

    function handleProductChange(e) {
        setProduct(e.target.value);
    }

    return (
        <InventoryLayout
            toolbarTitle="Inventario sin Asignar"
            toolbarActions={
                <input
                    type="text"
                    name="inventory-searchbar"
                    className="toolbar-actions-searchbar"
                    placeholder="Buscar producto"
                    value={product}
                    onChange={handleProductChange}
                />
            }
        >
            <InventoryProducts filterProductName={product} />
        </InventoryLayout>
    );
}

export default GeneralInventory;
