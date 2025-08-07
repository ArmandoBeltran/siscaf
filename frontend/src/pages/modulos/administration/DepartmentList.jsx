import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import ModalForm from "../../../components/modal";
import DepartmentForm from "../../../components/DepartmentForm";
import DepartmentCard from "../../../components/DepartmentCard";
import '../../../assets/css/product-list.css';
import AdminLayout from "./AdminLayout";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [currentDepartment, setCurrentDepartment] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/departments/get")
      .then(res => res.json())
      .then(data => {
        if (data.success) setDepartments(data.data);
        else console.error("Error al cargar departamentos:", data.message);
      });
  }, []);

  const handleInputChange = (name, value) => {
    setCurrentDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    const modalElement = document.getElementById("modalCreateDepartment");
    if (modalElement) {
      const bsModal = Modal.getInstance(modalElement);
      if (bsModal) bsModal.hide();
    }
  };

  const validateFields = (department) => {
    const errors = {};
    if (!department.nombre || department.nombre.trim() === "") {
      errors.nombre = "Este campo es obligatorio";
    }
    return errors;
  };

  const handleSave = () => {
    const errors = validateFields(currentDepartment);
    if (Object.keys(errors).length > 0) {
      alert(
        "Por favor completa los siguientes campos:\n" +
        Object.keys(errors).join(", ")
      );
      return;
    }

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/api/departments/update/${currentDepartment.id_departamento}`
      : "http://localhost:5000/api/departments/create";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentDepartment),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (isEditMode) {
            setDepartments(prev =>
              prev.map(dep =>
                dep.id_departamento === currentDepartment.id_departamento
                  ? currentDepartment
                  : dep
              )
            );
          } else {
            setDepartments(prev => [
              ...prev,
              {
                ...currentDepartment,
                id_departamento: data.data?.id_departamento || null,
              },
            ]);
          }
          closeModal();
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        } else {
          alert("Error: " + JSON.stringify(data.errors || data.message));
        }
      });
  };

  const openModal = (department = {}, editMode = false) => {
    setCurrentDepartment(department);
    setIsEditMode(editMode);

    const modalElement = document.getElementById("modalCreateDepartment");
    if (modalElement) {
      const bsModal = Modal.getInstance(modalElement) || new Modal(modalElement, {});
      bsModal.show();
    }
  };

  const handleEdit = (department) => {
    openModal(department, true);
  };

  const handleDelete = (department) => {
    if (window.confirm(`¿Eliminar departamento "${department.nombre}"?`)) {
      fetch(`http://localhost:5000/api/departments/delete/${department.id_departamento}`, {
        method: "DELETE",
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDepartments(prev =>
              prev.filter(dep => dep.id_departamento !== department.id_departamento)
            );
          } else {
            alert("Error al eliminar: " + data.message);
          }
        });
    }
  };

  return (
    <AdminLayout
      toolbarTitle="Departamentos"
      toolbarActions={
        <button
          className="btn-create-product"
          data-bs-toggle="modal"
          data-bs-target="#modalCreateDepartment"
          onClick={() => openModal({}, false)}
        >
          + Crear Departamento
        </button>
      }
    >
      {showAlert && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-3"
          role="alert"
          style={{ zIndex: 1055, backgroundColor: "#32cd32", color: "white" }}
        >
          Departamento guardado correctamente
        </div>
      )}

      <div className="main--content--list">
        {departments.length > 0 ? (
          departments.map((dep, idx) => (
            <DepartmentCard
              key={idx}
              department={dep}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="no--content">
            <img src="/imgs/no-results.png" alt="No hay resultados" />
            <p>No hay departamentos registrados</p>
          </div>
        )}
      </div>

      <ModalForm
        id="modalCreateDepartment"
        titulo={isEditMode ? "Editar Departamento" : "Crear Departamento"}
        form={
          <DepartmentForm
            values={currentDepartment}
            onChange={handleInputChange}
          />
        }
        onSave={handleSave}
      />
    </AdminLayout>
  );
}

export default DepartmentList;
