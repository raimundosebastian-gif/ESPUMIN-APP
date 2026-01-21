document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const inputUsuario = document.getElementById("usuario");
  const inputClave = document.getElementById("clave");
  const errorBox = document.getElementById("loginError");

  if (!form || !inputUsuario || !inputClave) {
    console.error("Error: login.html no coincide con login.js");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = inputUsuario.value.trim();
    const clave = inputClave.value.trim();

    // Validación básica
    if (usuario === "" || clave === "") {
      mostrarError("Ingrese usuario y contraseña");
      return;
    }

    // roles.js debe definir un array llamado "usuarios"
    if (!Array.isArray(usuarios)) {
      mostrarError("Error interno: roles no cargados");
      return;
    }

    // Buscar usuario
    const user = usuarios.find(
      (u) => u.usuario === usuario && u.clave === clave,
    );

    if (!user) {
      mostrarError("Usuario o contraseña incorrectos");
      return;
    }

    // Guardar usuario en localStorage
    localStorage.setItem("usuario", user.usuario);
    localStorage.setItem("rol", user.rol);

    // Redirigir al dashboard
    window.location.href = "dashboard.html";
  });

  function mostrarError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  }
});
