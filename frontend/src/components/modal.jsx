function ModalForm({ modalID, ModalTitle, ModalLayout, content, Modalbuttons }) {
  return (
    <div 
      className="modal fade" 
      id={modalID} 
      tabIndex="-1" 
      aria-labelledby={ModalLayout} 
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={ModalLayout}>{ModalTitle}</h1>
          </div>
          <div className="modal-body">
            <div className="container-fluid">
              <section className="row m-b-md">
                <div className="col-12">
                  {content}
                </div>
              </section>
            </div>
          </div>
          
          {Modalbuttons}
          
        </div>
      </div>
    </div>
  );
}


export default ModalForm;