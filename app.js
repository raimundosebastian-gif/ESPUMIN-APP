// --- Navegación entre vistas ---
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".main-nav button");
  const views = document.querySelectorAll(".view");
// =========================
// CLIENTES
// =========================

function cargarClientesEnTabla() {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const tbody = document.querySelector("#tabla-clientes tbody");
  tbody.innerHTML = "";

  clientes.forEach(cli => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cli.nombre}</td>
      <td>${cli.telefono || ""}</td>
      <td>${cli.direccion || ""}</td>
      <td>
        <button onclick="editarCliente('${cli.id}')">Editar</button>
        <button onclick="eliminarCliente('${cli.id}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function cargarClientesEnSelects() {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const selectOrden = document.getElementById("orden-cliente");
  const selectReporte = document.getElementById("reporte-cliente");

  selectOrden.innerHTML = "";
  selectReporte.innerHTML = `<option value="">Todos</option>`;

  clientes.forEach(cli => {
    const opt1 = document.createElement("option");
    opt1.value = cli.id;
    opt1.textContent = cli.nombre;
    selectOrden.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = cli.id;
    opt2.textContent = cli.nombre;
    selectReporte.appendChild(opt2);
  });
}

function guardarCliente(e) {
  e.preventDefault();

  const id = document.getElementById("cliente-id").value;
  const nombre = document.getElementById("cliente-nombre").value.trim();
  const telefono = document.getElementById("cliente-telefono").value.trim();
  const direccion = document.getElementById("cliente-direccion").value.trim();

  let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  if (id) {
    // editar
    clientes = clientes.map(c =>
      c.id === id ? { ...c, nombre, telefono, direccion } : c
    );
  } else {
    // nuevo
    clientes.push({
      id: generarId(),
      nombre,
      telefono,
      direccion
    });
  }

  localStorage.setItem("clientes", JSON.stringify(clientes));
  limpiarFormularioCliente();
  cargarClientesEnTabla();
  cargarClientesEnSelects();
}

function editarCliente(id) {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const cli = clientes.find(c => c.id === id);
  if (!cli) return;

  document.getElementById("cliente-id").value = cli.id;
  document.getElementById("cliente-nombre").value = cli.nombre;
  document.getElementById("cliente-telefono").value = cli.telefono;
  document.getElementById("cliente-direccion").value = cli.direccion;
}

function eliminarCliente(id) {
  let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  clientes = clientes.filter(c => c.id !== id);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  cargarClientesEnTabla();
  cargarClientesEnSelects();
}

function limpiarFormularioCliente() {
  document.getElementById("cliente-id").value = "";
  document.getElementById("cliente-nombre").value = "";
  document.getElementById("cliente-telefono").value = "";
  document.getElementById("cliente-direccion").value = "";
}
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


