import ExpandableItem from "../../../../components/reports/ExpandableItem";
import BranchProducts from "./BranchProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function ExpandableBranch({ branches, filterBranchId }) {

    const filteredBranches = filterBranchId
        ? branches.filter(branch => branch.id_sucursal.toString() === filterBranchId)
        : branches;

    return (
        <>
            {filteredBranches.length > 0 ? (
                filteredBranches.map(branch => (
                    <ExpandableItem
                        key={branch.id_sucursal}
                        title={branch.nombre}
                        line_content={<h3>Total productos: {branch.cantidad_total}</h3>}
                    >
                        <BranchProducts branchId={branch.id_sucursal} />
                    </ExpandableItem>
                ))
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    color: '#666'
                }}>
                    <FontAwesomeIcon icon={faCircleExclamation} size="4x" />
                    <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>No se encontraron datos a mostrar</p>
                </div>
            )}
        </>
    );
}

export default ExpandableBranch;
