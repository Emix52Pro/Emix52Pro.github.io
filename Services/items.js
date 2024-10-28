import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA88irhXWXt-wa52Ov-4XSMm9XS-8QKgsk",
  authDomain: "naturquimiaessentials.firebaseapp.com",
  projectId: "naturquimiaessentials",
  storageBucket: "naturquimiaessentials.appspot.com",
  messagingSenderId: "954679723428",
  appId: "1:954679723428:web:f5601bac82a6a73d176d31"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const productsCollection = collection(db, 'products');

// Verificar autenticación y cargar productos
let isAuthenticated = false;
onAuthStateChanged(auth, user => {
  isAuthenticated = !!user; // True si el usuario está autenticado, false si no
  loadProducts();
});

async function loadProducts() {
  const querySnapshot = await getDocs(productsCollection);
  
  // Crear contenedores por categoría
  const categories = { jabon: [], crema: [], unguento: [] };
  
  // Clasificar productos en sus respectivas categorías
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (categories[data.category]) {
      categories[data.category].push({
        ...data,
        id: doc.id
      });
    }
  });

  // Renderizar carruseles por categoría
  renderCarousel('jabones-carousel', categories.jabon);
  renderCarousel('cremas-carousel', categories.crema);
  renderCarousel('unguentos-carousel', categories.unguento);
}

function renderCarousel(carouselId, products) {
  const carousel = document.getElementById(carouselId);
  carousel.innerHTML = '';

  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.className = 'card p-6 bg-white shadow-lg rounded-lg w-[400px] flex flex-col transition-all hover:shadow-xl m-4 flex-1';

    productCard.innerHTML = `
      <div class="flex flex-col flex-1">
        <img src="${product.image}" alt="${product.name}" class="h-48 w-full object-cover mb-4 rounded">
        <h3 class="font-bold text-xl mb-2 break-words line-clamp-2">${product.name}</h3>
        <p class="text-sm mb-2 break-words line-clamp-3">${product.description}</p>
        
        <div class="mt-auto">
          <p class="text-green-600 font-semibold text-lg">$${product.price}</p>
          <p class="text-gray-500">Stock: ${product.stock}</p>
          <p class="text-gray-500">Categoría: ${product.category}</p>
          <div class="mt-4 flex items-center gap-2">
            <input type="number" 
              id="quantity-${product.id}" 
              min="1" 
              max="${product.stock}" 
              value="1" 
              class="w-20 p-2 border rounded">
            <button class="add-to-cart-btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex-grow ${isAuthenticated ? '' : 'opacity-50 cursor-not-allowed'}">
              ${isAuthenticated ? 'Agregar al carrito' : 'Inicia sesión para comprar'}
            </button>
          </div>
        </div>
      </div>
    `;

    const addToCartButton = productCard.querySelector('.add-to-cart-btn');
    if (isAuthenticated) {
      addToCartButton.addEventListener('click', () => {
        const quantity = parseInt(productCard.querySelector(`#quantity-${product.id}`).value);
        addToCart(product, quantity);
      });
    }

    carousel.appendChild(productCard);
  });
}

function addToCart(product, quantity) {
  if (quantity > product.stock) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No puedes añadir más que el stock disponible.'
    });
    return;
  }

  if (quantity < 1) {
    Swal.fire({
      icon: 'error',
      title: 'Error', 
      text: 'La cantidad no puede ser menor a 1.'
    });
    return;
  }

  Swal.fire({
    icon: 'success',
    title: 'Producto agregado',
    text: `Se agregaron ${quantity} unidades de ${product.name} al carrito`
  });
}



// Exportar la función para ser utilizada en el HTML
export { loadProducts };
