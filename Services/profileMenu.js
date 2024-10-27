import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA88irhXWXt-wa52Ov-4XSMm9XS-8QKgsk",
  authDomain: "naturquimiaessentials.firebaseapp.com",
  projectId: "naturquimiaessentials",
  storageBucket: "naturquimiaessentials.appspot.com",
  messagingSenderId: "954679723428",
  appId: "1:954679723428:web:f5601bac82a6a73d176d31"
};

const app = initializeApp(firebaseConfig);

// Lógica del menú de perfil
document.addEventListener('DOMContentLoaded', function () {
  const profileBtn = document.getElementById('profile-btn');
  const profileMenu = document.getElementById('profile-menu');

  // Toggle menu visibility
  profileBtn.addEventListener('click', function (e) {
    e.preventDefault();
    profileMenu.classList.toggle('hidden');
  });

  // Close the menu if clicked outside
  document.addEventListener('click', function (e) {
    if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.add('hidden');
    }
  });
});
