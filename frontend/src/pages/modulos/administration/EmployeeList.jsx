import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import EmployeeForm from "../../../components/EmployeeForm";
import EmployeeCard from "../../../components/EmployeeCard";
import "../../../assets/css/product-list.css";
import AdminLayout from "./AdminLayout";
import ModalTemplate from "../../../components/ModalTemplate";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [departments, setDepartments] = useState([]);

    useEffect(() => {
    fetch("http://localhost:5000/api/departments/get")
        .then(res => res.json())
        .then(data => {
        if (data.success) setDepartments(data.data);
        else console.error("Error al cargar departamentos:", data.message);
        });
    }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/employees/get")
      .then(res => res.json())
      .then(data => {
        if (data.success) setEmployees(data.data);
        else console.error("Error al cargar empleados:", data.message);
      });
  }, []);

  const handleInputChange = (name, value) => {
    setCurrentEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    const modalElement = document.getElementById("modalCreateEmployee");
    if (modalElement) {
      const bsModal = Modal.getInstance(modalElement);
      if (bsModal) bsModal.hide();
    }
  };

  const validateFields = (employee) => {
    const errors = {};
    if (!employee.nombre || employee.nombre.trim() === "") {
      errors.nombre = "Este campo es obligatorio";
    }
    if (!employee.id_departamento) {
        errors.id_departamento = "Selecciona un departamento";
    }
    // Agrega más validaciones aquí si lo necesitas
    return errors;
  };

  const handleSave = () => {
    const errors = validateFields(currentEmployee);
    if (Object.keys(errors).length > 0) {
      alert(
        "Por favor completa los siguientes campos:\n" +
        Object.keys(errors).join(", ")
      );
      return;
    }

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/api/employees/update/${currentEmployee.id_empleado}`
      : "http://localhost:5000/api/employees/create";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentEmployee),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (isEditMode) {
            setEmployees(prev =>
              prev.map(emp =>
                emp.id_empleado === currentEmployee.id_empleado
                  ? currentEmployee
                  : emp
              )
            );
          } else {
            setEmployees(prev => [
              ...prev,
              {
                ...currentEmployee,
                id_empleado: data.data?.id_empleado || null,
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

  const openModal = (employee = {}, editMode = false) => {
    setCurrentEmployee(employee);
    setIsEditMode(editMode);

    const modalElement = document.getElementById("modalCreateEmployee");
    if (modalElement) {
      const bsModal = Modal.getInstance(modalElement) || new Modal(modalElement, {});
      bsModal.show();
    }
  };

  const handleEdit = (employee) => {
    openModal(employee, true);
  };

  const handleDelete = (employee) => {
    if (window.confirm(`¿Eliminar empleado "${employee.nombre}"?`)) {
      fetch(`http://localhost:5000/api/employees/delete/${employee.id_empleado}`, {
        method: "DELETE",
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setEmployees(prev =>
              prev.filter(emp => emp.id_empleado !== employee.id_empleado)
            );
          } else {
            alert("Error al eliminar: " + data.message);
          }
        });
    }
  };

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.id_departamento === id);
    return dept ? dept.nombre : "Sin departamento";
  };


  return (
    <AdminLayout
      toolbarTitle="Empleados"
      toolbarActions={
        <button
          className="btn-create-product"
          data-bs-toggle="modal"
          data-bs-target="#modalCreateEmployee"
          onClick={() => openModal({}, false)}
        >
          + Crear Empleado
        </button>
      }
    >
      {showAlert && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-3"
          role="alert"
          style={{ zIndex: 1055, backgroundColor: "#32cd32", color: "white" }}
        >
          Empleado guardado correctamente
        </div>
      )}

      <div className="main--content--list">
        {employees.length > 0 ? (
          employees.map((emp, idx) => (
            <EmployeeCard
              key={idx}
              employee={emp}
              departmentName={getDepartmentName(emp.id_departamento)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="no--content">
            <img src="/imgs/no-results.png" alt="No hay resultados" />
            <p>No hay empleados registrados</p>
          </div>
        )}
      </div>

      <ModalTemplate
        id="modalCreateEmployee"
        titulo={isEditMode ? "Editar Empleado" : "Crear Empleado"}
        form={
          <EmployeeForm
            values={currentEmployee}
            onChange={handleInputChange}
            departments={departments}
          />
        }
        onSave={handleSave}
      />
    </AdminLayout>
  );
}

export default EmployeeList;
