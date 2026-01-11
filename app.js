// --- Navegación entre vistas ---
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".main-nav button");
  const views = document.querySelectorAll(".view");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-view");
      views.forEach(v => v.classList.remove("active"));
      document.getElementById(`view-${target}`).classList.add("active");
    });
  });

  // Inicialización básica de estructuras en localStorage si no existen
  ensureStorageArray("clientes");
  ensureStorageArray("productos");
  ensureStorageArray("ordenes");

  // Más adelante: cargar tablas, combos, etc.
});

function ensureStorageArray(key) {
  const existing = localStorage.getItem(key);
  if (!existing) {
    localStorage.setItem(key, JSON.stringify([]));
  }
}

function generarId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

