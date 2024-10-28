// Services/products.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA88irhXWXt-wa52Ov-4XSMm9XS-8QKgsk",
  authDomain: "naturquimiaessentials.firebaseapp.com",
  projectId: "naturquimiaessentials",
  storageBucket: "naturquimiaessentials.appspot.com",
  messagingSenderId: "954679723428",
  appId: "1:954679723428:web:f5601bac82a6a73d176d31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productsCollection = collection(db, 'products');

// Load products by category
async function loadProducts(category) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = ''; // Clear the current product list

  // Query products by category
  const q = query(productsCollection, where('category', '==', category));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const product = { id: doc.id, ...doc.data() };
    displayProduct(product);
  });
}

// Display a single product
function displayProduct(product) {
  const productList = document.getElementById('product-list');
  const productCard = document.createElement('div');
  productCard.className = 'bg-white p-4 rounded shadow-md';
  productCard.innerHTML = `
    <h2 class="text-lg font-bold">${product.name}</h2>
    <p>${product.description}</p>
    <p>Precio: $${product.price}</p>
    <button class="edit-product bg-blue-500 text-white px-2 py-1 rounded" data-id="${product.id}">Modificar</button>
    <button class="delete-product bg-red-500 text-white px-2 py-1 rounded" data-id="${product.id}">Eliminar</button>
  `;
  productList.appendChild(productCard);
}

// Add product
document.getElementById('add-product').addEventListener('click', async () => {
  const name = prompt('Ingrese el nombre del producto:');
  const description = prompt('Ingrese la descripción del producto:');
  const price = parseFloat(prompt('Ingrese el precio del producto:'));
  const category = prompt('Ingrese la categoría del producto (jabones, cremas, ungentos):');

  if (name && description && !isNaN(price) && category) {
    await addDoc(productsCollection, {
      name,
      description,
      price,
      category, // Save category in Firestore
      createdAt: new Date()
    });
    loadProducts(category); // Refresh the product list for the selected category
  } else {
    alert('Por favor, complete todos los campos correctamente.');
  }
});

// Edit product
document.getElementById('product-list').addEventListener('click', async (event) => {
  if (event.target.classList.contains('edit-product')) {
    const id = event.target.getAttribute('data-id');
    const name = prompt('Ingrese el nuevo nombre del producto:');
    const description = prompt('Ingrese la nueva descripción del producto:');
    const price = parseFloat(prompt('Ingrese el nuevo precio del producto:'));
    const category = prompt('Ingrese la nueva categoría del producto (jabones, cremas, ungentos):');

    if (name && description && !isNaN(price) && category) {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        name,
        description,
        price,
        category // Update category in Firestore
      });
      loadProducts(category); // Refresh the product list for the selected category
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }
});

// Delete product
document.getElementById('product-list').addEventListener('click', async (event) => {
  if (event.target.classList.contains('delete-product')) {
    const id = event.target.getAttribute('data-id');

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás recuperar este producto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, 'products', id));
      loadProducts(event.target.closest('.product-card').dataset.category); // Refresh the product list
    }
  }
});

// Load products on page load (default to the first category)
window.onload = () => loadProducts('jabones'); // Cargar productos de la primera categoría por defecto

// Handle category button clicks
document.querySelectorAll('.category-btn').forEach(button => {
  button.addEventListener('click', (event) => {
    const category = event.target.getAttribute('data-category');
    loadProducts(category); // Load products for the selected category
  });
});