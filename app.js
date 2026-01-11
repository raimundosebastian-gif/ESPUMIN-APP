// --- Navegación entre vistas ---
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".main-nav button");
  const views = document.querySelectorAll(".view");
// CLIENTES
document.getElementById("form-cliente").addEventListener("submit", guardarCliente);
document.getElementById("cliente-limpiar").addEventListener("click", limpiarFormularioCliente);
document.getElementById("cliente-busqueda").addEventListener("input", filtrarClientes);

cargarClientesEnTabla();
cargarClientesEnSelects();
function filtrarClientes() {
  const texto = document.getElementById("cliente-busqueda").value.toLowerCase();
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const tbody = document.querySelector("#tabla-clientes tbody");

  tbody.innerHTML = "";

  clientes
    .filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      (c.telefono || "").toLowerCase().includes(texto)
    )
    .forEach(cli => {
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
// PRODUCTOS
document.getElementById("form-producto").addEventListener("submit", guardarProducto);
document.getElementById("producto-limpiar").addEventListener("click", limpiarFormularioProducto);

cargarProductosEnTabla();

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
// =========================
// PRODUCTOS
// =========================

function cargarProductosEnTabla() {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const tbody = document.querySelector("#tabla-productos tbody");
  tbody.innerHTML = "";

  productos.forEach(prod => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${prod.tipo || ""}</td>
      <td>$${prod.precio.toFixed(2)}</td>
      <td>
        <button onclick="editarProducto('${prod.id}')">Editar</button>
        <button onclick="eliminarProducto('${prod.id}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function cargarProductosEnSelectOrden() {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const cont = document.getElementById("orden-productos-container");

  // No cargamos acá porque este módulo solo llena selects cuando se agregan items
  // La función de órdenes se encargará de generar filas dinámicas
}

function guardarProducto(e) {
  e.preventDefault();

  const id = document.getElementById("producto-id").value;
  const nombre = document.getElementById("producto-nombre").value.trim();
  const precio = parseFloat(document.getElementById("producto-precio").value);
  const tipo = document.getElementById("producto-tipo").value.trim();

  let productos = JSON.parse(localStorage.getItem("productos")) || [];

  if (id) {
    productos = productos.map(p =>
      p.id === id ? { ...p, nombre, precio, tipo } : p
    );
  } else {
    productos.push({
      id: generarId(),
      nombre,
      precio,
      tipo
    });
  }

  localStorage.setItem("productos", JSON.stringify(productos));
  limpiarFormularioProducto();
  cargarProductosEnTabla();
}

function editarProducto(id) {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const prod = productos.find(p => p.id === id);
  if (!prod) return;

  document.getElementById("producto-id").value = prod.id;
  document.getElementById("producto-nombre").value = prod.nombre;
  document.getElementById("producto-precio").value = prod.precio;
  document.getElementById("producto-tipo").value = prod.tipo;
}

function eliminarProducto(id) {
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  productos = productos.filter(p => p.id !== id);
  localStorage.setItem("productos", JSON.stringify(productos));
  cargarProductosEnTabla();
}

function limpiarFormularioProducto() {
  document.getElementById("producto-id").value = "";
  document.getElementById("producto-nombre").value = "";
  document.getElementById("producto-precio").value = "";
  document.getElementById("producto-tipo").value = "";
}
