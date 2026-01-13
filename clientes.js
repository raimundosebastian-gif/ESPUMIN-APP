/* ============================================================
   📌 VARIABLES Y LOCALSTORAGE
============================================================ */

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let editIndex = null;


/* ============================================================
   📌 RENDER INICIAL
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderClientes();
});


/* ============================================================
   📌 BUSCADOR EN VIVO
============================================================ */

document.getElementById("buscarCliente").addEventListener("input", function () {
  const texto = this.value.toLowerCase();

  const filtrados = clientes.filter(cli =>
    cli.nombre.toLowerCase().includes(texto) ||
    cli.telefono.includes(texto) ||
    (cli.direccion || "").toLowerCase().includes(texto) ||
    (cli.email || "").toLowerCase().includes(texto) ||
    (cli.tipo || "").toLowerCase().includes(texto) ||
    (cli.cuit || "").includes(texto)
  );

  renderClientes(filtrados);
});


/* ============================================================
   📌 SUBMIT DEL FORMULARIO
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

  // Validación básica
  if (nombre === "" || telefono === "" || tipo === "") {
    alert("Completar los campos obligatorios.");
    return;
  }

  // Teléfono: 10 dígitos
  if (!/^[0-9]{10}$/.test(telefono)) {
    alert("El teléfono debe tener exactamente 10 dígitos.");
    return;
  }

  // CUIT opcional pero numérico
  if (cuit !== "" && isNaN(cuit)) {
    alert("El CUIT debe ser numérico.");
    return;
  }

  // Duplicados
  const duplicado = clientes.some((cli, idx) =>
    (cli.nombre.toLowerCase() === nombre.toLowerCase() ||
     cli.telefono === telefono) &&
    idx !== editIndex
  );

  if (duplicado) {
    alert("El cliente ya existe (nombre o teléfono duplicado).");
    return;
  }

  const fechaAlta = new Date().toLocaleDateString("es-AR");

  // MODO EDITAR
  if (editIndex !== null) {
    clientes[editIndex] = {
      ...clientes[editIndex],
      nombre,
      telefono,
      direccion,
      email,
      tipo,
      cuit,
      obs
    };

    editIndex = null;
    document.querySelector("#formCliente button").textContent = "Agregar Cliente";
  }

  // MODO AGREGAR
  else {
    clientes.push({
      nombre,
      telefono,
      direccion,
      email,
      tipo,
      cuit,
      obs,
      alta: fechaAlta
    });
  }

  guardarClientes();
  renderClientes();
  this.reset();
});


/* ============================================================
   📌 GUARDAR EN LOCALSTORAGE
============================================================ */

function guardarClientes() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}


/* ============================================================
   📌 RENDERIZAR TABLA
============================================================ */

function renderClientes(lista = clientes) {
  const tbody = document.getElementById("listaClientes");
  tbody.innerHTML = "";

  lista.forEach((cli, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${cli.nombre}</td>
      <td>${cli.telefono}</td>
      <td>${cli.direccion || "-"}</td>
      <td>${cli.email || "-"}</td>
      <td>${cli.tipo}</td>
      <td>${cli.cuit || "-"}</td>
      <td>
        <button class="btn-editar" onclick="editarCliente(${index})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarCliente(${index})">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}


/* ============================================================
   📌 EDITAR CLIENTE
============================================================ */

function editarCliente(i) {
  const cli = clientes[i];

  document.getElementById("nombreCliente").value = cli.nombre;
  document.getElementById("telefonoCliente").value = cli.telefono;
  document.getElementById("direccionCliente").value = cli.direccion;
  document.getElementById("emailCliente").value = cli.email;
  document.getElementById("tipoCliente").value = cli.tipo;
  document.getElementById("cuitCliente").value = cli.cuit;
  document.getElementById("obsCliente").value = cli.obs;

  editIndex = i;

  document.querySelector("#formCliente button").textContent = "Guardar Cambios";
}


/* ============================================================
   📌 ELIMINAR CLIENTE
============================================================ */

function eliminarCliente(i) {
  if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;

  clientes.splice(i, 1);
  guardarClientes();
  renderClientes();
}


/* ============================================================
   📌 ORDENAR POR NOMBRE
============================================================ */

function ordenarPorNombre() {
  clientes.sort((a, b) => a.nombre.localeCompare(b.nombre));
  guardarClientes();
  renderClientes();
}


/* ============================================================
   📌 EXPORTAR CSV
============================================================ */

function exportarClientes() {
  if (clientes.length === 0) {
    alert("No hay clientes para exportar.");
    return;
  }

  let csv = "Nombre,Telefono,Direccion,Email,Tipo,CUIT,Alta,Observaciones\n";

  clientes.forEach(c => {
    csv += `${c.nombre},${c.telefono},${c.direccion},${c.email},${c.tipo},${c.cuit},${c.alta},${c.obs}\n`;
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
   📌 BORRAR TODO
============================================================ */

function borrarTodo() {
  if (!confirm("¿Seguro que deseas borrar TODOS los clientes?")) return;

  clientes = [];
  guardarClientes();
  renderClientes();
}
