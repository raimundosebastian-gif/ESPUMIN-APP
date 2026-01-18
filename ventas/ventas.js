// =========================
// TEST DATA INICIAL
// =========================

let ventas = [
    {
        id: 1,
        fecha: "2025-01-10",
        cliente: "Juan Pérez",
        sucursal: "Centro",
        total: 12500,
        estado: "Completada",
        items: [
            { producto: "Producto A", cantidad: 2, precio: 3000 },
            { producto: "Producto B", cantidad: 1, precio: 6500 }
        ]
    },
    {
        id: 2,
        fecha: "2025-01-11",
        cliente: "María López",
        sucursal: "Norte",
        total: 8200,
        estado: "Pendiente",
        items: [
            { producto: "Producto C", cantidad: 1, precio: 8200 }
        ]
    }
];

// =========================
// FUNCIONES BASE
// =========================

function cargarMenu() {
    fetch("../menu-fragment.html")
        .then(r => r.text())
        .then(html => document.getElementById("menu-container").innerHTML = html);
}

function cargarListadoVentas() {
    const tbody = document.querySelector("#tabla-ventas tbody");
    tbody.innerHTML = "";

    ventas.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${v.id}</td>
            <td>${v.fecha}</td>
            <td>${v.cliente}</td>
            <td>${v.sucursal}</td>
            <td>$${v.total}</td>
            <td>${v.estado}</td>
            <td>
                <button onclick="verDetalle(${v.id})">Ver</button>
                <button onclick="editarVenta(${v.id})">Editar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function nuevaVenta() {
    window.location.href = "nueva-venta.html";
}

function verDetalle(id) {
    window.location.href = `detalle-venta.html?id=${id}`;
}

function editarVenta(id) {
    window.location.href = `editar-venta.html?id=${id}`;
}

// =========================
// NUEVA VENTA
// =========================

function inicializarNuevaVenta() {
    document.getElementById("fecha").value = new Date().toISOString().split("T")[0];
}

function guardarVenta() {
    const fecha = document.getElementById("fecha").value;
    const cliente = document.getElementById("cliente").value;
    const sucursal = document.getElementById("sucursal").value;
    const total = parseFloat(document.getElementById("total").value);
    const estado = document.getElementById("estado").value;

    const nuevaVenta = {
        id: ventas.length + 1,
        fecha,
        cliente,
        sucursal,
        total,
        estado,
        items: []
    };

    ventas.push(nuevaVenta);

    alert("Venta guardada correctamente");
    window.location.href = "listado-ventas.html";
}

// =========================
// EDITAR VENTA
// =========================

function cargarVentaParaEditar() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    const venta = ventas.find(v => v.id === id);
    if (!venta) {
        alert("Venta no encontrada");
        window.location.href = "listado-ventas.html";
        return;
    }

    document.getElementById("fecha").value = venta.fecha;
    document.getElementById("cliente").value = venta.cliente;
    document.getElementById("sucursal").value = venta.sucursal;
    document.getElementById("total").value = venta.total;
    document.getElementById("estado").value = venta.estado;

    localStorage.setItem("ventaEditando", id);
}

function actualizarVenta() {
    const id = parseInt(localStorage.getItem("ventaEditando"));
    const venta = ventas.find(v => v.id === id);

    if (!venta) {
        alert("Error: Venta no encontrada");
        return;
    }

    venta.fecha = document.getElementById("fecha").value;
    venta.cliente = document.getElementById("cliente").value;
    venta.sucursal = document.getElementById("sucursal").value;
    venta.total = parseFloat(document.getElementById("total").value);
    venta.estado = document.getElementById("estado").value;

    alert("Venta actualizada correctamente");
    window.location.href = "listado-ventas.html";
}

// =========================
// DETALLE DE VENTA
// =========================

function cargarDetalleVenta() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    const venta = ventas.find(v => v.id === id);

    if (!venta) {
        document.getElementById("detalle-venta").innerHTML = "<p>Venta no encontrada.</p>";
        return;
    }

    let html = `
        <p><strong>ID:</strong> ${venta.id}</p>
        <p><strong>Fecha:</strong> ${venta.fecha}</p>
        <p><strong>Cliente:</strong> ${venta.cliente}</p>
        <p><strong>Sucursal:</strong> ${venta.sucursal}</p>
        <p><strong>Total:</strong> $${venta.total}</p>
        <p><strong>Estado:</strong> ${venta.estado}</p>
        <h3>Items</h3>
    `;

    if (venta.items.length === 0) {
        html += `<p>No hay items cargados.</p>`;
    } else {
        html += `
            <table class="tabla-detalle">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
        `;

        venta.items.forEach(item => {
            html += `
                <tr>
                    <td>${item.producto}</td>
                    <td>${item.cantidad}</td>
                    <td>$${item.precio}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;
    }

    document.getElementById("detalle-venta").innerHTML = html;
}

// =========================
// DASHBOARD DE VENTAS
// =========================

function cargarDashboardVentas() {
    const hoy = new Date().toISOString().split("T")[0];
    const mesActual = new Date().toISOString().slice(0, 7);

    const ventasHoy = ventas.filter(v => v.fecha === hoy);
    const ventasMes = ventas.filter(v => v.fecha.startsWith(mesActual));

    const totalHoy = ventasHoy.reduce((acc, v) => acc + v.total, 0);
    const totalMes = ventasMes.reduce((acc, v) => acc + v.total, 0);

    const ticketPromedio = ventas.length > 0
        ? (ventas.reduce((acc, v) => acc + v.total, 0) / ventas.length).toFixed(2)
        : 0;

    document.getElementById("kpi-dia").textContent = `$${totalHoy}`;
    document.getElementById("kpi-mes").textContent = `$${totalMes}`;
    document.getElementById("kpi-ticket").textContent = `$${ticketPromedio}`;
}
