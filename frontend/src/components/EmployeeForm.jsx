function EmployeeForm({ values, onChange, departments = [] }) {
    return (
        <div className="container">
            <div className="row">
                {/* Datos personales */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={values.nombre || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Apellidos</label>
                    <input
                        type="text"
                        className="form-control"
                        name="apellidos"
                        value={values.apellidos || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>

                {/* Dirección */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        name="telefono"
                        value={values.telefono || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Ciudad</label>
                    <input
                        type="text"
                        className="form-control"
                        name="ciudad"
                        value={values.ciudad || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Estado</label>
                    <input
                        type="text"
                        className="form-control"
                        name="estado"
                        value={values.estado || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Colonia</label>
                    <input
                        type="text"
                        className="form-control"
                        name="colonia"
                        value={values.colonia || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Calle</label>
                    <input
                        type="text"
                        className="form-control"
                        name="calle"
                        value={values.calle || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Código Postal</label>
                    <input
                        type="text"
                        className="form-control"
                        name="cp"
                        value={values.cp || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>

                {/* Identidad */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">CURP</label>
                    <input
                        type="text"
                        className="form-control"
                        name="curp"
                        value={values.curp || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">RFC</label>
                    <input
                        type="text"
                        className="form-control"
                        name="rfc"
                        value={values.rfc || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>

                {/* Fecha de nacimiento */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fecha_nac"
                        value={values.fecha_nac || ""}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                    />
                </div>

                {/* Select de Departamento */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">Departamento</label>
                    <select
                        className="form-select"
                        name="id_departamento"
                        value={values.id_departamento || ""}
                        onChange={(e) => onChange(e.target.name, parseInt(e.target.value))}
                    >
                        <option value="">-- Selecciona un departamento --</option>
                        {departments.map((dep) => (
                            <option key={dep.id_departamento} value={dep.id_departamento}>
                                {dep.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Estatus */}
                <div className="col-md-12 mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="estatus"
                        name="estatus"
                        checked={!!values.estatus}
                        onChange={(e) => onChange(e.target.name, e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="estatus">
                        Estatus activo
                    </label>
                </div>
            </div>
        </div>
    );
}

export default EmployeeForm;
