import { useState, useEffect } from "react";
import DropSelect from "./DropSelect";
function SalesContainer({ onChange }) {
    const [productos, setProductos] = useState([]);
    const [data, seData] = useState([]);
    const [productosData, setProductosData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/get`)
            .then(res => res.json())
            .then(json => seData(json.data || []))
            .catch(err => console.error("Error cargando productos", err));
    }, []);

    const agregarProducto = () => {
        const nuevos = [...productos, {
            id_producto: "",
            cantidad: 1,
            importe: "0.00",
            precio: 0
        }];
        setProductos(nuevos);
        onChange(nuevos);
    };
    function limpiarPrecio(precioStr) {
        if (!precioStr) return 0;
        const limpio = precioStr.replace(/[^0-9.]/g, '');
        return parseFloat(limpio) || 0;
    }

    const actualizarProducto = (index, key, value) => {
        const nuevos = [...productos];

        if (key === "id_producto") {
            nuevos[index][key] = value;

            const productoData = data?.find(p => p.id_producto?.toString() === value?.toString());

            const precioUnitario = productoData ? limpiarPrecio(productoData.precio) : 0;
            nuevos[index].precio = precioUnitario;

            const cantidad = parseFloat(nuevos[index].cantidad) || 1;
            nuevos[index].importe = (precioUnitario * cantidad).toFixed(2);

        } else if (key === "cantidad") {
            nuevos[index][key] = value;

            const cantidad = parseFloat(value) || 1;
            const precioUnitario = parseFloat(nuevos[index].precio) || 0;
            nuevos[index].importe = (precioUnitario * cantidad).toFixed(2);

        } else {
            nuevos[index][key] = value;
        }

        setProductos(nuevos);
        onChange(nuevos);
        console.log("Productos actualizados:", nuevos);
    };


    const eliminarProducto = (index) => {
        const nuevos = productos.filter((_, i) => i !== index);
        setProductos(nuevos);
        onChange(nuevos); // 🔹 Notificamos al padre
    };
    if (data != null) {
        return (
            <div>
                <h3>Productos</h3>

                {productos.map((producto, index) => (
                    <div key={index} className="card p-3 mb-2">
                        <div className="row g-2 align-items-center mb-2">
                            {/* Select de producto */}
                            <div className="col-sm-12 col-md-5 col-xl-5">
                                <DropSelect
                                    name="products"
                                    value={producto.id_producto}
                                    data={data}
                                    onChange={(e) => actualizarProducto(index, "id_producto", e.target.value)}
                                    idkey="id_producto"
                                />
                            </div>

                            {/* Cantidad */}
                            <div className="col-sm-12 col-md-2 col-xl-2">
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="Cantidad"
                                    min="1"
                                    value={producto.cantidad}
                                    onChange={(e) => actualizarProducto(index, "cantidad", e.target.value)}
                                />
                            </div>

                            {/* Importe */}
                            <div className="col-sm-12 col-md-3 col-xl-3">
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">$</span>
                                    <input
                                        type="text"
                                        className="form-control text-end"
                                        value={producto.importe}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Botón eliminar */}
                            <div className="col-auto">
                                <button
                                    onClick={() => eliminarProducto(index)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>

                    </div>
                ))}

                <button type="button" onClick={agregarProducto} className="btn btn-primary mt-3">
                    Agregar producto
                </button>
            </div>
        );
    }

}

export default SalesContainer;
