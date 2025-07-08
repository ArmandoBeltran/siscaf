import ExpandableItem from "../../../../components/reports/ExpandableItem";

import BranchProducts from "./BranchProducts";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function ExpandableBranch()
{
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/branches/get_with_totals")
        .then(res => {
            if (!res.ok) throw new Error("Error en la respuesta del servidor");
            return res.json();
        })
        .then(data => {
            console.log(data);
            setBranches(data.data || [])
        })
        .catch(err => console.error(err.message));
    }, []);

    return (
        <>
            {branches.length > 0 ? (
                branches.map(branch => (
                    <ExpandableItem
                        key={branch.id_sucursal}
                        title={branch.nombre}
                        line_content={<h3>Total productos: {branch.cantidad_total}</h3>}
                    >
                        <BranchProducts branchId={branch.id_sucursal}/>
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

export default ExpandableBranch