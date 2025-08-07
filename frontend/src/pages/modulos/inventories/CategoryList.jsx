import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import CategoryCard from "../../../components/CategoryCard";
import InventoryLayout from "./InventoryLayout";
import CategoryForm from "../../../components/CategoryForm"; // asegúrate de tenerlo
import '../../../assets/css/product-list.css';
import ModalTemplate from "../../../components/ModalTemplate";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories/get")
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data);
        else console.error("Error fetching categories:", data.message);
      });
  }, []);

  const handleInputChange = (name, value) => {
    setCurrentCategory((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    const modalElement = document.getElementById("modalCreateCategory");
    if (modalElement) {
      const bsModal = Modal.getInstance(modalElement);
      if (bsModal) {
        bsModal.hide();
      }
    }
  };

  const validateFields = (category) => {
    const required = ["nombre", "descripcion", "genero", "temporada"];
    const errors = {};
    for (const field of required) {
        if (!category[field] || category[field].toString().trim() === "") {
        errors[field] = "Este campo es obligatorio";
        }
    }
    return errors;
  };


  const handleSave = () => {
    const errors = validateFields(currentCategory);
    if (Object.keys(errors).length > 0) {
      alert(
        "Por favor completa los siguientes campos:\n" +
        Object.keys(errors).join(", ")
      );
      return;
    }

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/api/categories/update/${currentCategory.id_categoria}`
      : "http://localhost:5000/api/categories/create";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentCategory),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (isEditMode) {
            setCategories(prev =>
              prev.map(cat =>
                cat.id_categoria === currentCategory.id_categoria
                  ? currentCategory
                  : cat
              )
            );
          } else {
            setCategories(prev => [
              ...prev,
              {
                ...currentCategory,
                id_categoria: data.data?.id_categoria || null,
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

  const openModal = (category = {}, editMode = false) => {
    setCurrentCategory(category);
    setIsEditMode(editMode);

    const modalElement = document.getElementById("modalCreateCategory");
    if (modalElement) {
      const bsModal = Modal.getInstance(modalElement) || new Modal(modalElement, {});
      bsModal.show();
    }
  };

  const handleEdit = (category) => {
    openModal(category, true);
  };

  const handleDelete = (category) => {
    console.log(category);
    if (window.confirm(`¿Eliminar categoría "${category.nombre}"?`)) {
      fetch(`http://localhost:5000/api/categories/delete/${category.id_categoria}`, {
        method: "DELETE",
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCategories(prev =>
              prev.filter(cat => cat.id_categoria !== category.id_categoria)
            );
          } else {
            alert("Error al eliminar: " + data.message);
          }
        });
    }
  };

  return (
    <InventoryLayout
      toolbarTitle="Categorías"
      toolbarActions={
        <button
          className="btn-create-product"
          data-bs-toggle="modal"
          data-bs-target="#modalCreateCategory"
          onClick={() => openModal({}, false)}
        >
          + Crear Categoría
        </button>
      }
    >
      {showAlert && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-3"
          role="alert"
          style={{ zIndex: 1055, backgroundColor: "#32cd32", color: "white" }}
        >
          Categoría guardada correctamente
        </div>
      )}

      <div className="main--content--list">
        {categories.length > 0 ? (
          categories.map((cat, idx) => (
            <CategoryCard
              key={idx}
              category={cat}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="no--content">
            <img src="/imgs/no-results.png" alt="No hay resultados" />
            <p>No hay categorías registradas</p>
          </div>
        )}
      </div>

      <ModalTemplate
        id="modalCreateCategory"
        titulo={isEditMode ? "Editar Categoría" : "Crear Nueva Categoría"}
        form={
          <CategoryForm
            values={currentCategory}
            onChange={handleInputChange}
          />
        }
        onSave={handleSave}
      />
    </InventoryLayout>
  );
}

export default CategoryList;
