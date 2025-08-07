function ModalTemplate(props) {
    return (
        <div className="modal fade" id={props.id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">{props.titulo}</h1>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid">
                            <section className="row m-b-md">
                                <div className="col-12">
                                    {props.form}
                                </div>
                            </section>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-success" onClick={props.onSave}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalTemplate;