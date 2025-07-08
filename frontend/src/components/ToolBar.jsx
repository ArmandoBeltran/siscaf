import '../assets/css/toolbar.css'

function ToolBar({ toolbar_title })
{
    return (
        <div className="toolbar">
            <div className="toolbar-title">
                <h4>{ toolbar_title }</h4>
                {/*<button className='toolbar-title-btn'>Crear</button>*/}
            </div>
            <div className="toolbar-actions">
                <select name="toolbar_branches" className='toolbar-actions-select' id="toolbar-actions-select">
                    <option selected>Filtrar por sucursal</option>
                    <option value="">1</option>
                    <option value="">1</option>
                    <option value="">1</option>
                </select>
            </div>
        </div>
    );
}

export default ToolBar;