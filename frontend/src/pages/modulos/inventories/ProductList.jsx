import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import ProductCard from "../../../components/ProductCard";
import InventoryLayout from "./InventoryLayout";
import ModalTemplate from "../../../components/ModalTemplate";
import ProductForm from "../../../components/ProductForm";
import "../../../assets/css/product-list.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
        else console.error("Error fetching products:", data.message);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategorias(data.data);
      });
  }, []);

  const handleInputChange = (name, value) => {
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    const modal = document.getElementById("modalCreateProduct");
    const backdrop = document.querySelector(".modal-backdrop");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      if (backdrop) backdrop.remove();
    }
  };

  const validateFields = (product) => {
    const required = [
      "material",
      "talla",
      "color",
      "ocasion",
      "tipo_tacon",
      "id_categoria",
      "descripcion",
      "precio",
      "nombre",
      "altura_tacon",
    ];
    const errors = {};
    for (const field of required) {
      if (!product[field] || product[field].toString().trim() === "") {
        errors[field] = "Este campo es obligatorio";
      }
    }
    return errors;
  };

  const handleSave = () => {
    const errors = validateFields(currentProduct);
    if (Object.keys(errors).length > 0) {
      alert(
        "Por favor completa los siguientes campos:\n" +
          Object.keys(errors).join(", ")
      );
      return;
    }

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/api/products/update/${currentProduct.id_producto}`
      : "http://localhost:5000/api/products/create";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (isEditMode) {
            setProducts((prev) =>
              prev.map((p) =>
                p.id_producto === currentProduct.id_producto ? currentProduct : p
              )
            );
          } else {
            setProducts((prev) => [
              ...prev,
              { ...currentProduct, id_producto: data.data?.id_producto || null },
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

  function parsePrecio(precioStr) {
    if (!precioStr) return "";
    // Eliminar $ y comas
    const limpio = precioStr.replace(/[$,]/g, "");
    return isNaN(limpio) ? "" : Number(limpio);
  }

  const openModal = (product = {}, editMode = false) => {
    const prodClean = { ...product };
    if (prodClean.precio) {
        prodClean.precio = parsePrecio(prodClean.precio);
    }
    setCurrentProduct(prodClean);
    setIsEditMode(editMode);
  };


  const handleEdit = (product) => {
    openModal(product, true);
    
    const modalElement = document.getElementById("modalCreateProduct");
    if (modalElement) {
        const bsModal = Modal.getInstance(modalElement) || new Modal(modalElement, {});
        bsModal.show();
    }
  };  

  const handleDelete = (product) => {
    if (window.confirm(`¿Eliminar "${product.nombre}"?`)) {
      fetch(`http://localhost:5000/api/products/delete/${product.id_producto}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProducts((prev) =>
              prev.filter((p) => p.id_producto !== product.id_producto)
            );
          } else {
            alert("Error al eliminar: " + data.message);
          }
        });
    }
  };

  return (
    <InventoryLayout
      toolbarTitle="Productos"
      toolbarActions={
        <button
          className="btn-create-product"
          data-bs-toggle="modal"
          data-bs-target="#modalCreateProduct"
          onClick={() => openModal({}, false)}
        >
          + Crear Producto
        </button>
      }
    >
      {showAlert && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-3"
          role="alert"
          style={{ zIndex: 1055, backgroundColor: "#32cd32", color: "white" }}
        >
          Producto guardado correctamente
        </div>
      )}

      <div className="main--content--list">
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="no--content">
            <img src="/imgs/no-results.png" alt="No hay resultados" />
            <p>No hay productos registrados</p>
          </div>
        )}
      </div>

      <ModalTemplate
        id="modalCreateProduct"
        titulo={isEditMode ? "Editar Producto" : "Crear Nuevo Producto"}
        form={
          <ProductForm
            values={currentProduct}
            onChange={handleInputChange}
            categorias={categorias}
          />
        }
        onSave={handleSave}
      />
    </InventoryLayout>
  );
}

export default ProductList;
