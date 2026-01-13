/* ============================================================
   📌 UTILIDADES LOCALSTORAGE
============================================================ */

function obtenerClientes() {
  return JSON.parse(localStorage.getItem("clientes")) || [];
}

function guardarClientes(lista) {
  localStorage.setItem("clientes", JSON.stringify(lista));
}


/* ============================================================
   📌 RENDERIZAR TABLA
============================================================ */

function renderClientes(filtro = "") {
  const clientes = obtenerClientes();
  const tbody = document.getElementById("listaClientes");
  tbody.innerHTML = "";

  const listaFiltrada = clientes.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  listaFiltrada.forEach(cliente => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${cliente.nombre}</td>
      <td>${cliente.telefono}</td>
      <td>${cliente.direccion}</td>
      <td>${cliente.email}</td>
      <td>${cliente.tipo}</td>
      <td>${cliente.cuit || "-"}</td>
      <td>
        <button onclick="editarCliente(${cliente.id})" class="btn-editar">Editar</button>
        <button onclick="eliminarCliente(${cliente.id})" class="btn-eliminar">Eliminar</button>
      </td>
    `;

    tbody.appendChild(fila);
  });
}


/* ============================================================
   📌 AGREGAR CLIENTE
============================================================ */

document.getElementById("formCliente").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreCliente").value.trim();
  const telefono = document.getElementById("telefonoCliente").value.trim();
  const direccion = document.getElementById("direccionCliente").value.trim();
  const email = document.getElementById("emailCliente").value.trim();
  const tipo = document.getElementById("tipoCliente").value;
  const cuit = document.getElementById("cuitCliente").value.trim();
  const obs = document.getElementById("obsCliente").value.trim();

  if (telefono.length !== 10 || isNaN(telefono)) {
    alert("El teléfono debe tener 10 dígitos numéricos.");
    return;
  }

  if (cuit !== "" && isNaN(cuit)) {
    alert("El CUIT debe ser numérico.");
    return;
  }

  const clientes = obtenerClientes();

  const nuevoCliente = {
    id: Date.now(),
    nombre,
    telefono,
    direccion,
    email,
    tipo,
    cuit,
    observaciones: obs
  };

  clientes.push(nuevoCliente);
  guardarClientes(clientes);

  this.reset();
  renderClientes();
});


/* ============================================================
   📌 ELIMINAR CLIENTE
============================================================ */

function eliminarCliente(id) {
  if (!confirm("¿Eliminar este cliente?")) return;

  let clientes = obtenerClientes();
  clientes = clientes.filter(c => c.id !== id);
  guardarClientes(clientes);
  renderClientes();
}


/* ============================================================
   📌 EDITAR CLIENTE
============================================================ */

function editarCliente(id) {
  const clientes = obtenerClientes();
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) return;

  const nuevoNombre = prompt("Nuevo nombre:", cliente.nombre);
  const nuevoTelefono = prompt("Nuevo teléfono (10 dígitos):", cliente.telefono);
  const nuevaDireccion = prompt("Nueva dirección:", cliente.direccion);
  const nuevoEmail = prompt("Nuevo email:", cliente.email);
  const nuevoTipo = prompt("Nuevo tipo (Particular/Empresa):", cliente.tipo);
  const nuevoCuit = prompt("Nuevo CUIT:", cliente.cuit);
  const nuevasObs = prompt("Observaciones:", cliente.observaciones);

  if (nuevoTelefono.length !== 10 || isNaN(nuevoTelefono)) {
    alert("El teléfono debe tener 10 dígitos numéricos.");
    return;
  }

  if (nuevoCuit !== "" && isNaN(nuevoCuit)) {
    alert("El CUIT debe ser numérico.");
    return;
  }

  cliente.nombre = nuevoNombre;
  cliente.telefono = nuevoTelefono;
  cliente.direccion = nuevaDireccion;
  cliente.email = nuevoEmail;
  cliente.tipo = nuevoTipo;
  cliente.cuit = nuevoCuit;
  cliente.observaciones = nuevasObs;

  guardarClientes(clientes);
  renderClientes();
}


/* ============================================================
   📌 BUSCADOR
============================================================ */

document.getElementById("buscarCliente").addEventListener("input", function () {
  renderClientes(this.value);
});


/* ============================================================
   📌 ORDENAR POR NOMBRE
============================================================ */

let ordenAsc = true;

function ordenarPorNombre() {
  const clientes = obtenerClientes();

  clientes.sort((a, b) => {
    if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) return ordenAsc ? -1 : 1;
    if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return ordenAsc ? 1 : -1;
    return 0;
  });

  ordenAsc = !ordenAsc;

  guardarClientes(clientes);
  renderClientes();
}


/* ============================================================
   📌 BORRAR TODO
============================================================ */

function borrarTodo() {
  if (!confirm("¿Seguro que desea borrar TODOS los clientes?")) return;
  localStorage.removeItem("clientes");
  renderClientes();
}


/* ============================================================
   📌 EXPORTAR A EXCEL (CSV)
============================================================ */

function exportarClientes() {
  const clientes = obtenerClientes();
  if (clientes.length === 0) {
    alert("No hay clientes para exportar.");
    return;
  }

  let csv = "Nombre,Telefono,Direccion,Email,Tipo,CUIT,Observaciones\n";

  clientes.forEach(c => {
    csv += `${c.nombre},${c.telefono},${c.direccion},${c.email},${c.tipo},${c.cuit},${c.observaciones}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "clientes.csv";
  a.click();

  URL.revokeObjectURL(url);
}


/* ============================================================
   📌 INICIALIZAR
============================================================ */

document.addEventListener("DOMContentLoaded", renderClientes);
