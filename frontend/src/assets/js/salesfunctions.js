export async function newSale(clave ,id_vendedor , id_sucursal) {
    const configuraciones = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pwd: clave,
            id_vendedor:id_vendedor,
            id_sucursal:id_sucursal
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
    try{
        const res = await fetch('http://localhost:5000/api/sale_details/add' , configuraciones)
        if (!res.ok){
            throw new Error(`Error ${res.status} : ${res.statusText}`);
    
        }
        const result = await res.json();
        return result;
    }catch(err){
        console.error("Error al guardar el detalle de venta:", err.message);
        throw err;
    }

}