// --- PRODUCTOS ---

let productos = JSON.parse(localStorage.getItem("productos")) || [];
let editIndexProducto = null;

// Render inicial
renderProductos();

// Búsqueda en vivo
document.getElementById("buscarProducto").addEventListener("input", function() {
  const texto = this.value.toLowerCase();

  const filtrados = productos.filter(prod =>
    prod.nombre.toLowerCase().includes(texto) ||
    prod.categoria.toLowerCase().includes(texto)
  );

  renderProductos(filtrados);
});

// Submit del formulario
document.getElementById("formProducto").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreProducto").value.trim();
  const categoria = document.getElementById("categoriaProducto").value;
  const precio = document.getElementById("precioProducto").value.trim();

  // Validación: campos vacíos
  if (nombre === "" || categoria === "" || precio === "") {
    alert("Completar por favor para poder continuar");
    return;
  }

  // Validación: precio numérico y mayor a 0
  if (isNaN(precio) || Number(precio) <= 0) {
    alert("El precio debe ser un número mayor a 0");
    return;
  }

  // Validación duplicados (excepto el que se edita)
  const duplicado = productos.some((prod, idx) =>
    prod.nombre.toLowerCase() === nombre.toLowerCase() &&
    prod.categoria === categoria &&
    idx !== editIndexProducto
  );

  if (duplicado) {
    alert("El producto ya existe en esa categoría");
    return;
  }

  // MODO EDITAR
  if (editIndexProducto !== null) {
    productos[editIndexProducto].nombre = nombre;
    productos[editIndexProducto].categoria = categoria;
    productos[editIndexProducto].precio = Number(precio);

    editIndexProducto = null;
    document.querySelector("#formProducto button").textContent = "Agregar Producto";
  } 
  // MODO AGREGAR
  else {
    productos.push({ nombre, categoria, precio: Number(precio) });
  }

  guardarProductos();
  renderProductos();
  this.reset();
});

// Guardar en localStorage
function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

// Renderizar tabla
function renderProductos(lista = productos) {
  const tbody = document.getElementById("listaProductos");
  tbody.innerHTML = "";

  lista.forEach((prod, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${prod.categoria}</td>
      <td>$${prod.precio.toFixed(2)}</td>
      <td>
        <button class="btn-editar" onclick="editarProducto(${index})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Editar producto
function editarProducto(i) {
  const prod = productos[i];

  document.getElementById("nombreProducto").value = prod.nombre;
  document.getElementById("categoriaProducto").value = prod.categoria;
  document.getElementById("precioProducto").value = prod.precio;

  editIndexProducto = i;

  document.querySelector("#formProducto button").textContent = "Guardar Cambios";
}

// Eliminar producto
function eliminarProducto(i) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

  productos.splice(i, 1);
  guardarProductos();
  renderProductos();
}

// Ordenar por nombre
function ordenarPorNombreProducto() {
  productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  guardarProductos();
  renderProductos();
}

// Exportar a CSV
function exportarProductos() {
  if (productos.length === 0) {
    alert("No hay productos para exportar");
    return;
  }

  let csv = "Nombre,Categoria,Precio\n";

  productos.forEach(p => {
    csv += `${p.nombre},${p.categoria},${p.precio}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "productos.csv";
  a.click();

  URL.revokeObjectURL(url);
}

// Borrar todos
function borrarTodosProductos() {
  if (!confirm("¿Seguro que deseas borrar TODOS los productos?")) return;

  productos = [];
  guardarProductos();
  renderProductos();
}
