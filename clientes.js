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
    cli.telefono.includes(texto)
  );

  renderClientes(filtrados);
});

// Submit del formulario
document.getElementById("formCliente").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreCliente").value.trim();
  const telefono = document.getElementById("telefonoCliente").value.trim();

  // Validación: campos vacíos
  if (nombre === "" || telefono === "") {
    alert("Completar por favor para poder continuar");
    return;
  }

  // Validación: teléfono debe tener exactamente 10 dígitos
  const soloNumeros = /^[0-9]{10}$/;
  if (!soloNumeros.test(telefono)) {
    alert("El teléfono debe tener exactamente 10 dígitos");
    return;
  }

  // Validación duplicados (excepto el que se está editando)
  const duplicado = clientes.some((cli, idx) =>
    (cli.nombre.toLowerCase() === nombre.toLowerCase() ||
     cli.telefono === telefono) &&
    idx !== editIndex
  );

  if (duplicado) {
    alert("El cliente ya existe (nombre o teléfono duplicado)");
    return;
  }

  // MODO EDITAR
  if (editIndex !== null) {
    clientes[editIndex].nombre = nombre;
    clientes[editIndex].telefono = telefono;

    editIndex = null;
    document.querySelector("#formCliente button").textContent = "Agregar Cliente";
  } 
  // MODO AGREGAR
  else {
    clientes.push({ nombre, telefono });
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

  let csv = "Nombre,Telefono\n";

  clientes.forEach(c => {
    csv += `${c.nombre},${c.telefono}\n`;
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
