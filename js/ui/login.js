console.log("LOGIN JS CARGADO");

import { $, log } from "../core/utils.js";
import { saveLocal } from "../core/api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = $("#loginForm");
  const userInput = $("#usuario");
  const passInput = $("#clave"); // <-- coincide con tu HTML
  const errorBox = $("#loginError");

  if (!form) {
    log("No se encontró el formulario de login.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = userInput.value.trim();
    const clave = passInput.value.trim();

    if (usuario === "" || clave === "") {
      errorBox.textContent = "Debe completar usuario y contraseña.";
      errorBox.style.display = "block";
      return;
    }

    // Guardamos el usuario en localStorage
    saveLocal("usuario", usuario);

    // Redirigimos al dashboard
    window.location.href = "dashboard.html";
  });
});
