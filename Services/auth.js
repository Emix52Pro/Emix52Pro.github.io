// Importa las funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
if (registerForm) {
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
}

// Registro con Google
const googleRegister = document.getElementById("googleRegister");
if (googleRegister) {
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
}

// Inicio de sesión
const loginForm = document.getElementById('loginForm');
const googleLoginBtn = document.getElementById('googleLogin');
const userEmailDisplay = document.getElementById('user-email');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value; 
        const password = document.getElementById('loginPassword').value; 

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            userEmailDisplay.textContent = `Bienvenido, ${user.email}`;
            Swal.fire('¡Éxito!', 'Has iniciado sesión correctamente.', 'success').then(() => {
                window.location.href = "index.html"; // Redirecciona a index.html
            });
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    });
}

// Inicio de sesión con Google
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            userEmailDisplay.textContent = `Bienvenido, ${user.displayName}`;
            Swal.fire('¡Éxito!', 'Has iniciado sesión con Google.', 'success').then(() => {
                window.location.href = "index.html"; // Redirecciona a index.html
            });
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    });
}

onAuthStateChanged(auth, (user) => {
    const profileMenu = document.getElementById("profile-menu");

    if (user) {
        profileMenu.innerHTML = `
            <div class="block px-4 py-2 text-yellow-500 break-words min-w-[200px]">
                Usuario: ${user.email}
            </div>
            <button id="logoutBtn" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                Cerrar Sesión
            </button>
        `;

        document.getElementById("logoutBtn").addEventListener("click", async () => {
            await signOut(auth);
            window.location.href = "index.html";
        });
    } else {
        profileMenu.innerHTML = `
            <a href="login.html" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Iniciar Sesión</a>
            <a href="register.html" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Registrarse</a>
        `;
    }
});




