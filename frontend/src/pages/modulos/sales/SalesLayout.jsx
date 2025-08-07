import NavBar from "../../../components/NavBar";
import ToolBar from "../../../components/ToolBar";

const modules = [
    {
        text: "Ventas", 
        url: "/Ventas"
    },
    {
        text: "Reportes Graficados", 
        url: "/GraficasVentas"
    },
    {
        text: "Reporte de Ventas",
        url: "/ReporteVentas"
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
