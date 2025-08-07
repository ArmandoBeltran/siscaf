import NavBar from "../../../components/NavBar";
import ToolBar from "../../../components/ToolBar";

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
            { url: "/ReporteCategorias", text: "Reporte de Productos por Categoría"}
        ],
    },
];

function InventoryLayout({ toolbarTitle, toolbarActions, children }) {
    return (
        <div className="inventory-section">
            <NavBar modules={modules} />
            <div className="inventory-section-main">
                <ToolBar toolbar_title={toolbarTitle}>
                    {toolbarActions}
                </ToolBar>
                {children}
            </div>
        </div>
    );
}

export default InventoryLayout;
