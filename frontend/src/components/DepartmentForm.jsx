function DepartmentForm({ values, onChange }) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Nombre del Departamento</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={values.nombre || ""}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepartmentForm;
