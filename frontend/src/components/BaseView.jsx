function BaseView({ modules, toolbar })
{
    return (
        <div className="main">
            <NavBar 
                modules={modules}/>
            <div className="">
                <ToolBar 
                    toolbar_title="Inventarios"/>
                Hola
            </div>
        </div>
    );
}