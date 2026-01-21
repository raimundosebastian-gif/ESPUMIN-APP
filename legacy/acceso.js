// ============================================================
// VERIFICACIÓN DE ACCESO DIRECTO A MÓDULOS — v1.3
// ============================================================

function verificarAcceso(moduloActual) {
  const permisosUsuario =
    JSON.parse(localStorage.getItem("userPermisos")) || [];

  if (!permisosUsuario.includes(moduloActual)) {
    alert("No tiene permisos para acceder a este módulo");
    window.location.href = "dashboard.html";
  }
}
