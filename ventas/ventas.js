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

// Las demás funciones se completarán en la siguiente etapa
