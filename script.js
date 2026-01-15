/* ============================================================
   LOGIN ADAPTADO A index.html
============================================================ */
function iniciarSesion(event) {
    if (event) event.preventDefault();

    const usuario = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
        alert("Completa usuario y contraseña.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const encontrado = usuarios.find(u => 
        u.usuario === usuario && u.password === password
    );

    if (!encontrado) {
        alert("Usuario o contraseña incorrectos.");
        return;
    }

    localStorage.setItem("loggedUser", encontrado.usuario);
    localStorage.setItem("userRole", encontrado.rol);

    window.location.href = "menu.html";
}

/* Vincular el formulario al login */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", iniciarSesion);
    }
});

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
function iniciarSesion(event) {
    if (event) event.preventDefault();

    const usuario = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

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
    const cont = document.getElementById("lista-precios");
    const precios = JSON.parse(localStorage.getItem("precios")) || [];

    const filtrados = precios.filter(p =>
        p.producto.toLowerCase().includes(texto)
    );

    if (filtrados.length === 0) {
        cont.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr><th>Producto</th><th>Costo</th><th>Venta</th><th>Acciones</th></tr>
    `;

    filtrados.forEach((p, i) => {
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

function eliminarPrecio(i) {
    const precios = JSON.parse(localStorage.getItem("precios")) || [];
    if (!confirm("¿Eliminar este precio?")) return;

    precios.splice(i, 1);
    localStorage.setItem("precios", JSON.stringify(precios));
    mostrarPrecios();
}

function editarPrecio(i) {
    const precios = JSON.parse(localStorage.getItem("precios")) || [];
    const p = precios[i];

    const producto = prompt("Nuevo producto:", p.producto);
    const costo = parseFloat(prompt("Nuevo costo:", p.costo));
    const venta = parseFloat(prompt("Nuevo precio de venta:", p.venta));

    if (!producto || isNaN(costo) || isNaN(venta)) {
        alert("Datos inválidos.");
        return;
    }

    if (venta < costo) {
        alert("El precio de venta no puede ser menor al costo.");
        return;
    }

    precios[i] = {
        producto: capitalizar(producto),
        costo,
        venta
    };

    localStorage.setItem("precios", JSON.stringify(precios));
    mostrarPrecios();
}

/* ============================================================
   VENTAS
============================================================ */
function agregarVenta() {
    const cliente = document.getElementById("venta-cliente").value.trim();
    const producto = document.getElementById("venta-producto").value.trim();
    const cantidad = parseInt(document.getElementById("venta-cantidad").value.trim());

    if (!cliente || !producto || isNaN(cantidad) || cantidad <= 0) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const precios = JSON.parse(localStorage.getItem("precios")) || [];

    const prod = productos.find(p => p.nombre === producto);
    const precioProd = precios.find(p => p.producto === producto);

    if (!prod) {
        alert("El producto no existe.");
        return;
    }

    if (!precioProd) {
        alert("No hay precio cargado para este producto.");
        return;
    }

    if (cantidad > prod.stock) {
        alert("No hay stock suficiente.");
        return;
    }

    const total = precioProd.venta * cantidad;

    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    ventas.push({
        cliente,
        producto,
        cantidad,
        precioUnitario: precioProd.venta,
        total,
        fecha: new Date().toLocaleString()
    });

    localStorage.setItem("ventas", JSON.stringify(ventas));

    // Descontar stock
    prod.stock -= cantidad;
    localStorage.setItem("productos", JSON.stringify(productos));

    alert("Venta registrada correctamente.");

    document.getElementById("venta-cliente").value = "";
    document.getElementById("venta-producto").value = "";
    document.getElementById("venta-cantidad").value = "";

    mostrarVentas();
}

function mostrarVentas() {
    const cont = document.getElementById("lista-ventas");
    if (!cont) return;

    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    if (ventas.length === 0) {
        cont.innerHTML = "<p>No hay ventas registradas.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
    `;

    ventas.forEach((v, i) => {
        html += `
            <tr>
                <td>${v.cliente}</td>
                <td>${v.producto}</td>
                <td>${v.cantidad}</td>
                <td>$${v.precioUnitario.toFixed(2)}</td>
                <td>$${v.total.toFixed(2)}</td>
                <td>${v.fecha}</td>
                <td>
                    <button onclick="eliminarVenta(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function buscarVentas() {
    const texto = document.getElementById("buscar-venta").value.toLowerCase();
    const cont = document.getElementById("lista-ventas");
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    const filtradas = ventas.filter(v =>
        v.cliente.toLowerCase().includes(texto) ||
        v.producto.toLowerCase().includes(texto)
    );

    if (filtradas.length === 0) {
        cont.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
    `;

    filtradas.forEach((v, i) => {
        html += `
            <tr>
                <td>${v.cliente}</td>
                <td>${v.producto}</td>
                <td>${v.cantidad}</td>
                <td>$${v.precioUnitario.toFixed(2)}</td>
                <td>$${v.total.toFixed(2)}</td>
                <td>${v.fecha}</td>
                <td>
                    <button onclick="eliminarVenta(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function eliminarVenta(i) {
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const venta = ventas[i];

    if (!confirm("¿Eliminar esta venta?")) return;

    const prod = productos.find(p => p.nombre === venta.producto);
    if (prod) {
        prod.stock += venta.cantidad;
        localStorage.setItem("productos", JSON.stringify(productos));
    }

    ventas.splice(i, 1);
    localStorage.setItem("ventas", JSON.stringify(ventas));

    mostrarVentas();
}

/* ============================================================
   REPORTES
============================================================ */
function reporteClientes() {
    const cont = document.getElementById("reporte-clientes");
    if (!cont) return;

    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    if (clientes.length === 0) {
        cont.innerHTML = "<p>No hay clientes cargados.</p>";
        return;
    }

    let html = `
        <h3>Listado de Clientes</h3>
        <table>
            <tr><th>Nombre</th><th>Apellido</th><th>Teléfono</th></tr>
    `;

    clientes.forEach(c => {
        html += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.apellido}</td>
                <td>${c.telefono}</td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function reporteProductos() {
    const cont = document.getElementById("reporte-productos");
    if (!cont) return;

    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    if (productos.length === 0) {
        cont.innerHTML = "<p>No hay productos cargados.</p>";
        return;
    }

    let html = `
        <h3>Listado de Productos</h3>
        <table>
            <tr><th>Producto</th><th>Descripción</th><th>Precio</th><th>Stock</th></tr>
    `;

    productos.forEach(p => {
        html += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function reportePrecios() {
    const cont = document.getElementById("reporte-precios");
    if (!cont) return;

    const precios = JSON.parse(localStorage.getItem("precios")) || [];

    if (precios.length === 0) {
        cont.innerHTML = "<p>No hay precios cargados.</p>";
        return;
    }

    let html = `
        <h3>Listado de Precios</h3>
        <table>
            <tr><th>Producto</th><th>Costo</th><th>Venta</th></tr>
    `;

    precios.forEach(p => {
        html += `
            <tr>
                <td>${p.producto}</td>
                <td>$${p.costo.toFixed(2)}</td>
                <td>$${p.venta.toFixed(2)}</td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function reporteVentas() {
    const cont = document.getElementById("reporte-ventas");
    if (!cont) return;

    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    if (ventas.length === 0) {
        cont.innerHTML = "<p>No hay ventas registradas.</p>";
        return;
    }

    let totalGeneral = 0;

    let html = `
        <h3>Listado de Ventas</h3>
        <table>
            <tr><th>Cliente</th><th>Producto</th><th>Cantidad</th><th>Total</th><th>Fecha</th></tr>
    `;

    ventas.forEach(v => {
        totalGeneral += v.total;

        html += `
            <tr>
                <td>${v.cliente}</td>
                <td>${v.producto}</td>
                <td>${v.cantidad}</td>
                <td>$${v.total.toFixed(2)}</td>
                <td>${v.fecha}</td>
            </tr>
        `;
    });

    html += `
        </table>
        <h3>Total General: $${totalGeneral.toFixed(2)}</h3>
    `;

    cont.innerHTML = html;
}

/* ============================================================
   BACKUPS
============================================================ */
function crearBackup() {
    const fecha = new Date().toLocaleString();

    const datos = {
        clientes: JSON.parse(localStorage.getItem("clientes")) || [],
        productos: JSON.parse(localStorage.getItem("productos")) || [],
        precios: JSON.parse(localStorage.getItem("precios")) || [],
        ventas: JSON.parse(localStorage.getItem("ventas")) || [],
        usuarios: JSON.parse(localStorage.getItem("usuarios")) || []
    };

    const backups = JSON.parse(localStorage.getItem("backups")) || [];

    if (backups.length >= 10) {
        backups.shift();
    }

    backups.push({ fecha, datos });

    localStorage.setItem("backups", JSON.stringify(backups));

    alert("Backup creado correctamente.");
    mostrarBackups();
}

function mostrarBackups() {
    const cont = document.getElementById("lista-backups");
    if (!cont) return;

    const backups = JSON.parse(localStorage.getItem("backups")) || [];

    if (backups.length === 0) {
        cont.innerHTML = "<p>No hay backups creados.</p>";
        return;
    }

    let html = `
        <table>
            <tr><th>Fecha</th><th>Acciones</th></tr>
    `;

    backups.forEach((b, i) => {
        html += `
            <tr>
                <td>${b.fecha}</td>
                <td>
                    <button onclick="descargarBackup(${i})">Descargar</button>
                    <button onclick="restaurarBackup(${i})">Restaurar</button>
                    <button onclick="eliminarBackup(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    cont.innerHTML = html;
}

function descargarBackup(i) {
    const backups = JSON.parse(localStorage.getItem("backups")) || [];
    const backup = backups[i];

    const contenido = JSON.stringify(backup, null, 2);
    const blob = new Blob([contenido], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_${backup.fecha.replace(/[/ :]/g, "_")}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

function restaurarBackup(i) {
    if (!confirm("¿Restaurar este backup? Se sobrescribirán todos los datos.")) return;

    const backups = JSON.parse(localStorage.getItem("backups")) || [];
    const backup = backups[i];

    localStorage.setItem("clientes", JSON.stringify(backup.datos.clientes));
    localStorage.setItem("productos", JSON.stringify(backup.datos.productos));
    localStorage.setItem("precios", JSON.stringify(backup.datos.precios));
    localStorage.setItem("ventas", JSON.stringify(backup.datos.ventas));
    localStorage.setItem("usuarios", JSON.stringify(backup.datos.usuarios));

    alert("Backup restaurado correctamente.");
}

function eliminarBackup(i) {
    const backups = JSON.parse(localStorage.getItem("backups")) || [];
    if (!confirm("¿Eliminar este backup?")) return;

    backups.splice(i, 1);
    localStorage.setItem("backups", JSON.stringify(backups));

    mostrarBackups();
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", iniciarSesion);
    }
});








