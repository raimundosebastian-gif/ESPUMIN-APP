// ============================================================
// PANEL DE CONFIGURACIÓN DE ROLES — v1.3
// ============================================================

let permisosPorRol = JSON.parse(localStorage.getItem("permisosPorRol"));

if (!permisosPorRol) {
  alert("No se encontraron permisos en el sistema");
  permisosPorRol = {};
}

const modulosDisponibles = [
  "dashboard",
  "produccion",
  "logistica",
  "inventario",
  "ventas",
  "compras",
  "rrhh",
  "configuracion",
];

const contenedor = document.getElementById("rolesContainer");

// Render dinámico
Object.keys(permisosPorRol).forEach((rol) => {
  const div = document.createElement("div");
  div.innerHTML = `<h2 style="margin-top:20px;">${rol.toUpperCase()}</h2>`;

  modulosDisponibles.forEach((mod) => {
    const checked = permisosPorRol[rol].includes(mod) ? "checked" : "";
    div.innerHTML += `
      <label style="display:block; margin:4px 0;">
        <input type="checkbox" data-rol="${rol}" data-mod="${mod}" ${checked}>
        ${mod}
      </label>
    `;
  });

  contenedor.appendChild(div);
});

// Guardar cambios
document.getElementById("guardarCambios").addEventListener("click", () => {
  const checks = document.querySelectorAll("input[type='checkbox']");
  const nuevosPermisos = {};

  // Crear estructura dinámica
  Object.keys(permisosPorRol).forEach((rol) => {
    nuevosPermisos[rol] = [];
  });

  // Cargar permisos marcados
  checks.forEach((chk) => {
    if (chk.checked) {
      nuevosPermisos[chk.dataset.rol].push(chk.dataset.mod);
    }
  });

  // Guardar matriz
  localStorage.setItem("permisosPorRol", JSON.stringify(nuevosPermisos));

  // Actualizar permisos del usuario activo
  const rolActual = localStorage.getItem("userRole");
  if (rolActual && nuevosPermisos[rolActual]) {
    localStorage.setItem(
      "userPermisos",
      JSON.stringify(nuevosPermisos[rolActual]),
    );
  }

  alert("Permisos actualizados correctamente");
});
