// --- Navegación entre vistas ---
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".main-nav button");
  const views = document.querySelectorAll(".view");
// CLIENTES
document.getElementById("form-cliente").addEventListener("submit", guardarCliente);
document.getElementById("cliente-limpiar").addEventListener("click", limpiarFormularioCliente);
document.getElementById("cliente-busqueda").addEventListener("input", filtrarClientes);
document.getElementById("btn-agregar-item").addEventListener("click", agregarItemOrden);

// ORDENES
document.getElementById("form-orden").addEventListener("submit", guardarOrden);
document.getElementById("btn-agregar-item").addEventListener("click", agregarItemOrden);

cargarOrdenesEnTabla();

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
function formatearPrecioMiles(valor) {
  return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
      <td class="col-precio">${formatearPrecioMiles(prod.precio)}</td>
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

// =========================
// ORDENES
// =========================

function cargarOrdenesEnTabla() {
  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
  const tbody = document.querySelector("#tabla-ordenes tbody");
  tbody.innerHTML = "";

  ordenes.forEach(ord => {
    const cliente = obtenerNombreCliente(ord.clienteId);
    const total = formatearPrecioMiles(ord.total);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ord.id}</td>
      <td>${cliente}</td>
      <td>${ord.fecha}</td>
      <td>${ord.estadoPago}</td>
      <td>${ord.estadoEntrega}</td>
      <td class="col-precio">${total}</td>
      <td>
        <button onclick="editarOrden('${ord.id}')">Editar</button>
        <button onclick="eliminarOrden('${ord.id}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function obtenerNombreCliente(id) {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const cli = clientes.find(c => c.id === id);
  return cli ? cli.nombre : "—";
}

function guardarOrden(e) {
  e.preventDefault();

  const id = document.getElementById("orden-id").value;
  const clienteId = document.getElementById("orden-cliente").value;
  const fecha = document.getElementById("orden-fecha").value;
  const estadoPago = document.getElementById("orden-pago").value;
  const estadoEntrega = document.getElementById("orden-entrega").value;

  // Regla clave: NO entregar si no está pagado
  if (estadoEntrega === "Entregado" && estadoPago !== "Pagado") {
    alert("No se puede marcar como ENTREGADO si la orden no está PAGADA.");
    return;
  }

  // El total se calcula en el Bloque 2 (items dinámicos)
  const total = calcularTotalOrden();

  let ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];

  if (id) {
    ordenes = ordenes.map(o =>
      o.id === id
        ? { ...o, clienteId, fecha, estadoPago, estadoEntrega, total }
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
      items: obtenerItemsDeOrden() // Bloque 2
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
  document.getElementById("orden-fecha").value = ord.fecha;
  document.getElementById("orden-pago").value = ord.estadoPago;
  document.getElementById("orden-entrega").value = ord.estadoEntrega;

  // Cargar ítems
  cargarItemsEnEdicion(ord.items);
}


function cargarItemsEnEdicion(items) {
  const tbody = document.querySelector("#tabla-items-orden tbody");
  tbody.innerHTML = "";

  const productos = JSON.parse(localStorage.getItem("productos")) || [];

  items.forEach(item => {
    const tr = document.createElement("tr");

    const prod = productos.find(p => p.id === item.productoId);
    const precio = prod ? prod.precio : 0;
    const subtotal = precio * item.cantidad;

    tr.innerHTML = `
      <td>
        <select class="item-producto">
          <option value="">Seleccione...</option>
          ${productos
            .map(
              p =>
                `<option value="${p.id}" ${
                  p.id === item.productoId ? "selected" : ""
                }>${p.nombre}</option>`
            )
            .join("")}
        </select>
      </td>

      <td>
        <input type="number" class="item-cantidad" value="${item.cantidad}" min="1">
      </td>

      <td class="col-precio item-precio">${formatearPrecioMiles(precio)}</td>

      <td class="col-precio item-subtotal">${formatearPrecioMiles(subtotal)}</td>

      <td>
        <button type="button" class="item-eliminar">X</button>
      </td>
    `;

    tbody.appendChild(tr);

    // Eventos del item
    tr.querySelector(".item-producto").addEventListener("change", actualizarItem);
    tr.querySelector(".item-cantidad").addEventListener("input", actualizarItem);
    tr.querySelector(".item-eliminar").addEventListener("click", () => {
      tr.remove();
      recalcularTotalOrden();
    });
  });

  recalcularTotalOrden();
}

  // Items dinámicos se cargan en el Bloque 2
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
  document.getElementById("orden-fecha").value = "";
  document.getElementById("orden-pago").value = "Pendiente";
  document.getElementById("orden-entrega").value = "No entregado";

  // Limpiar tabla de ítems
  document.querySelector("#tabla-items-orden tbody").innerHTML = "";

  // Reiniciar total
  document.getElementById("orden-total").textContent = "0";
}


  // Items dinámicos se limpian en el Bloque 2
}

function calcularTotalOrden() {
  // Esta función se completa en el Bloque 2
  return 0;
}

function obtenerItemsDeOrden() {
  // Esta función se completa en el Bloque 2
  return [];
}
// =========================
// ORDENES - ITEMS DINÁMICOS
// =========================

function agregarItemOrden() {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const tbody = document.querySelector("#tabla-items-orden tbody");

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

    <td class="col-precio item-precio">0</td>

    <td class="col-precio item-subtotal">0</td>

    <td>
      <button type="button" class="item-eliminar">X</button>
    </td>
  `;

  tbody.appendChild(tr);

  // Eventos del item
  tr.querySelector(".item-producto").addEventListener("change", actualizarItem);
  tr.querySelector(".item-cantidad").addEventListener("input", actualizarItem);
  tr.querySelector(".item-eliminar").addEventListener("click", () => {
    tr.remove();
    recalcularTotalOrden();
  });
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
    const subtotal = parseInt(subtotalTexto) || 0;
    total += subtotal;
  });

  document.getElementById("orden-total").textContent = formatearPrecioMiles(total);
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
