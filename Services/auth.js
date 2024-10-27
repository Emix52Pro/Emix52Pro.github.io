// Importa las funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA88irhXWXt-wa52Ov-4XSMm9XS-8QKgsk",
    authDomain: "naturquimiaessentials.firebaseapp.com",
    projectId: "naturquimiaessentials",
    storageBucket: "naturquimiaessentials.appspot.com",
    messagingSenderId: "954679723428",
    appId: "1:954679723428:web:f5601bac82a6a73d176d31"
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Registro con correo y contraseña
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita la recarga de la página
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert("¡Registro exitoso!");
    window.location.href = "index.html"; // Redirige al usuario a la página principal
  } catch (error) {
    console.error("Error al registrar:", error); // Muestra el error en consola para depurar
    alert(`Error: ${error.message}`);
  }
});

// Registro con Google
const googleRegister = document.getElementById("googleRegister");
googleRegister.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    alert("¡Registro exitoso con Google!");
    window.location.href = "index.html"; // Redirige al usuario a la página principal
  } catch (error) {
    console.error("Error en Google Sign-In:", error); // Muestra el error en consola para depurar
    alert(`Error: ${error.message}`);
  }
});
console.log("Firebase app initialized:", app);

