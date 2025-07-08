import { useEffect, useState } from "react";

import NavBar  from "../../../components/NavBar";
import ToolBar from "../../../components/ToolBar";

import InventoryProducts from "./InventoryProducts";

function GeneralInventory()
{
    const [product, setProduct] = useState("");

    const modules = [
        {
            text: "Inventarios",
            submenus: [
            { url: "/Inventarios", text: "Inventario sin Asignar" },
            { url: "/InventariosSucursal", text: "Inventario por Sucursal" },
            ],
        },
        {
            text: "Catálogos",
            submenus: [
            { url: "/Productos", text: "Productos" },
            { url: "/Categorias", text: "Categorías" },
            ],
        },
    ];

    function handleProductChange(e)
    {
        setProduct(e.target.value);
    }

    return (
        <div>
            <NavBar modules={modules} />
            <div>
                <ToolBar toolbar_title="Inventario sin Asignar">
                    <input 
                        type="text" 
                        name="inventory-searchbar" 
                        className="toolbar-actions-searchbar" 
                        placeholder="Buscar producto"
                        value={product}
                        onChange={handleProductChange}/>
                </ToolBar>
                <InventoryProducts filterProductName={product}/>
            </div>
        </div>
    );
}

export default GeneralInventory