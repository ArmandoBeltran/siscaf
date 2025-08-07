function CategoryForm({ values, onChange }) {
    return (
        <div className="container">
            <div className="row">
                {/* Columna izquierda */}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={values.nombre || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Género</label>
                        <select
                            className="form-select"
                            name="genero"
                            value={values.genero || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        >
                            <option value="">-- Selecciona un género --</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                    </div>
                </div>

                {/* Columna derecha */}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Temporada</label>
                        <select
                            className="form-select"
                            name="temporada"
                            value={values.temporada || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        >
                            <option value="">-- Selecciona una temporada --</option>
                            <option value="Primavera">Primavera</option>
                            <option value="Verano">Verano</option>
                            <option value="Otoño">Otoño</option>
                            <option value="Invierno">Invierno</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Estatus</label>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="estatusSwitch"
                                name="estatus"
                                checked={values.estatus || false}
                                onChange={e => onChange(e.target.name, e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="estatusSwitch">
                                {values.estatus ? "Activo" : "Inactivo"}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            name="descripcion"
                            rows={3}
                            value={values.descripcion || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryForm;
