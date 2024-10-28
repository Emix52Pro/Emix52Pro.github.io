import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyA88irhXWXt-wa52Ov-4XSMm9XS-8QKgsk",
  authDomain: "naturquimiaessentials.firebaseapp.com",
  projectId: "naturquimiaessentials",
  storageBucket: "naturquimiaessentials.appspot.com",
  messagingSenderId: "954679723428",
  appId: "1:954679723428:web:f5601bac82a6a73d176d31"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export function addToCart(product, quantity) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      stock: product.stock,
      image: product.image
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
}

export function getCartItems() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

export function updateCartItem(productId, newQuantity) {
  if (newQuantity <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La cantidad debe ser mayor a 0'
    });
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (newQuantity > item.stock) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Solo hay ${item.stock} unidades disponibles`
      });
      return cart;
    }
    
    item.quantity = parseInt(newQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  return cart;
}



export function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
}

export function displayCart() {
  const cartItems = getCartItems();
  const tbody = document.getElementById('cart-items');
  const summaryDiv = document.querySelector('.summary');
  
  tbody.innerHTML = '';
  let subtotal = 0;

  cartItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    tbody.innerHTML += `
      <tr class="border-t">
        <td class="p-4">${item.name}</td>
        <td class="p-4">$${item.price}</td>
        <td class="p-4">
          <input type="number" 
            value="${item.quantity}" 
            min="1" 
            max="${item.stock}"
            onchange="window.updateQuantity('${item.id}', this.value)"
            class="w-20 p-2 border rounded">
        </td>
        <td class="p-4">$${itemTotal.toFixed(2)}</td>
        <td class="p-4">
          <button onclick="window.removeItem('${item.id}')" 
            class="text-red-500 hover:text-red-700">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });

  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  summaryDiv.innerHTML = `
    <div class="flex justify-between mb-2">
      <span>Subtotal</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    <div class="flex justify-between mb-2">
      <span>IVA (15%)</span>
      <span>$${iva.toFixed(2)}</span>
    </div>
    <div class="flex justify-between font-bold text-lg">
      <span>Total</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;
}

export async function confirmPurchase() {
  const cart = getCartItems();
  if (cart.length === 0) {
    throw new Error('El carrito está vacío');
  }

  for (const item of cart) {
    const productRef = doc(db, 'products', item.id);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error(`Producto ${item.id} no encontrado`);
    }

    const currentStock = productDoc.data().stock;
    if (currentStock < item.quantity) {
      throw new Error(`Stock insuficiente para ${item.name}`);
    }

    await updateDoc(productRef, {
      stock: currentStock - item.quantity
    });
  }

  clearCart();
  return true;
}

export function clearCart() {
  localStorage.removeItem('cart');
}
