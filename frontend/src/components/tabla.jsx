

function Tabla({ datacatch }){
    const dataArray = datacatch;
    console.log(dataArray);
      // Configuración de columnas
    const columnas = Object.keys(dataArray[0]);  
    const datos = Object.values(dataArray);

    return (
    <div className="table-responsive">
        <table className="table table-striped table-hover">
        <thead className="table-dark">
            <tr>
                {columnas.map((columna, i) => (
                    <th key={i}>{columna.toUpperCase()}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {datos.map(usuario => (
            <tr key={usuario.id}>
                {columnas.map((key, i) => (
                <td key={i}>{usuario[key]}</td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    );

}
export default Tabla