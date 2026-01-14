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

/* ===============================
      GUARDAR USUARIO
=============================== */
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

    // Evitar duplicados
    if (usuarios.some(u => u.usuario === usuario)) {
        alert("El nombre de usuario ya existe.");
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

    alert("Usuario guardado correctamente.");

    document.getElementById("usuario-nombre").value = "";
    document.getElementById("usuario-apellido").value = "";
    document.getElementById("usuario-usuario").value = "";
    document.getElementById("usuario-password").value = "";
    document.getElementById("usuario-rol").value = "";

    mostrarUsuarios();
}

/* ===============================
      MOSTRAR USUARIOS
=============================== */
function mostrarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const contenedor = document.getElementById("lista-usuarios");

    if (usuarios.length === 0) {
        contenedor.innerHTML = "<p>No hay usuarios cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
    `;

    usuarios.forEach((u, index) => {
        html += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.usuario}</td>
                <td>${u.rol}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarUsuario(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarUsuario(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      BUSCAR USUARIOS
=============================== */
function buscarUsuarios() {
    const texto = document.getElementById("buscar-usuario").value.toLowerCase();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const filtrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(texto) ||
        u.apellido.toLowerCase().includes(texto) ||
        u.usuario.toLowerCase().includes(texto) ||
        u.rol.toLowerCase().includes(texto)
    );

    const contenedor = document.getElementById("lista-usuarios");

    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
    `;

    filtrados.forEach((u, index) => {
        html += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.usuario}</td>
                <td>${u.rol}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarUsuario(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarUsuario(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      ELIMINAR USUARIO
=============================== */
function eliminarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (!confirm("¿Eliminar este usuario?")) return;

    usuarios.splice(index, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarUsuarios();
}

/* ===============================
      EDITAR USUARIO
=============================== */
function editarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const u = usuarios[index];

    const nuevoNombre = prompt("Nuevo nombre:", u.nombre);
    const nuevoApellido = prompt("Nuevo apellido:", u.apellido);
    const nuevoUsuario = prompt("Nuevo usuario:", u.usuario);
    const nuevoRol = prompt("Nuevo rol (admin/empleado):", u.rol);

    if (!nuevoNombre || !nuevoApellido || !nuevoUsuario || !nuevoRol) {
        alert("Datos inválidos.");
        return;
    }

    usuarios[index] = {
        nombre: capitalizar(nuevoNombre),
        apellido: capitalizar(nuevoApellido),
        usuario: nuevoUsuario,
        password: u.password, // no se edita aquí
        rol: nuevoRol
    };

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarUsuarios();
}

/* ===============================
      VOLVER AL MENÚ
=============================== */
function irAMenu() {
    window.location.href = "menu.html";
}

/* ===============================
      VALIDAR SESIÓN AL ENTRAR
=============================== */
document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("loggedUser");
    const rol = localStorage.getItem("userRole");

    if (!usuario) {
        location.href = "index.html";
        return;
    }

    // Mostrar nombre del usuario
    const spanUsuario = document.getElementById("usuario-log");
    if (spanUsuario) spanUsuario.textContent = usuario;

    // Control de roles: solo admin ve Usuarios, Reportes y Backups
    if (rol !== "admin") {
        const adminButtons = [
            "btn-usuarios",
            "btn-reportes",
            "btn-backups"
        ];

        adminButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.style.display = "none";
        });
    }
});

/* ===============================
      CERRAR SESIÓN
=============================== */
function cerrarSesion() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole");
    location.href = "index.html";
}

/* ===============================
      NAVEGACIÓN DEL MENÚ
=============================== */
function irAClientes() {
    window.location.href = "clientes.html";
}

function irAProductos() {
    window.location.href = "productos.html";
}

function irAPrecios() {
    window.location.href = "precios.html";
}

function irAVentas() {
    window.location.href = "ventas.html";
}

function irAUsuarios() {
    window.location.href = "usuarios.html";
}

function irAReportes() {
    window.location.href = "reportes.html";
}

function irABackups() {
    window.location.href = "backups.html";
}

/* ===============================
      GUARDAR PRODUCTO
=============================== */
function guardarProducto() {
    const nombre = document.getElementById("producto-nombre").value.trim();
    const descripcion = document.getElementById("producto-descripcion").value.trim();
    const precio = parseFloat(document.getElementById("producto-precio").value.trim());
    const stock = parseInt(document.getElementById("producto-stock").value.trim());

    if (!nombre || !descripcion || isNaN(precio) || isNaN(stock)) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    if (precio <= 0) {
        alert("El precio debe ser mayor a 0.");
        return;
    }

    if (stock < 0) {
        alert("El stock no puede ser negativo.");
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

    alert("Producto guardado correctamente.");

    document.getElementById("producto-nombre").value = "";
    document.getElementById("producto-descripcion").value = "";
    document.getElementById("producto-precio").value = "";
    document.getElementById("producto-stock").value = "";

    mostrarProductos();
}

/* ===============================
      MOSTRAR PRODUCTOS
=============================== */
function mostrarProductos() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const contenedor = document.getElementById("lista-productos");

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos cargados.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
            </tr>
    `;

    productos.forEach((p, index) => {
        html += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarProducto(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      BUSCAR PRODUCTOS
=============================== */
function buscarProductos() {
    const texto = document.getElementById("buscar-producto").value.toLowerCase();
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
    );

    const contenedor = document.getElementById("lista-productos");

    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron coincidencias.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
            </tr>
    `;

    filtrados.forEach((p, index) => {
        html += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn-accion btn-editar" onclick="editarProducto(${index})">Editar</button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += "</table>";

    contenedor.innerHTML = html;
}

/* ===============================
      ELIMINAR PRODUCTO
=============================== */
function eliminarProducto(index) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    if (!confirm("¿Eliminar este producto?")) return;

    productos.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(productos));

    mostrarProductos();
}

/* ===============================
      EDITAR PRODUCTO
=============================== */
function editarProducto(index) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const p = productos[index];

    const nuevoNombre = prompt("Nuevo nombre:", p.nombre);
    const nuevaDescripcion = prompt("Nueva descripción:", p.descripcion);
    const nuevoPrecio = parseFloat(prompt("Nuevo precio:", p.precio));
    const nuevoStock = parseInt(prompt("Nuevo stock:", p.stock));

    if (!nuevoNombre || !nuevaDescripcion || isNaN(nuevoPrecio) || isNaN(nuevoStock)) {
        alert("Datos inválidos.");
        return;
    }

    productos[index] = {
        nombre: capitalizar(nuevoNombre),
        descripcion: nuevaDescripcion,
        precio: nuevoPrecio,
        stock: nuevoStock
    };

    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
}

/* ===============================
      VOLVER AL MENÚ
=============================== */
function irAMenu() {
    window.location.href = "menu.html";
}
