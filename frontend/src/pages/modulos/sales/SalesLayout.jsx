import NavBar from "../../../components/NavBar";
import ToolBar from "../../../components/ToolBar";

const modules = [
    {
        text: "Reportes", 
        submenus: [
            { url: "/ReporteVentas", text: "Reporte de Ventas",}
        ]
    }
];

function SalesLayout({ toolbarTitle, toolbarActions, children }) {
    return (
        <div className="sales-section">
            <NavBar modules={modules} />
            <div className="sales-section-main">
                <ToolBar toolbar_title={toolbarTitle}>
                    {toolbarActions}
                </ToolBar>
                {children}
            </div>
        </div>
    );
}

export default SalesLayout;
