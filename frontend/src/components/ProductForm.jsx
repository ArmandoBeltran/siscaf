function ProductForm({ values, onChange, categorias }) {
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
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            name="descripcion"
                            value={values.descripcion || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Precio</label>
                        <input
                            type="number"
                            className="form-control"
                            name="precio"
                            value={values.precio || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Material</label>
                        <input
                            type="text"
                            className="form-control"
                            name="material"
                            value={values.material || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Talla</label>
                        <input
                            type="text"
                            className="form-control"
                            name="talla"
                            value={values.talla || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    </div>
                </div>

                {/* Columna derecha */}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Color</label>
                        <input
                            type="text"
                            className="form-control"
                            name="color"
                            value={values.color || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ocasión</label>
                        <input
                            type="text"
                            className="form-control"
                            name="ocasion"
                            value={values.ocasion || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tipo de tacón</label>
                        <input
                            type="text"
                            className="form-control"
                            name="tipo_tacon"
                            value={values.tipo_tacon || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Altura del tacón (cm)</label>
                        <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            name="altura_tacon"
                            value={values.altura_tacon || ""}
                            onChange={e => onChange(e.target.name, e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Categoría</label>
                        <select
                            className="form-select"
                            name="id_categoria"
                            value={values.id_categoria || ""}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                        >
                            <option value="">-- Selecciona una categoría --</option>
                            {categorias.map((cat) => (
                                <option key={cat.id_categoria} value={cat.id_categoria}>
                                    {cat.nombre} - {cat.temporada}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductForm;
