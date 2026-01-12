// --- CLIENTES ---

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let editIndex = null;

// Render inicial
renderClientes();

// Búsqueda en vivo
document.getElementById("buscarCliente").addEventListener("input", function() {
  const texto = this.value.toLowerCase();

  const filtrados = clientes.filter(cli =>
    cli.nombre.toLowerCase().includes(texto) ||
    cli.telefono.includes(texto) ||
    cli.direccion.toLowerCase().includes(texto) ||
    cli.email.toLowerCase().includes(texto) ||
    cli.tipo.toLowerCase().includes(texto)
  );

  renderClientes(filtrados);
});

// Submit del formulario
document.getElementById("formCliente").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreCliente").value.trim();
  const telefono = document.getElementById("telefonoCliente").value.trim();
  const direccion = document.getElementById("direccionCliente").value.trim();
  const email = document.getElementById("emailCliente").value.trim();
  const tipo = document.getElementById("tipoCliente").value;
  const obs = document.getElementById("obsCliente").value.trim();

  // Validación: campos obligatorios
  if (nombre === "" || telefono === "" || tipo === "") {
    alert("Completar por favor para poder continuar");
    return;
  }

  // Validación: teléfono debe tener exactamente 10 dígitos
  const soloNumeros = /^[0-9]{10}$/;
  if (!soloNumeros.test(telefono)) {
    alert("El teléfono debe tener exactamente 10 dígitos");
    return;
  }

  // Validación duplicados (excepto el que se edita)
  const duplicado = clientes.some((cli, idx) =>
    (cli.nombre.toLowerCase() === nombre.toLowerCase() ||
     cli.telefono === telefono) &&
    idx !== editIndex
  );

  if (duplicado) {
    alert("El cliente ya existe (nombre o teléfono duplicado)");
    return;
  }

  // Fecha de alta automática
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
      obs,
      alta: fechaAlta
    });
  }

  guardarClientes();
  renderClientes();
  this.reset();
});

// Guardar en localStorage
function guardarClientes() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

// Renderizar tabla
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
      <td>${cli.alta}</td>
      <td>
        <button class="btn-editar" onclick="editarCliente(${index})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarCliente(${index})">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Editar cliente
function editarCliente(i) {
  const cli = clientes[i];

  document.getElementById("nombreCliente").value = cli.nombre;
  document.getElementById("telefonoCliente").value = cli.telefono;
  document.getElementById("direccionCliente").value = cli.direccion;
  document.getElementById("emailCliente").value = cli.email;
  document.getElementById("tipoCliente").value = cli.tipo;
  document.getElementById("obsCliente").value = cli.obs;

  editIndex = i;

  document.querySelector("#formCliente button").textContent = "Guardar Cambios";
}

// Eliminar cliente
function eliminarCliente(i) {
  if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;

  clientes.splice(i, 1);
  guardarClientes();
  renderClientes();
}

// Ordenar por nombre
function ordenarPorNombre() {
  clientes.sort((a, b) => a.nombre.localeCompare(b.nombre));
  guardarClientes();
  renderClientes();
}

// Exportar a CSV
function exportarClientes() {
  if (clientes.length === 0) {
    alert("No hay clientes para exportar");
    return;
  }

  let csv = "Nombre,Telefono,Direccion,Email,Tipo,Alta,Observaciones\n";

  clientes.forEach(c => {
    csv += `${c.nombre},${c.telefono},${c.direccion},${c.email},${c.tipo},${c.alta},${c.obs}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "clientes.csv";
  a.click();

  URL.revokeObjectURL(url);
}

// Borrar todo
function borrarTodo() {
  if (!confirm("¿Seguro que deseas borrar TODOS los clientes?")) return;

  clientes = [];
  guardarClientes();
  renderClientes();
}
