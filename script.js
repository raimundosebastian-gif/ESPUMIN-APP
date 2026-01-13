// LOGIN
function loginEmpleado() {
    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("password").value.trim();
    const error = document.getElementById("login-error");

    const empleados = [
        { usuario: "admin", password: "1234", rol: "admin" },
        { usuario: "empleado1", password: "abcd", rol: "empleado" }
    ];

    const encontrado = empleados.find(e => e.usuario === user && e.password === pass);

    if (encontrado) {
        localStorage.setItem("usuario", encontrado.usuario);
        localStorage.setItem("rol", encontrado.rol);
        window.location.href = "menu.html";
    } else {
        error.style.display = "block";
    }
}



// VERIFICAR SESIÓN
function verificarSesion() {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
        window.location.href = "index.html";
    }
}



// PERMISOS
function aplicarPermisos() {
    const rol = localStorage.getItem("rol");

    if (rol === "empleado") {
        document.querySelectorAll(".solo-admin").forEach(el => {
            el.style.display = "none";
        });
    }
}



// CERRAR SESIÓN
function cerrarSesion() {
    localStorage.clear();
    window.location.href = "index.html";
}



// =========================
// CRUD CLIENTES
// =========================

function obtenerClientes() {
    return JSON.parse(localStorage.getItem("clientes") || "[]");
}

function guardarListaClientes(lista) {
    localStorage.setItem("clientes", JSON.stringify(lista));
}

function guardarCliente() {
    const nombre = document.getElementById("cliente-nombre").value.trim();
    const telefono = document.getElementById("cliente-telefono").value.trim();

    if (!nombre) {
        alert("El nombre es obligatorio");
        return;
    }

    const lista = obtenerClientes();

    lista.push({
        id: Date.now(),
        nombre,
        telefono
    });

    guardarListaClientes(lista);

    document.getElementById("cliente-nombre").value = "";
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
            <strong>${cliente.nombre}</strong> - ${cliente.telefono || "Sin teléfono"}
            <button onclick="eliminarCliente(${cliente.id})">Eliminar</button>
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



// =========================
// CRUD PRODUCTOS
// =========================

function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos") || "[]");
}

function guardarListaProductos(lista) {
    localStorage.setItem("productos", JSON.stringify(lista));
}

function guardarProducto() {
    const nombre = document.getElementById("prod-nombre").value.trim();
    const precio = document.getElementById("prod-precio").value.trim();

    if (!nombre || !precio) {
        alert("Nombre y precio son obligatorios");
        return;
    }

    const lista = obtenerProductos();

    lista.push({
        id: Date.now(),
        nombre,
        precio: Number(precio)
    });

    guardarListaProductos(lista);

    document.getElementById("prod-nombre").value = "";
    document.getElementById("prod-precio").value = "";

    mostrarProductos();
}

function mostrarProductos() {
    const lista = obtenerProductos();
    const contenedor = document.getElementById("lista-productos");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    lista.forEach(prod => {
        const div = document.createElement("div");
        div.style.margin = "10px 0";
        div.innerHTML = `
            <strong>${prod.nombre}</strong> - $${prod.precio}
            <button onclick="eliminarProducto(${prod.id})">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });
}

function eliminarProducto(id) {
    let lista = obtenerProductos();
    lista = lista.filter(p => p.id !== id);
    guardarListaProductos(lista);
    mostrarProductos();
}
