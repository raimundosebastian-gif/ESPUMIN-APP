/* ============================================================
   NAVEGACIÓN
   ============================================================ */
function irAClientes() { location.href = "clientes.html"; }
function irAProductos() { location.href = "productos.html"; }
function irAPrecios() { location.href = "precios.html"; }
function irAVentas() { location.href = "ventas.html"; }
function irAUsuarios() { location.href = "usuarios.html"; }
function irAReportes() { location.href = "reportes.html"; }
function irABackups() { location.href = "backups.html"; }

/* ============================================================
   UTILIDADES DE LOCALSTORAGE
   ============================================================ */
function obtener(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}

function guardar(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/* ============================================================
   CLIENTES
   ============================================================ */
function mostrarClientes() {
    const clientes = obtener("clientes");
    const tabla = document.querySelector("#tabla-clientes tbody");
    if (!tabla) return;

    tabla.innerHTML = "";

    clientes.forEach((c, i) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${c.nombre}</td>
            <td>${c.telefono}</td>
            <td>${c.direccion}</td>
            <td>
                <button onclick="editarCliente(${i})">Editar</button>
                <button onclick="eliminarCliente(${i})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function guardarCliente() {
    const nombre = document.getElementById("cliente-nombre").value.trim();
    const telefono = document.getElementById("cliente-telefono").value.trim();
    const direccion = document.getElementById("cliente-direccion").value.trim();

    if (!nombre || !telefono || !direccion) {
        alert("Complete todos los campos.");
        return;
    }

    const clientes = obtener("clientes");
    clientes.push({ nombre, telefono, direccion });
    guardar("clientes", clientes);

    mostrarClientes();
    crearBackupInterno();
}

/* ============================================================
   PRODUCTOS
   ============================================================ */
function mostrarProductos() {
    const productos = obtener("productos");
    const tabla = document.querySelector("#tabla-productos tbody");
    if (!tabla) return;

    tabla.innerHTML = "";

    productos.forEach((p, i) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.categoria}</td>
            <td>${p.estado}</td>
            <td>
                <button onclick="editarProducto(${i})">Editar</button>
                <button onclick="eliminarProducto(${i})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function guardarProducto() {
    const nombre = document.getElementById("producto-nombre").value.trim().toUpperCase();
    const precio = parseFloat(document.getElementById("producto-precio").value);
    const categoria = document.getElementById("producto-categoria").value;
    const estado = document.getElementById("producto-estado").value;

    if (!nombre || isNaN(precio) || precio <= 0) {
        alert("Complete todos los campos correctamente.");
        return;
    }

    const productos = obtener("productos");
    productos.push({ nombre, precio, categoria, estado });
    guardar("productos", productos);

    mostrarProductos();
    crearBackupInterno();
}

/* ============================================================
   USUARIOS
   ============================================================ */
function mostrarUsuarios() {
    const usuarios = obtener("usuarios");
    const tabla = document.querySelector("#tabla-usuarios tbody");
    if (!tabla) return;

    tabla.innerHTML = "";

    usuarios.forEach((u, i) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.usuario}</td>
            <td>${u.rol}</td>
            <td>${u.estado}</td>
            <td>
                <button onclick="editarUsuario(${i})">Editar</button>
                <button onclick="eliminarUsuario(${i})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function guardarUsuario() {
    const nombre = document.getElementById("usuario-nombre").value.trim();
    const usuario = document.getElementById("usuario-usuario").value.trim();
    const clave = document.getElementById("usuario-clave").value.trim();
    const rol = document.getElementById("usuario-rol").value;
    const estado = document.getElementById("usuario-estado").value;

    if (!nombre || !usuario || !clave) {
        alert("Complete todos los campos.");
        return;
    }

    const usuarios = obtener("usuarios");
    usuarios.push({ nombre, usuario, clave, rol, estado });
    guardar("usuarios", usuarios);

    mostrarUsuarios();
    crearBackupInterno();
}

/* ============================================================
   PRECIOS
   ============================================================ */
function mostrarPrecios() {
    const productos = obtener("productos");
    const select = document.getElementById("precio-producto");
    if (!select) return;

    select.innerHTML = `<option value="">Seleccione un producto</option>`;

    productos.forEach((p, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = p.nombre;
        select.appendChild(opt);
    });
}

function guardarPrecio() {
    const idx = document.getElementById("precio-producto").value;
    const nuevo = parseFloat(document.getElementById("precio-nuevo").value);

    if (idx === "" || isNaN(nuevo) || nuevo <= 0) {
        alert("Ingrese un precio válido.");
        return;
    }

    const productos = obtener("productos");
    productos[idx].precio = nuevo;
    guardar("productos", productos);

    alert("Precio actualizado.");
    crearBackupInterno();
}

/* ============================================================
   VENTAS
   ============================================================ */
function mostrarVentas() {
    const ventas = obtener("ventas");
    const tabla = document.querySelector("#tabla-ventas tbody");
    if (!tabla) return;

    tabla.innerHTML = "";

    ventas.forEach(v => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${v.fecha}</td>
            <td>${v.cliente}</td>
            <td>${v.producto}</td>
            <td>${v.cantidad}</td>
            <td>$${v.precio}</td>
            <td>$${v.total}</td>
            <td>${v.usuario}</td>
        `;
        tabla.appendChild(fila);
    });
}

function guardarVenta() {
    const cliente = document.getElementById("venta-cliente").value;
    const producto = document.getElementById("venta-producto").value;
    const cantidad = parseInt(document.getElementById("venta-cantidad").value);

    if (!cliente || !producto || isNaN(cantidad) || cantidad <= 0) {
        alert("Complete todos los campos correctamente.");
        return;
    }

    const productos = obtener("productos");
    const precio = productos[producto].precio;

    const venta = {
        fecha: new Date().toLocaleDateString("es-AR"),
        cliente,
        producto: productos[producto].nombre,
        cantidad,
        precio,
        total: precio * cantidad,
        usuario: localStorage.getItem("loggedUser")
    };

    const ventas = obtener("ventas");
    ventas.push(venta);
    guardar("ventas", ventas);

    alert("Venta registrada.");

    document.getElementById("venta-cantidad").value = "";
    document.getElementById("venta-cliente").value = "";
    document.getElementById("venta-producto").value = "";

    mostrarVentas();
    crearBackupInterno();
}

/* ============================================================
   REPORTES AVANZADOS
   ============================================================ */
function parsearFecha(fechaStr) {
    const partes = fechaStr.split("/");
    return new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
}

/* ============================================================
   SISTEMA DE BACKUPS
   ============================================================ */
function crearBackupInterno() {
    const data = {
        clientes: obtener("clientes"),
        productos: obtener("productos"),
        usuarios: obtener("usuarios"),
        precios: obtener("precios"),
        ventas: obtener("ventas"),
        fecha: new Date().toLocaleString("es-AR")
    };

    let contador = parseInt(localStorage.getItem("backup_contador") || "0");
    contador++;
    localStorage.setItem("backup_contador", contador);

    localStorage.setItem(`backup_${contador}`, JSON.stringify(data));

    const limite = 10;
    const borrarHasta = contador - limite;

    for (let i = 1; i <= borrarHasta; i++) {
        localStorage.removeItem(`backup_${i}`);
    }
}

function backupDiario() {
    const hoy = new Date().toLocaleDateString("es-AR");
    const ultimo = localStorage.getItem("backup_diario_fecha");

    if (ultimo === hoy) return;

    crearBackupInterno();
    localStorage.setItem("backup_diario_fecha", hoy);
}

setInterval(() => {
    const ahora = new Date();
    if (ahora.getHours() === 23 && ahora.getMinutes() === 59) {
        backupDiario();
    }
}, 60000);

function descargarBackup() {
    const data = {
        clientes: obtener("clientes"),
        productos: obtener("productos"),
        usuarios: obtener("usuarios"),
        precios: obtener("precios"),
        ventas: obtener("ventas"),
        fecha: new Date().toLocaleString("es-AR")
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const f = new Date();
    a.download = `backup_ESPUMIN_${f.getFullYear()}-${f.getMonth()+1}-${f.getDate()}_${f.getHours()}-${f.getMinutes()}.json`;

    a.click();
    URL.revokeObjectURL(url);
}

async function descargarZipBackups() {
    const zip = new JSZip();
    const contador = parseInt(localStorage.getItem("backup_contador") || "0");

    for (let i = contador; i >= 1; i--) {
        const data = localStorage.getItem(`backup_${i}`);
        if (!data) continue;
        zip.file(`backup_${i}.json`, data);
    }

    const contenido = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(contenido);
    a.download = "ESPUMIN_BACKUPS.zip";
    a.click();
}

function restaurarBackup(numero) {
    const data = JSON.parse(localStorage.getItem(`backup_${numero}`) || "null");
    if (!data) {
        alert("Backup no encontrado.");
        return;
    }

    guardar("clientes", data.clientes);
    guardar("productos", data.productos);
    guardar("usuarios", data.usuarios);
    guardar("precios", data.precios);
    guardar("ventas", data.ventas);

    alert("Backup restaurado correctamente.");
    location.reload();
}

let backupSeleccionado = null;

function abrirModal(numero) {
    backupSeleccionado = numero;
    document.getElementById("modal-confirmacion").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal-confirmacion").style.display = "none";
    backupSeleccionado = null;
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-confirmar");
    if (btn) {
        btn.onclick = () => {
            if (backupSeleccionado !== null) restaurarBackup(backupSeleccionado);
            cerrarModal();
        };
    }
});

function mostrarBackups() {
    const tabla = document.querySelector("#tabla-backups tbody");
    if (!tabla) return;

    tabla.innerHTML = "";

    const contador = parseInt(localStorage.getItem("backup_contador") || "0");

    for (let i = contador; i >= 1; i--) {
        const data = JSON.parse(localStorage.getItem(`backup_${i}`) || "null");
        if (!data) continue;

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${i}</td>
            <td>${data.fecha}</td>
            <td>
                <button onclick="abrirModal(${i})" class="btn btn-azul">Restaurar</button>
                <button onclick="descargarBackupEspecifico(${i})" class="btn btn-verde">Descargar</button>
            </td>
        `;

        tabla.appendChild(fila);
    }
}

function descargarBackupEspecifico(numero) {
    const data = localStorage.getItem(`backup_${numero}`);
    if (!data) {
        alert("Backup no encontrado.");
        return;
    }

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_${numero}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

function crearBackupInterno() {
    const data = {
        clientes: JSON.parse(localStorage.getItem("clientes") || "[]"),
        productos: JSON.parse(localStorage.getItem("productos") || "[]"),
        usuarios: JSON.parse(localStorage.getItem("usuarios") || "[]"),
        precios: JSON.parse(localStorage.getItem("precios") || "[]"),
        ventas: JSON.parse(localStorage.getItem("ventas") || "[]"),
        fecha: new Date().toLocaleString("es-AR")
    };

    let contador = parseInt(localStorage.getItem("backup_contador") || "0");
    contador++;
    localStorage.setItem("backup_contador", contador);

    localStorage.setItem(`backup_${contador}`, JSON.stringify(data));

    // ⭐ Mantener solo los últimos 10
    const limite = 10;
    const borrarHasta = contador - limite;

    for (let i = 1; i <= borrarHasta; i++) {
        localStorage.removeItem(`backup_${i}`);
    }
}

function backupDiario() {
    const hoy = new Date().toLocaleDateString("es-AR");
    const ultimo = localStorage.getItem("backup_diario_fecha");

    if (ultimo === hoy) return;

    crearBackupInterno();
    localStorage.setItem("backup_diario_fecha", hoy);
}

// Ejecutar cada minuto para detectar fin de día
setInterval(() => {
    const ahora = new Date();
    if (ahora.getHours() === 23 && ahora.getMinutes() === 59) {
        backupDiario();
    }
}, 60000);

function descargarBackup() {
    const data = {
        clientes: JSON.parse(localStorage.getItem("clientes") || "[]"),
        productos: JSON.parse(localStorage.getItem("productos") || "[]"),
        usuarios: JSON.parse(localStorage.getItem("usuarios") || "[]"),
        precios: JSON.parse(localStorage.getItem("precios") || "[]"),
        ventas: JSON.parse(localStorage.getItem("ventas") || "[]"),
        fecha: new Date().toLocaleString("es-AR")
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const f = new Date();
    a.download = `backup_ESPUMIN_${f.getFullYear()}-${f.getMonth()+1}-${f.getDate()}_${f.getHours()}-${f.getMinutes()}.json`;

    a.click();
    URL.revokeObjectURL(url);
}

async function descargarZipBackups() {
    const zip = new JSZip();
    const contador = parseInt(localStorage.getItem("backup_contador") || "0");

    for (let i = contador; i >= 1; i--) {
        const data = localStorage.getItem(`backup_${i}`);
        if (!data) continue;
        zip.file(`backup_${i}.json`, data);
    }

    const contenido = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(contenido);
    a.download = "ESPUMIN_BACKUPS.zip";
    a.click();
}

async function descargarZipBackups() {
    const zip = new JSZip();
    const contador = parseInt(localStorage.getItem("backup_contador") || "0");

    for (let i = contador; i >= 1; i--) {
        const data = localStorage.getItem(`backup_${i}`);
        if (!data) continue;
        zip.file(`backup_${i}.json`, data);
    }

    const contenido = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(contenido);
    a.download = "ESPUMIN_BACKUPS.zip";
    a.click();
}

let backupSeleccionado = null;

function abrirModal(numero) {
    backupSeleccionado = numero;
    document.getElementById("modal-confirmacion").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal-confirmacion").style.display = "none";
    backupSeleccionado = null;
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-confirmar");
    if (btn) {
        btn.onclick = () => {
            if (backupSeleccionado !== null) restaurarBackup(backupSeleccionado);
            cerrarModal();
        };
    }
});

function mostrarBackups() {
    const tabla = document.querySelector("#tabla-backups tbody");
    if (!tabla) return;

    tabla.innerHTML = "";

    const contador = parseInt(localStorage.getItem("backup_contador") || "0");

    for (let i = contador; i >= 1; i--) {
        const data = JSON.parse(localStorage.getItem(`backup_${i}`) || "null");
        if (!data) continue;

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${i}</td>
            <td>${data.fecha}</td>
            <td>
                <button onclick="abrirModal(${i})" class="btn btn-azul">Restaurar</button>
                <button onclick="descargarBackupEspecifico(${i})" class="btn btn-verde">Descargar</button>
            </td>
        `;

        tabla.appendChild(fila);
    }
}

function descargarBackupEspecifico(numero) {
    const data = localStorage.getItem(`backup_${numero}`);
    if (!data) {
        alert("Backup no encontrado.");
        return;
    }

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_${numero}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

