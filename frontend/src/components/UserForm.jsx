function UserForm({ values, onChange, departments = [], employees = [] }) {
  return (
    <div className="container">
      <div className="row">
        {/* Usuario */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Nombre de Usuario</label>
          <input
            type="text"
            className="form-control"
            name="nombre_usu"
            value={values.nombre_usu || ""}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
        </div>

        {/* Empleado */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Empleado</label>
          <select
            className="form-select"
            name="id_empleado"
            value={values.id_empleado || ""}
            onChange={(e) => onChange(e.target.name, parseInt(e.target.value))}
          >
            <option value="">-- Selecciona un empleado --</option>
            {employees.map((emp) => (
              <option key={emp.id_empleado} value={emp.id_empleado}>
                {emp.nombre} {emp.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* Departamento */}
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

        {/* Correo */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={values.correo || ""}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
        </div>

        {/* Clave */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Clave</label>
          <input
            type="password"
            className="form-control"
            name="clave"
            value={values.clave || ""}
            onChange={(e) => onChange(e.target.name, e.target.value)}
            autoComplete="new-password"
          />
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

export default UserForm;
