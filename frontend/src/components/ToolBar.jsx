import '../assets/css/toolbar.css';

function ToolBar({ toolbar_title, children }) {
    return (
        <div className="toolbar">
            <div className="toolbar-title">
                <h4>{toolbar_title}</h4>
            </div>
            <div className="toolbar-actions">
                {children}
            </div>
        </div>
    );
}

export default ToolBar;