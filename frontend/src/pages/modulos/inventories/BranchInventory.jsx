import { useEffect, useState } from "react";

import NavBar from "../../../components/NavBar.jsx";
import ToolBar from "../../../components/ToolBar.jsx";
import ExpandableBranch from "./reports/ExpandableBranch.jsx";

import '../../../assets/css/branch-inventory.css'

function BranchInventory() {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");

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

    useEffect(() => {
        fetch("http://localhost:5000/api/branches/get_with_totals")
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setBranches(result.data);
                } else {
                    setBranches([]);
                }
            })
            .catch(() => setBranches([]));
    }, []);

    function handleBranchChange(e) {
        setSelectedBranch(e.target.value);
    }

    return (
        <div className="inventory-section">
            <NavBar modules={modules} />
            <div className="inventory-section-main">
                <ToolBar toolbar_title="Inventarios por Sucursal">
                    <select
                        className="toolbar-actions-select"
                        name="toolbar_branches"
                        id="toolbar-actions-select"
                        value={selectedBranch}
                        onChange={handleBranchChange}
                    >
                        <option value="">Filtrar por sucursal</option>
                        {branches.map(branch => (
                            <option key={branch.id_sucursal} value={branch.id_sucursal}>
                                {branch.nombre}
                            </option>
                        ))}
                    </select>
                </ToolBar>
                <ExpandableBranch branches={branches} filterBranchId={selectedBranch} />
            </div>
        </div>
    );
}

export default BranchInventory;
