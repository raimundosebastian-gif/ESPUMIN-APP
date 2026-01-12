// =====================================
// INICIALIZACIÓN GENERAL
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  inicializarNavegacion();
  inicializarClientes();
  inicializarProductos();
  inicializarOrdenes();
  inicializarReportes();

  ensureStorageArray("clientes");
  ensureStorageArray("productos");
  ensureStorageArray("ordenes");

  cargarClientesEnTabla();
  cargarClientesEnSelects();
  cargarProductosEnTabla();
  cargarOrdenesEnTabla();
});

// Garantiza que exista un array en localStorage
function ensureStorageArray(key) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify([]));
  }
}

// Formateo de miles
function formatearPrecioMiles(valor) {
  return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Generador de IDs únicos
function generarId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

// =====================================
// NAVEGACIÓN ENTRE VISTAS
// =====================================

function inicializarNavegacion() {
  const navButtons = document.querySelectorAll(".main-nav button");
  const views = document.querySelectorAll(".view");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-view");
      views.forEach(v => v.classList.remove("active"));
      document.getElementById(`view-${target}`).classList.add("active");
    });
  });
}

// =====================================
// CLIENTES
// =====================================

function inicializarClientes() {
  document.getElementById("form-cliente").addEventListener("submit", guardarCliente);
  document.getElementById("cliente-limpiar").addEventListener("click", limpiarFormularioCliente);
  document.getElementById("cliente-busqueda").addEventListener("input", filtrarClientes);
  document.getElementById("cliente-actualizar").addEventListener("click", () => {
    cargarClientesEnTabla();
    cargarClientesEnSelects();
  });
}

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
    clientes = clientes.map(c =>
      c.id === id ? { ...c, nombre, telefono, direccion } : c
    );
  } else {
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

function filtrarClientes() {
  const texto = document.getElementById("cliente-busqueda").value.toLowerCase();
  const filas = document.querySelectorAll("#tabla-clientes tbody tr");

  filas.forEach(fila => {
    const nombre = fila.children[0].textContent.toLowerCase();
    const telefono = fila.children[1].textContent.toLowerCase();

    fila.style.display =
      nombre.includes(texto) || telefono.includes(texto)
        ? ""
        : "none";
  });
}

// =====================================
// PRODUCTOS
// =====================================

function inicializarProductos() {
  document.getElementById("form-producto").addEventListener("submit", guardarProducto);
  document.getElementById("producto-limpiar").addEventListener("click", limpiarFormularioProducto);
}

function cargarProductosEnTabla() {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const tbody = document.querySelector("#tabla-productos tbody");
  tbody.innerHTML = "";

  productos.forEach(prod => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${prod.tipo || ""}</td>
      <td class="col-precio">${formatearPrecioMiles(prod.precio)}</td>
      <td>
        <button onclick="editarProducto('${prod.id}')">Editar</button>
        <button onclick="eliminarProducto('${prod.id}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
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

// =====================================
// ORDENES
// =====================================

function inicializarOrdenes() {
  document.getElementById("form-orden").addEventListener("submit", guardarOrden);
  document.getElementById("orden-limpiar").addEventListener("click", limpiarFormularioOrden);
  document.getElementById("orden-agregar-item").addEventListener("click", agregarItemOrden);
}

function cargarOrdenesEnTabla() {
  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
  const tbody = document.querySelector("#tabla-ordenes tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  ordenes.forEach(ord => {
    const cliente = obtenerNombreCliente(ord.clienteId);
    const total = formatearPrecioMiles(ord.total || 0);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ord.fecha}</td>
      <td>${cliente}</td>
      <td>${ord.items?.length || 0}</td>
      <td>${total}</td>
      <td>${ord.estadoPago}</td>
      <td>${ord.estadoEntrega}</td>
      <td>
        <button onclick="editarOrden('${ord.id}')">Editar</button>
        <button onclick="eliminarOrden('${ord.id}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function guardarOrden(e) {
  e.preventDefault();

  const id = document.getElementById("orden-id").value;
  const clienteId = document.getElementById("orden-cliente").value;
  const fecha = document.getElementById("orden-fecha-ingreso").value;
  const estadoPago = document.getElementById("orden-estado-pago").value;
  const estadoEntrega = document.getElementById("orden-estado-entrega").value;

  if (estadoEntrega === "entregado" && estadoPago !== "pagado") {
    alert("No se puede marcar como ENTREGADO si la orden no está PAGADA.");
    return;
  }

  const total = calcularTotalOrden();
  let ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];

  if (id) {
    ordenes = ordenes.map(o =>
      o.id === id
        ? { ...o, clienteId, fecha, estadoPago, estadoEntrega, total, items: obtenerItemsDeOrden() }
        : o
    );
  } else {
    ordenes.push({
      id: generarId(),
      clienteId,
      fecha,
      estadoPago,
      estadoEntrega,
      total,
      items: obtenerItemsDeOrden()
    });
  }

  localStorage.setItem("ordenes", JSON.stringify(ordenes));
  limpiarFormularioOrden();
  cargarOrdenesEnTabla();
}

function editarOrden(id) {
  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
  const ord = ordenes.find(o => o.id === id);
  if (!ord) return;

  document.getElementById("orden-id").value = ord.id;
  document.getElementById("orden-cliente").value = ord.clienteId;
  document.getElementById("orden-fecha-ingreso").value = ord.fecha;
  document.getElementById("orden-estado-pago").value = ord.estadoPago;
  document.getElementById("orden-estado-entrega").value = ord.estadoEntrega;

  cargarItemsEnEdicion(ord.items);
}

function eliminarOrden(id) {
  let ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
  ordenes = ordenes.filter(o => o.id !== id);
  localStorage.setItem("ordenes", JSON.stringify(ordenes));
  cargarOrdenesEnTabla();
}

function limpiarFormularioOrden() {
  document.getElementById("orden-id").value = "";
  document.getElementById("orden-cliente").value = "";
  document.getElementById("orden-fecha-ingreso").value = "";
  document.getElementById("orden-estado-pago").value = "pendiente";
  document.getElementById("orden-estado-entrega").value = "no_entregado";

  document.querySelector("#tabla-items-orden tbody").innerHTML = "";
  document.getElementById("orden-total").value = "0";

  actualizarResumenOrden();
}

// =====================================
// ITEMS DINÁMICOS
// =====================================

function agregarItemOrden() {
  const tbody = document.querySelector("#tabla-items-orden tbody");
  const productos = JSON.parse(localStorage.getItem("productos")) || [];

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>
      <select class="item-producto">
        <option value="">Seleccione...</option>
        ${productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join("")}
      </select>
    </td>

    <td>
      <input type="number" class="item-cantidad" value="1" min="1">
    </td>

    <td class="item-precio">0</td>
    <td class="item-subtotal">0</td>

    <td>
      <button type="button" class="item-eliminar">X</button>
    </td>
  `;

  tbody.appendChild(tr);

  tr.querySelector(".item-producto").addEventListener("change", actualizarItem);
  tr.querySelector(".item-cantidad").addEventListener("input", actualizarItem);
  tr.querySelector(".item-eliminar").addEventListener("click", () => {
    tr.remove();
    recalcularTotalOrden();
  });

  actualizarResumenOrden();
}

function actualizarItem(e) {
  const fila = e.target.closest("tr");
  const productoId = fila.querySelector(".item-producto").value;
  const cantidad = parseInt(fila.querySelector(".item-cantidad").value);

  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const prod = productos.find(p => p.id === productoId);

  if (!prod) {
    fila.querySelector(".item-precio").textContent = "0";
    fila.querySelector(".item-subtotal").textContent = "0";
    recalcularTotalOrden();
    return;
  }

  const precio = prod.precio;
  const subtotal = precio * cantidad;

  fila.querySelector(".item-precio").textContent = formatearPrecioMiles(precio);
  fila.querySelector(".item-subtotal").textContent = formatearPrecioMiles(subtotal);

  recalcularTotalOrden();
}

function recalcularTotalOrden() {
  const filas = document.querySelectorAll("#tabla-items-orden tbody tr");
  let total = 0;

  filas.forEach(fila => {
    const subtotalTexto = fila.querySelector(".item-subtotal").textContent.replace(/\./g, "");
    total += parseInt(subtotalTexto) || 0;
  });

  document.getElementById("orden-total").value = formatearPrecioMiles(total);
  actualizarResumenOrden();
}

function actualizarResumenOrden() {
  const filas = document.querySelectorAll("#tabla-items-orden tbody tr");
  const resumen = document.getElementById("resumenOrden");

  if (filas.length === 0) {
    resumen.style.display = "none";
    return;
  }

  let total = 0;
  filas.forEach(fila => {
    const subtotalTexto = fila.querySelector(".item-subtotal").textContent.replace(/\./g, "");
    total += parseInt(subtotalTexto) || 0;
  });

  document.getElementById("totalOrden").textContent = formatearPrecioMiles(total);
  resumen.style.display = "block";
}

function obtenerItemsDeOrden() {
  const filas = document.querySelectorAll("#tabla-items-orden tbody tr");
  const items = [];

  filas.forEach(fila => {
    const productoId = fila.querySelector(".item-producto").value;
    const cantidad = parseInt(fila.querySelector(".item-cantidad").value);

    if (productoId && cantidad > 0) {
      items.push({ productoId, cantidad });
    }
  });

  return items;
}

// =====================================
// REPORTES
// =====================================

function inicializarReportes() {
  document.getElementById("reporte-aplicar").addEventListener("click", aplicarFiltrosReporte);
}

function aplicarFiltrosReporte() {
  const desde = document.getElementById("reporte-desde").value;
  const hasta = document.getElementById("reporte-hasta").value;
  const clienteId = document.getElementById("reporte-cliente").value;
  const estadoEntrega = document.getElementById("reporte-estado-entrega").value;

  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];

  const filtradas = ordenes.filter(o => {
    if (desde && o.fecha < desde) return false;
    if (hasta && o.fecha > hasta) return false;
    if (clienteId && o.clienteId !== clienteId) return false;
    if (estadoEntrega && o.estadoEntrega !== estadoEntrega) return false;
    return true;
  });

  mostrarReporte(filtradas);
}

function mostrarReporte(ordenes) {
  const resumen = document.getElementById("reporte-resumen");
  const tbody = document.querySelector("#tabla-reporte-ordenes tbody");

  resumen.innerHTML = "";
  tbody.innerHTML = "";

  let totalMonto = 0;

  ordenes.forEach(o =>
