// --- EMPLEADOS ---

let empleados = JSON.parse(localStorage.getItem("empleados")) || [];
let editIndexEmpleado = null;

// Render inicial
renderEmpleados();

// Búsqueda en vivo
document.getElementById("buscarEmpleado").addEventListener("input", function() {
  const texto = this.value.toLowerCase();

  const filtrados = empleados.filter(emp =>
    emp.nombre.toLowerCase().includes(texto) ||
    emp.telefono.includes(texto) ||
    emp.email.toLowerCase().includes(texto) ||
    emp.rol.toLowerCase().includes(texto) ||
    emp.estado.toLowerCase().includes(texto)
  );

  renderEmpleados(filtrados);
});

// Submit del formulario
document.getElementById("formEmpleado").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreEmpleado").value.trim();
  const telefono = document.getElementById("telefonoEmpleado").value.trim();
  const email = document.getElementById("emailEmpleado").value.trim();
  const rol = document.getElementById("rolEmpleado").value;
  const estado = document.getElementById("estadoEmpleado").value;
  const obs = document.getElementById("obsEmpleado").value.trim();

  // Validación: campos obligatorios
  if (nombre === "" || telefono === "" || email === "" || rol === "" || estado === "") {
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
  const duplicado = empleados.some((emp, idx) =>
    (emp.nombre.toLowerCase() === nombre.toLowerCase() ||
     emp.email.toLowerCase() === email.toLowerCase()) &&
    idx !== editIndexEmpleado
  );

  if (duplicado) {
    alert("El empleado ya existe (nombre o email duplicado)");
    return;
  }

  // Fecha de alta automática
  const fechaAlta = new Date().toLocaleDateString("es-AR");

  // MODO EDITAR
  if (editIndexEmpleado !== null) {
    empleados[editIndexEmpleado] = {
      ...empleados[editIndexEmpleado],
      nombre,
      telefono,
      email,
      rol,
      estado,
      obs
    };

    editIndexEmpleado = null;
    document.querySelector("#formEmpleado button").textContent = "Agregar Empleado";
  } 
  // MODO AGREGAR
  else {
    empleados.push({
      nombre,
      telefono,
      email,
      rol,
      estado,
      obs,
      alta: fechaAlta
    });
  }

  guardarEmpleados();
  renderEmpleados();
  this.reset();
});

// Guardar en localStorage
function guardarEmpleados() {
  localStorage.setItem("empleados", JSON.stringify(empleados));
}

// Renderizar tabla
function renderEmpleados(lista = empleados) {
  const tbody = document.getElementById("listaEmpleados");
  tbody.innerHTML = "";

  lista.forEach((emp, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${emp.nombre}</td>
      <td>${emp.telefono}</td>
      <td>${emp.email}</td>
      <td>${emp.rol}</td>
      <td>${emp.estado}</td>
      <td>${emp.alta}</td>
      <td>
        <button class="btn-editar" onclick="editarEmpleado(${index})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarEmpleado(${index})">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Editar empleado
function editarEmpleado(i) {
  const emp = empleados[i];

  document.getElementById("nombreEmpleado").value = emp.nombre;
  document.getElementById("telefonoEmpleado").value = emp.telefono;
  document.getElementById("emailEmpleado").value = emp.email;
  document.getElementById("rolEmpleado").value = emp.rol;
  document.getElementById("estadoEmpleado").value = emp.estado;
  document.getElementById("obsEmpleado").value = emp.obs;

  editIndexEmpleado = i;

  document.querySelector("#formEmpleado button").textContent = "Guardar Cambios";
}

// Eliminar empleado
function eliminarEmpleado(i) {
  if (!confirm("¿Seguro que deseas eliminar este empleado?")) return;

  empleados.splice(i, 1);
  guardarEmpleados();
  renderEmpleados();
}

// Ordenar por nombre
function ordenarPorNombreEmpleado() {
  empleados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  guardarEmpleados();
  renderEmpleados();
}

// Exportar a CSV
function exportarEmpleados() {
  if (empleados.length === 0) {
    alert("No hay empleados para exportar");
    return;
  }

  let csv = "Nombre,Telefono,Email,Rol,Estado,Alta,Observaciones\n";

  empleados.forEach(e => {
    csv += `${e.nombre},${e.telefono},${e.email},${e.rol},${e.estado},${e.alta},${e.obs}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "empleados.csv";
  a.click();

  URL.revokeObjectURL(url);
}

// Borrar todos
function borrarTodosEmpleados() {
  if (!confirm("¿Seguro que deseas borrar TODOS los empleados?")) return;

  empleados = [];
  guardarEmpleados();
  renderEmpleados();
}


