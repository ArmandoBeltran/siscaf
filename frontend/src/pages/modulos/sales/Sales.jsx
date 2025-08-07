import SalesLayout from "./SalesLayout";
import ModalForm from "../../../components/modal";
import { useContext } from 'react';
import { UserContext } from "../../../components/userContext";
import '../../../assets/css/inputs.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from "react";
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { newSale, newSaleDetail } from "../../../assets/js/salesfunctions";
import SalesContainer from "../../../components/SalesContainer";
import SalesTable from "./reports/GeneralSales";


function Sales() {
    const [clave, setClave] = useState("");
    const { user } = useContext(UserContext);
    const [id_venta, setIdVenta] = useState("");
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);



    function Nuevo(e) {
        setClave("");
        document.getElementById("confirmPss").value = "";
        const msgErrors = document.getElementsByClassName("msgError");
        for (let i = 0; i < msgErrors.length; i++) {
            const msgError = msgErrors[i];

            msgError.style.display = "none";
        }
    }

    function handleClave(e) {
        setClave(e.target.value);
    }


    async function handleNewSale(e) {
        try {
            const data = await newSale(clave, user.id_empleado, user.id_departamento);
            console.log("Datos del usuario:", data);
            if (data.success == true) {
                document.querySelector('#ConfirmNewSale #btn-close-sale').click();
                document.querySelector('#btn-new-sale').click();
                setIdVenta(data.id_venta);
            } else {
                //mostrar que la contraseña es incorrecta
                console.log("Clave Incorrecta")
                const msgWError = document.getElementById("msg_confirmPss");
                msgWError.textContent = "Clave Incorrecta";
                msgWError.style.display = "block";
            }
        } catch (error) {
            alert("Error al crear venta: " + error.message);
        }

    }




    async function handleConfirmDeleteSale(e) {

    }
    async function handleNewSaleDetail(e) {
        // Realizar await y fetch para crear el detalle de la venta
        const payload = {
            id_venta: id_venta,
            productos: productosSeleccionados.map(prod => ({
                id_producto: parseInt(prod.id_producto),
                cantidad: parseInt(prod.cantidad),
                precio_unitario: parseFloat(prod.precio),
                importe: parseFloat(prod.importe)
                

            }))
        };
        //Realizar POST
        const response = await newSaleDetail(payload);
        if (response.success){
            alert("detalle guardado correctamente");
            document.querySelector('#NewSale #btn-close-sale-details').click();
            setIdVenta('');
        }else{
            alert("detalle guardado correctamente");
            document.querySelector('#NewSale #btn-close-sale-details').click();
        }
        
    }

    return (
        <SalesLayout
            toolbarTitle="Ventas"
            toolbarActions={
                <button
                    class="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#ConfirmNewSale"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    onClick={Nuevo}
                >
                    <i></i>Nueva venta
                </button>
            }>
            <ModalForm
                modalID="ConfirmNewSale"
                ModalTitle="Aviso"
                ModalLayout="layerConfirmSale"
                content={
                    <div className="text-center">
                        <FontAwesomeIcon icon={faTriangleExclamation} size="5x" />
                        <h3 className="my-3">Ingrese la clave de Confirmación</h3>

                        <input id="confirmPss" type="text" pattern="[0-9]{1,5}" maxLength="4" placeholder="****" className="inputSalePwd mt-4 mb-4 required " onChange={handleClave} required />
                        <div id="msg_confirmPss" className="text-danger hidden msgError" style={{ display: "none" }}></div>

                    </div>
                }
                Modalbuttons={
                    <div className="modal-footer">
                        <button id="btn-close-sale" type="button" className="btn btn-danger " data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-success" onClick={handleNewSale}>Confirmar</button>
                    </div>
                }
            >
            </ModalForm>

            <button id="btn-new-sale" data-bs-toggle="modal" data-bs-target="#NewSale" data-bs-backdrop="static" data-bs-keyboard="false" style={{ visibility: "hidden" }}></button>
            <ModalForm
                modalID="NewSale"
                ModalTitle="Detalles de la venta"
                ModalLayout="layerSale"
                content={
                    <form>
                        <SalesContainer onChange={setProductosSeleccionados} />
                    </form>
                }
                Modalbuttons={
                    <div className="modal-footer">
                        <button
                            id="btn-close-sale-details"
                            type="button"
                            className="btn btn-danger"
                            data-bs-dismiss="modal"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleNewSaleDetail}
                        >
                            Confirmar
                        </button>
                    </div>
                }
            />

                <SalesTable></SalesTable>
        </SalesLayout>
    );
}
export default Sales;