export async function newSale(clave, id_vendedor, id_sucursal) {
    const configuraciones = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pwd: clave,
            id_vendedor: id_vendedor,
            id_sucursal: id_sucursal
        })
    };

    try {
        const res = await fetch("http://localhost:5000/api/sales/create", configuraciones);

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const result = await res.json();

        return result; // ya es un objeto
    } catch (err) {
        console.error("Error al obtener datos:", err.message);
        throw err;
    }
}


export async function newSaleDetail(payload) {
    const jsonPayload = JSON.stringify(payload);
    const configuraciones = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonPayload

    };
    try {
        const res = await fetch('http://localhost:5000/api/sale_details/add', configuraciones)
        if (!res.ok) {
            throw new Error(`Error ${res.status} : ${res.statusText}`);

        }
        const result = await res.json();
        return result;
    } catch (err) {
        console.error("Error al guardar el detalle de venta:", err.message);
        throw err;
    }

}

export async function updateSaleDetail(detalle) {
    console.log(detalle);
    try {
        const { id_detalle, ...datosAActualizar } = detalle;
        const { producto, ...datos } = detalle;


        const response = await fetch(`http://localhost:5000/api/sale_details/update/${id_detalle}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos), // solo los campos a actualizar
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Error actualizando detalle');
        }

        return result;
    } catch (error) {
        console.error('Error en updateSaleDetail:', error);
        throw error;
    }
}

export async function delSale(venta) {
    try {
        const response = await fetch(`http://localhost:5000/api/sales/delete/${venta.id_venta}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(venta), // solo los campos a actualizar
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Error actualizando detalle');
        }

        return result;
    } catch (error) {
        console.error('Error en updateSaleDetail:', error);
        throw error;
    }
}

export async function deleteSaleDetail(detalle) {
    try {
        const response = await fetch(`http://localhost:5000/api/sale_details/delete/${detalle.id_detalle}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(detalle), // solo los campos a actualizar
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Error actualizando detalle');
        }

        return result;
    } catch (error) {
        console.error('Error en updateSaleDetail:', error);
        throw error;
    }
}