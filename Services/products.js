import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyA88irhXWXt-wa52Ov-4XSMm9XS-8QKgsk",
  authDomain: "naturquimiaessentials.firebaseapp.com",
  projectId: "naturquimiaessentials",
  storageBucket: "naturquimiaessentials.appspot.com",
  messagingSenderId: "954679723428",
  appId: "1:954679723428:web:f5601bac82a6a73d176d31"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
const productCollection = collection(db, "products");

const CATEGORIES = ['jabon', 'crema', 'unguento'];

// Function to save new product
async function guardarProducto(event) {
  event.preventDefault();
  
  const productoId = document.getElementById('productoId').value; // ID del producto para editar
  const productoData = {
    name: document.getElementById('nombre').value,
    description: document.getElementById('descripcion').value,
    price: parseFloat(document.getElementById('precio').value),
    stock: parseInt(document.getElementById('stock').value),
    image: document.getElementById('imagen').value,
    category: document.getElementById('categoria').value,
    status: 'active'
  };

  try {
    if (productoId) {
      // Si existe un ID, actualiza el producto existente
      const productoRef = doc(db, "products", productoId);
      await updateDoc(productoRef, productoData);
      Swal.fire("¡Éxito!", "Producto actualizado correctamente", "success");
    } else {
      // Si no existe un ID, crea un nuevo producto
      await addDoc(productCollection, productoData);
      Swal.fire("¡Éxito!", "Producto agregado correctamente", "success");
    }

    cerrarModalProducto();
    loadProductsByCategory();
    limpiarFormulario(); // Limpia el formulario después de guardar

  } catch (error) {
    console.error("Error al guardar:", error);
    Swal.fire("Error", "Hubo un problema al guardar el producto", "error");
  }
}

function limpiarFormulario() {
  document.getElementById('productoId').value = ''; // Limpia el ID oculto
  document.getElementById('nombre').value = '';
  document.getElementById('descripcion').value = '';
  document.getElementById('precio').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('imagen').value = '';
  document.getElementById('categoria').value = '';
}

async function loadProductsByCategory() {
  try {
    const querySnapshot = await getDocs(productCollection);
    document.getElementById("jabones-carousel").innerHTML = '';
    document.getElementById("cremas-carousel").innerHTML = '';
    document.getElementById("unguentos-carousel").innerHTML = '';

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productCard = `
      <div class="card p-6 bg-white shadow-lg rounded-lg w-[400px] flex flex-col transition-all hover:shadow-xl m-4 flex-1">
        <div class="flex flex-col flex-1">
          <img src="${product.image}" alt="${product.name}" class="h-48 w-full object-cover mb-4 rounded">
          <h3 class="font-bold text-xl mb-2 break-words line-clamp-2">${product.name}</h3>
          <p class="text-sm mb-2 break-words line-clamp-3">${product.description}</p>
          <div class="mt-auto">
            <p class="text-green-600 font-semibold text-lg">$${product.price}</p>
            <p class="text-gray-500">Stock: ${product.stock}</p>
            <p class="text-gray-500">Categoría: ${product.category}</p>
            <p class="text-gray-500">Estado: ${product.status}</p>
          </div>
        </div>
        <div class="mt-4 flex space-x-2 justify-center">
          <button onclick="editarProducto('${doc.id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Editar
          </button>
          <button onclick="eliminarProducto('${doc.id}')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Eliminar
          </button>
        </div>
      </div>
    `;
    
    
    
    

      if (product.category === 'jabon') {
        document.getElementById("jabones-carousel").innerHTML += productCard;
      } else if (product.category === 'crema') {
        document.getElementById("cremas-carousel").innerHTML += productCard;
      } else if (product.category === 'unguento') {
        document.getElementById("unguentos-carousel").innerHTML += productCard;
      }
    });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    Swal.fire("Error", "No se pudieron cargar los productos", "error");
  }
}

window.addEventListener('DOMContentLoaded', loadProductsByCategory);

function scrollCarousel(carouselId, direction) {
  const carousel = document.getElementById(carouselId);
  const scrollAmount = 300;
  if (direction === 'left') {
    carousel.scrollLeft -= scrollAmount;
  } else {
    carousel.scrollLeft += scrollAmount;
  }
}

function abrirModalProducto() {
  document.getElementById("modalAgregarProducto").classList.remove("hidden");
}

function cerrarModalProducto() {
  document.getElementById("modalAgregarProducto").classList.add("hidden");
  limpiarFormulario();
}

async function editarProducto(id) {
  const productoRef = doc(db, "products", id);
  const productoSnap = await getDoc(productoRef);

  if (productoSnap.exists()) {
    const prod = productoSnap.data();
    document.getElementById('productoId').value = id;
    document.getElementById('nombre').value = prod.name;
    document.getElementById('descripcion').value = prod.description;
    document.getElementById('precio').value = prod.price;
    document.getElementById('stock').value = prod.stock;
    document.getElementById('imagen').value = prod.image;
    document.getElementById('categoria').value = prod.category;

    abrirModalProducto();
  } else {
    Swal.fire("Error", "El producto no existe.", "error");
  }
}

async function actualizarProducto(event) {
  event.preventDefault();
  const id = document.getElementById('productoId').value;
  const productoRef = doc(db, "products", id);

  const productoActualizado = {
    name: document.getElementById('nombre').value,
    description: document.getElementById('descripcion').value,
    price: parseFloat(document.getElementById('precio').value),
    stock: parseInt(document.getElementById('stock').value),
    image: document.getElementById('imagen').value,
    category: document.getElementById('categoria').value
  };

  try {
    await updateDoc(productoRef, productoActualizado);
    cerrarModalProducto();
    loadProductsByCategory();
    Swal.fire("Éxito", "Producto actualizado correctamente.", "success");
  } catch (error) {
    console.error("Error al actualizar:", error);
    Swal.fire("Error", "No se pudo actualizar el producto.", "error");
  }
}

async function eliminarProducto(id) {
  try {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "products", id));
      loadProductsByCategory();
      Swal.fire("Éxito", "Producto eliminado correctamente.", "success");
    }
  } catch (error) {
    console.error("Error al eliminar:", error);
    Swal.fire("Error", "No se pudo eliminar el producto.", "error");
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadProductsByCategory(); // Load the carousels
  
  const formProducto = document.getElementById('formProducto');
  if (formProducto) {
    formProducto.addEventListener('submit', guardarProducto);
  }

  const btnAgregarProducto = document.getElementById("btnAgregarProducto");
  if (btnAgregarProducto) {
    btnAgregarProducto.onclick = abrirModalProducto;
  }
});

// Window exports
window.scrollCarousel = scrollCarousel;
window.eliminarProducto = eliminarProducto;
window.loadProductsByCategory = loadProductsByCategory;
window.editarProducto = editarProducto;
window.actualizarProducto = actualizarProducto;
window.abrirModalProducto = abrirModalProducto;
window.cerrarModalProducto = cerrarModalProducto;
window.guardarProducto = guardarProducto;
