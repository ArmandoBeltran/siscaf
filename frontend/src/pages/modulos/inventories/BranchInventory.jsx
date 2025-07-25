import { useEffect, useState } from "react";
import ExpandableBranch from "./reports/ExpandableBranch";
import InventoryLayout from "./InventoryLayout";

function BranchInventory() {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");

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
        <InventoryLayout
            toolbarTitle="Inventarios por Sucursal"
            toolbarActions={
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
            }
        >
            <ExpandableBranch branches={branches} filterBranchId={selectedBranch} />
        </InventoryLayout>
    );
}

export default BranchInventory;
