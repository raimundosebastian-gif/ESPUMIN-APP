/* ===============================
      UTILIDADES
=============================== */
function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/* ===============================
      GUARDAR CLIENTE
=============================== */
function guardarCliente() {
    const nombre = document.getElementById("cliente-nombre").value.trim();
    const apellido = document.getElementById("cliente-apellido").value.trim();
    const telefono = document.getElementById("cliente-telefono").value.trim();

    if (!nombre || !apellido || telefono.length !== 10) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    clientes.push({
        nombre: capitalizar(nombre),
        apellido: capitalizar(apellido),
        telefono
    });

    localStorage.setItem("clientes", JSON.stringify(clientes));

    alert("Cliente guardado correctamente.");

    document.getElementById("cliente-nombre").value = "";
    document.getElementById("cliente-apellido").value = "";
    document.getElementById("cliente-telefono").value = "";

    mostrarClientes();
}

/* ===============================
      MOSTRAR CLIENTES
=============================== */
function mostrarClientes() {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const contenedor = document.getElementById("lista-clientes");

    if (clientes.length === 0) {
        contenedor.innerHTML = "<p>No hay clientes cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Acciones</th>
            </tr>
    `;

    clientes.forEach((c, index) => {
        html += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarCliente(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarCliente(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      BUSCAR CLIENTES
=============================== */
function buscarClientes() {
    const texto = document.getElementById("buscar-cliente").value.toLowerCase();
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    const filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(texto) ||
        c.apellido.toLowerCase().includes(texto) ||
        c.telefono.includes(texto)
    );

    const contenedor = document.getElementById("lista-clientes");

    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Acciones</th>
            </tr>
    `;

    filtrados.forEach((c, index) => {
        html += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarCliente(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarCliente(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      ELIMINAR CLIENTE
=============================== */
function eliminarCliente(index) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    if (!confirm("¿Eliminar este cliente?")) return;

    clientes.splice(index, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));

    mostrarClientes();
}

/* ===============================
      EDITAR CLIENTE
=============================== */
function editarCliente(index) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const cliente = clientes[index];

    const nuevoNombre = prompt("Nuevo nombre:", cliente.nombre);
    const nuevoApellido = prompt("Nuevo apellido:", cliente.apellido);
    const nuevoTelefono = prompt("Nuevo teléfono (10 dígitos):", cliente.telefono);

    if (!nuevoNombre || !nuevoApellido || nuevoTelefono.length !== 10) {
        alert("Datos inválidos.");
        return;
    }

    clientes[index] = {
        nombre: capitalizar(nuevoNombre),
        apellido: capitalizar(nuevoApellido),
        telefono: nuevoTelefono
    };

    localStorage.setItem("clientes", JSON.stringify(clientes));
    mostrarClientes();
}

/* ===============================
      VOLVER AL MENÚ
=============================== */
function irAMenu() {
    window.location.href = "menu.html";
}
