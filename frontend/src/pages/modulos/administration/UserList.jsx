import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import ModalTemplate from "../../../components/ModalTemplate";
import UserForm from "../../../components/UserForm";
import UserCard from "../../../components/UserCard";
import "../../../assets/css/product-list.css";
import AdminLayout from "./AdminLayout";

function UserList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Carga departamentos para el select
  useEffect(() => {
    fetch("http://localhost:5000/api/departments/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDepartments(data.data);
        else console.error("Error al cargar departamentos:", data.message);
      });
  }, []);

  // Carga empleados para el select
  useEffect(() => {
    fetch("http://localhost:5000/api/employees/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEmployees(data.data);
        else console.error("Error al cargar empleados:", data.message);
      });
  }, []);

  // Carga usuarios para el listado
  useEffect(() => {
    fetch("http://localhost:5000/api/users/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.data);
        else console.error("Error al cargar usuarios:", data.message);
      });
  }, []);

  const handleInputChange = (name, value) => {
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    const modalElement = document.getElementById("modalCreateUser");
    if (modalElement) {
      const bsModal = Modal.getInstance(modalElement);
      if (bsModal) bsModal.hide();
    }
  };

  const validateFields = (user) => {
    const errors = {};
    if (!user.nombre_usu || user.nombre_usu.trim() === "") {
      errors.nombre_usu = "Este campo es obligatorio";
    }
    if (!user.id_departamento) {
      errors.id_departamento = "Selecciona un departamento";
    }
    if (!user.id_empleado) {
      errors.id_empleado = "Selecciona un empleado";
    }
    if (!user.correo || user.correo.trim() === "") {
      errors.correo = "El correo es obligatorio";
    }
    if (!user.clave || user.clave.trim() === "") {
      errors.clave = "La clave es obligatoria";
    }
    return errors;
  };

  const handleSave = () => {
    const errors = validateFields(currentUser);
    if (Object.keys(errors).length > 0) {
      alert(
        "Por favor completa los siguientes campos:\n" +
          Object.keys(errors).join(", ")
      );
      return;
    }

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/api/users/update/${currentUser.id_usu}`
      : "http://localhost:5000/api/users/create";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentUser),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (isEditMode) {
            setUsers((prev) =>
              prev.map((u) =>
                u.id_usu === currentUser.id_usu ? currentUser : u
              )
            );
          } else {
            setUsers((prev) => [
              ...prev,
              {
                ...currentUser,
                id_usu: data.data?.id_usu || null,
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

  const openModal = (user = {}, editMode = false) => {
    setCurrentUser(user);
    setIsEditMode(editMode);

    const modalElement = document.getElementById("modalCreateUser");
    if (modalElement) {
      const bsModal =
        Modal.getInstance(modalElement) || new Modal(modalElement, {});
      bsModal.show();
    }
  };

  const handleEdit = (user) => {
    openModal(user, true);
  };

  const handleDelete = (user) => {
    if (window.confirm(`¿Eliminar usuario "${user.nombre_usu}"?`)) {
      fetch(`http://localhost:5000/api/users/delete/${user.id_usu}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUsers((prev) => prev.filter((u) => u.id_usu !== user.id_usu));
          } else {
            alert("Error al eliminar: " + data.message);
          }
        });
    }
  };

  // Mostrar nombre departamento
  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.id_departamento === id);
    return dept ? dept.nombre : "Sin departamento";
  };

  // Mostrar nombre empleado
  const getEmployeeName = (id) => {
    const emp = employees.find((e) => e.id_empleado === id);
    return emp ? `${emp.nombre} ${emp.apellidos}` : "Sin empleado";
  };

  return (
    <AdminLayout
      toolbarTitle="Usuarios"
      toolbarActions={
        <button
          className="btn-create-product"
          data-bs-toggle="modal"
          data-bs-target="#modalCreateUser"
          onClick={() => openModal({}, false)}
        >
          + Crear Usuario
        </button>
      }
    >
      {showAlert && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-3"
          role="alert"
          style={{ zIndex: 1055, backgroundColor: "#32cd32", color: "white" }}
        >
          Usuario guardado correctamente
        </div>
      )}

      <div className="main--content--list">
        {users.length > 0 ? (
          users.map((user, idx) => (
            <UserCard
              key={idx}
              user={user}
              departmentName={getDepartmentName(user.id_departamento)}
              employeeName={getEmployeeName(user.id_empleado)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="no--content">
            <img src="/imgs/no-results.png" alt="No hay resultados" />
            <p>No hay usuarios registrados</p>
          </div>
        )}
      </div>

      <ModalTemplate
        id="modalCreateUser"
        titulo={isEditMode ? "Editar Usuario" : "Crear Usuario"}
        form={
          <UserForm
            values={currentUser}
            onChange={handleInputChange}
            departments={departments}
            employees={employees}
          />
        }
        onSave={handleSave}
      />
    </AdminLayout>
  );
}

export default UserList;
