import NavBar from "../../../components/NavBar";
import ToolBar from "../../../components/ToolBar";

const modules = [
    {
        text: "Reportes", 
        submenus: [
            { url: "/ReporteDepartamentosEmpleados", text: "Reporte de Empleados por Departamento",}
        ]
    }, 
    {
        text: "Departmentos", 
        url: "/Departamentos"
    },
    {
        text: "Empleados", 
        url: "/Empleados"
    },
    {
        text: "Usuarios", 
        url: "/Usuarios"
    },
];

function AdminLayout({ toolbarTitle, toolbarActions, children }) {
    return (
        <div className="admin-section">
            <NavBar modules={modules} />
            <div className="admin-section-main">
                <ToolBar toolbar_title={toolbarTitle}>
                    {toolbarActions}
                </ToolBar>
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;
