import NavBar from "../../../components/NavBar.jsx"
import ToolBar from "../../../components/ToolBar.jsx";
import ExpandableBranch from "./reports/ExpandableBranch.jsx";

function BranchInventory()
{
    const modules = [
        {url: "/Inventarios", text: "Inventario General"}, 
        {url: "/InventariosPorSucursal", text: "Inventario por Sucursal"},
        {url: "/", text: "Productos"}
    ];

    return (
        <div className="inventory-section">
            <NavBar 
                modules={modules}/>
            <div className="inventory-section-main">
                <ToolBar 
                    toolbar_title="Inventarios"/>
                <ExpandableBranch />
            </div>
        </div>
    )
}

export default BranchInventory