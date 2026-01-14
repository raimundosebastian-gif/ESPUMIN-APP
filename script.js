/* ============================================================
   UTILIDADES GENERALES
============================================================ */
function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/* ============================================================
   CREAR ADMIN POR DEFECTO (EU / villatita)
============================================================ */
(function crearAdminPorDefecto() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.some(u => u.usuario === "EU");

    if (!existe) {
        usuarios.push({
            nombre: "Administrador",
            apellido: "Principal",
            usuario: "EU",
            password: "villatita",
            rol: "admin"
        });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
})();

/* ============================================================
   LOGIN
============================================================ */
function iniciarSesion() {
    const usuario = document.getElementById("login-usuario").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!usuario || !password) {
        alert("Completa usuario y contraseña.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const encontrado = usuarios.find(u => u.usuario === usuario && u.password === password);

    if (!encontrado) {
        alert("Usuario o contraseña incorrectos.");
        return;
    }

    localStorage.setItem("loggedUser", encontrado.usuario);
    localStorage.setItem("userRole", encontrado.rol);

    window.location.href = "menu.html";
}

/* ============================================================
   CONTROL DE SESIÓN Y MENÚ
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("loggedUser");
    const rol = localStorage.getItem("userRole");

    const span = document.getElementById("usuario-log");
    if (span && usuario) span.textContent = usuario;

    if (window.location.pathname.includes("menu.html")) {
        if (!usuario) {
            location.href = "index.html";
            return;
        }

        if (rol !== "admin") {
            ["btn-usuarios", "btn-reportes", "btn-backups"].forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.style.display = "none";
            });
        }
    }
});

function cerrarSesion() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole");
    location.href = "index.html";
}

/* ============================================================
   NAVEGACIÓN GENERAL
============================================================ */
function irAMenu() { window.location.href = "menu.html"; }
function irAClientes() { window.location.href = "clientes.html"; }
function irAProductos() { window.location.href = "productos.html"; }
function irAPrecios() { window.location.href = "precios.html"; }
function irAVentas() { window.location.href = "ventas.html"; }
function irAUsuarios() { window.location.href = "usuarios.html"; }
function irAReportes() { window.location.href = "reportes.html"; }
function irABackups() { window.location.href = "backups.html"; }

/* ============================================================
   CLIENTES
============================================================ */
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

    document.getElementById("cliente-nombre").value = "";
    document.getElementById("cliente-apellido").value = "";
    document.getElementById("cliente-telefono").value = "";

    mostrarClientes();
}

function mostrarClientes() {
    const cont = document.getElementById("lista-clientes");
    if (!cont) return;

    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    if (clientes.length === 0) {
        cont.innerHTML = "<p>No hay clientes cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Acciones</th></tr>
    `;

    clientes.forEach((c, i) => {
        html += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
                <td>
                    <button onclick="editarCliente(${i})">Editar</button>
                    <button onclick="eliminarCliente(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function buscarClientes() {
    const texto = document.getElementById("buscar-cliente").value.toLowerCase();
    const cont = document.getElementById("lista-clientes");
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    const filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(texto) ||
        c.apellido.toLowerCase().includes(texto) ||
        c.telefono.includes(texto)
    );

    if (filtrados.length === 0) {
        cont.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr><th>Nombre</th><th>Apellido</th><th>Teléfono</th><th>Acciones</th></tr>
    `;

    filtrados.forEach((c, i) => {
        html += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
                <td>
                    <button onclick="editarCliente(${i})">Editar</button>
                    <button onclick="eliminarCliente(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function eliminarCliente(i) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    if (!confirm("¿Eliminar este cliente?")) return;

    clientes.splice(i, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));
    mostrarClientes();
}

function editarCliente(i) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const c = clientes[i];

    const nombre = prompt("Nuevo nombre:", c.nombre);
    const apellido = prompt("Nuevo apellido:", c.apellido);
    const telefono = prompt("Nuevo teléfono:", c.telefono);

    if (!nombre || !apellido || telefono.length !== 10) {
        alert("Datos inválidos.");
        return;
    }

    clientes[i] = {
        nombre: capitalizar(nombre),
        apellido: capitalizar(apellido),
        telefono
    };

    localStorage.setItem("clientes", JSON.stringify(clientes));
    mostrarClientes();
}

/* ============================================================
   USUARIOS
============================================================ */
function guardarUsuario() {
    const nombre = document.getElementById("usuario-nombre").value.trim();
    const apellido = document.getElementById("usuario-apellido").value.trim();
    const usuario = document.getElementById("usuario-usuario").value.trim();
    const password = document.getElementById("usuario-password").value.trim();
    const rol = document.getElementById("usuario-rol").value;

    if (!nombre || !apellido || !usuario || !password || !rol) {
        alert("Completa todos los campos.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.some(u => u.usuario === usuario)) {
        alert("El usuario ya existe.");
        return;
    }

    usuarios.push({
        nombre: capitalizar(nombre),
        apellido: capitalizar(apellido),
        usuario,
        password,
        rol
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarUsuarios();
}

function mostrarUsuarios() {
    const cont = document.getElementById("lista-usuarios");
    if (!cont) return;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.length === 0) {
        cont.innerHTML = "<p>No hay usuarios cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr><th>Nombre</th><th>Apellido</th><th>Usuario</th><th>Rol</th><th>Acciones</th></tr>
    `;

    usuarios.forEach((u, i) => {
        html += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.usuario}</td>
                <td>${u.rol}</td>
                <td>
                    <button onclick="editarUsuario(${i})">Editar</button>
                    <button onclick="eliminarUsuario(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function buscarUsuarios() {
    const texto = document.getElementById("buscar-usuario").value.toLowerCase();
    const cont = document.getElementById("lista-usuarios");
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const filtrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(texto) ||
        u.apellido.toLowerCase().includes(texto) ||
        u.usuario.toLowerCase().includes(texto) ||
        u.rol.toLowerCase().includes(texto)
    );

    if (filtrados.length === 0) {
        cont.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr><th>Nombre</th><th>Apellido</th><th>Usuario</th><th>Rol</th><th>Acciones</th></tr>
    `;

    filtrados.forEach((u, i) => {
        html += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.usuario}</td>
                <td>${u.rol}</td>
                <td>
                    <button onclick="editarUsuario(${i})">Editar</button>
                    <button onclick="eliminarUsuario(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function eliminarUsuario(i) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (!confirm("¿Eliminar este usuario?")) return;

    usuarios.splice(i, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarUsuarios();
}

function editarUsuario(i) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const u = usuarios[i];

    const nombre = prompt("Nuevo nombre:", u.nombre);
    const apellido = prompt("Nuevo apellido:", u.apellido);
    const usuario = prompt("Nuevo usuario:", u.usuario);
    const rol = prompt("Nuevo rol (admin/empleado):", u.rol);

    if (!nombre || !apellido || !usuario || !rol) {
        alert("Datos inválidos.");
        return;
    }

    usuarios[i] = {
        nombre: capitalizar(nombre),
        apellido: capitalizar(apellido),
        usuario,
        password: u.password,
        rol
    };

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarUsuarios();
}

/* ============================================================
   PRODUCTOS
============================================================ */
function guardarProducto() {
    const nombre = document.getElementById("producto-nombre").value.trim();
    const descripcion = document.getElementById("producto-descripcion").value.trim();
    const precio = parseFloat(document.getElementById("producto-precio").value.trim());
    const stock = parseInt(document.getElementById("producto-stock").value.trim());

    if (!nombre || !descripcion || isNaN(precio) || isNaN(stock)) {
        alert("Completa todos los campos.");
        return;
    }

    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos.push({
        nombre: capitalizar(nombre),
        descripcion,
        precio,
        stock
    });

    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
}

function mostrarProductos() {
    const cont = document.getElementById("lista-productos");
    if (!cont) return;

    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    if (productos.length === 0) {
        cont.innerHTML = "<p>No hay productos cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
    `;

    productos.forEach((p, i) => {
        html += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button onclick="editarProducto(${i})">Editar</button>
                    <button onclick="eliminarProducto(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function buscarProductos() {
    const texto = document.getElementById("buscar-producto").value.toLowerCase();
    const cont = document.getElementById("lista-productos");
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
    );

    if (filtrados.length === 0) {
        cont.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
    `;

    filtrados.forEach((p, i) => {
        html += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button onclick="editarProducto(${i})">Editar</button>
                    <button onclick="eliminarProducto(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function eliminarProducto(i) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    if (!confirm("¿Eliminar este producto?")) return;

    productos.splice(i, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
}

function editarProducto(i) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const p = productos[i];

    const nombre = prompt("Nuevo nombre:", p.nombre);
    const descripcion = prompt("Nueva descripción:", p.descripcion);
    const precio = parseFloat(prompt("Nuevo precio:", p.precio));
    const stock = parseInt(prompt("Nuevo stock:", p.stock));

    if (!nombre || !descripcion || isNaN(precio) || isNaN(stock)) {
        alert("Datos inválidos.");
        return;
    }

    productos[i] = {
        nombre: capitalizar(nombre),
        descripcion,
        precio,
        stock
    };

    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
}

/* ============================================================
   PRECIOS
============================================================ */
function guardarPrecio() {
    const producto = document.getElementById("precio-producto").value.trim();
    const costo = parseFloat(document.getElementById("precio-costo").value.trim());
    const venta = parseFloat(document.getElementById("precio-venta").value.trim());

    if (!producto || isNaN(costo) || isNaN(venta)) {
        alert("Completa todos los campos.");
        return;
    }

    const precios = JSON.parse(localStorage.getItem("precios")) || [];

    precios.push({
        producto: capitalizar(producto),
        costo,
        venta
    });

    localStorage.setItem("precios", JSON.stringify(precios));
    mostrarPrecios();
}

function mostrarPrecios() {
    const cont = document.getElementById("lista-precios");
    if (!cont) return;

    const precios = JSON.parse(localStorage.getItem("precios")) || [];

    if (precios.length === 0) {
        cont.innerHTML = "<p>No hay precios cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr><th>Producto</th><th>Costo</th><th>Venta</th><th>Acciones</th></tr>
    `;

    precios.forEach((p, i) => {
        html += `
            <tr>
                <td>${p.producto}</td>
                <td>$${p.costo.toFixed(2)}</td>
                <td>$${p.venta.toFixed(2)}</td>
                <td>
                    <button onclick="editarPrecio(${i})">Editar</button>
                    <button onclick="eliminarPrecio(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function buscarPrecios() {
    const texto = document.getElementById("buscar-precio").value.toLowerCase();
    const
