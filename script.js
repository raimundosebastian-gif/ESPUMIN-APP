// =========================
// LOGIN Y SESIÓN
// =========================

const empleados = [
    { usuario: "admin", password: "1234", rol: "admin" },
    { usuario: "empleado1", password: "abcd", rol: "empleado" },
    { usuario: "EU", password: "villatita", rol: "admin" }
];

function iniciarSesion() {
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    const encontrado = empleados.find(e => e.usuario === usuario && e.password === password);

    if (!encontrado) {
        alert("Usuario o contraseña incorrectos");
        return;
    }

    localStorage.setItem("usuario", encontrado.usuario);
    localStorage.setItem("rol", encontrado.rol);

    location.href = "menu.html";
}

function verificarSesion() {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) location.href = "index.html";
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    location.href = "index.html";
}

function aplicarPermisos() {
    const rol = localStorage.getItem("rol");
    const adminElements = document.querySelectorAll(".solo-admin");
    const empleadoElements = document.querySelectorAll(".solo-empleado");

    if (rol === "admin") {
        adminElements.forEach(e => e.style.display = "block");
        empleadoElements.forEach(e => e.style.display = "none");
    } else {
        adminElements.forEach(e => e.style.display = "none");
        empleadoElements.forEach(e => e.style.display = "block");
    }
}



// =========================
// CLIENTES - DATOS INICIALES
// =========================

if (!localStorage.getItem("clientes")) {
    const clientesEjemplo = [
        { id: Date.now(), nombre: "Juan", apellido: "Pérez", telefono: "1145678901" },
        { id: Date.now() + 1, nombre: "María", apellido: "López", telefono: "1178901234" }
    ];
    localStorage.setItem("clientes", JSON.stringify(clientesEjemplo));
}



// =========================
// CRUD CLIENTES
// =========================

function obtenerClientes() {
    const lista = JSON.parse(localStorage.getItem("clientes") || "[]");

    return lista.sort((a, b) => {
        const ap = a.apellido.localeCompare(b.apellido);
        return ap !== 0 ? ap : a.nombre.localeCompare(b.nombre);
    });
}

function guardarListaClientes(lista) {
    localStorage.setItem("clientes", JSON.stringify(lista));
}

function normalizarTexto(txt) {
    txt = txt.trim().toLowerCase();
    return txt.charAt(0).toUpperCase() + txt.slice(1);
}

function guardarCliente() {
    const nombre = normalizarTexto(document.getElementById("cliente-nombre").value);
    const apellido = normalizarTexto(document.getElementById("cliente-apellido").value);
    const telefono = document.getElementById("cliente-telefono").value.trim();

    if (!nombre || !apellido) {
        alert("Nombre y apellido son obligatorios");
        return;
    }

    if (!/^\d{10}$/.test(telefono)) {
        alert("El teléfono debe tener exactamente 10 dígitos numéricos");
        return;
    }

    const lista = obtenerClientes();
    const editId = Number(localStorage.getItem("clienteEditando"));

    const telefonoRepetido = lista.some(c => c.telefono === telefono && c.id !== editId);
    if (telefonoRepetido) {
        alert("El teléfono ya está registrado en otro cliente");
        return;
    }

    if (editId) {
        const cliente = lista.find(c => c.id === editId);
        cliente.nombre = nombre;
        cliente.apellido = apellido;
        cliente.telefono = telefono;

        localStorage.removeItem("clienteEditando");
    } else {
        lista.push({
            id: Date.now(),
            nombre,
            apellido,
            telefono
        });
    }

    guardarListaClientes(lista);

    document.getElementById("cliente-nombre").value = "";
    document.getElementById("cliente-apellido").value = "";
    document.getElementById("cliente-telefono").value = "";

    mostrarClientes();
}

function mostrarClientes() {
    const lista = obtenerClientes();
    const contenedor = document.getElementById("lista-clientes");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    lista.forEach(cliente => {
        const div = document.createElement("div");
        div.style.margin = "10px 0";
        div.innerHTML = `
            <strong>${cliente.apellido}, ${cliente.nombre}</strong> - ${cliente.telefono}

            <button onclick="editarCliente(${cliente.id})"
                style="margin-left:10px; padding:5px 10px; background:white; color:#0275d8; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">
                EDITAR
            </button>

            <button onclick="eliminarCliente(${cliente.id})"
                style="margin-left:10px; padding:5px 10px; background:white; color:#d9534f; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">
                ELIMINAR
            </button>
        `;
        contenedor.appendChild(div);
    });
}

function eliminarCliente(id) {
    let lista = obtenerClientes();
    lista = lista.filter(c => c.id !== id);
    guardarListaClientes(lista);
    mostrarClientes();
}

function editarCliente(id) {
    const lista = obtenerClientes();
    const cliente = lista.find(c => c.id === id);

    if (!cliente) return;

    document.getElementById("cliente-nombre").value = cliente.nombre;
    document.getElementById("cliente-apellido").value = cliente.apellido;
    document.getElementById("cliente-telefono").value = cliente.telefono;

    localStorage.setItem("clienteEditando", id);
}



// =========================
// PRODUCTOS / VENTAS / REPORTES / HISTORIAL / DASHBOARD
// (todo lo demás queda igual que ya tenías)
// =========================
