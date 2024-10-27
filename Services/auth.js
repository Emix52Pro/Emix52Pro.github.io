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
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    Swal.fire({
      icon: "success",
      title: "¡Registro exitoso!",
      text: "Te has registrado correctamente.",
      confirmButtonText: "Aceptar"
    }).then(() => {
      window.location.href = "index.html";
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error en el registro",
      text: error.message,
      confirmButtonText: "Intentar de nuevo"
    });
  }
});

// Registro con Google
const googleRegister = document.getElementById("googleRegister");
googleRegister.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    Swal.fire({
      icon: "success",
      title: "¡Registro exitoso con Google!",
      text: "Te has registrado correctamente.",
      confirmButtonText: "Aceptar"
    }).then(() => {
      window.location.href = "index.html";
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error en Google Sign-In",
      text: error.message,
      confirmButtonText: "Intentar de nuevo"
    });
  }
});


