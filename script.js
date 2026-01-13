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



// VERIFICAR SESIÓN EN CUALQUIER PÁGINA
function verificarSesion() {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
        window.location.href = "index.html";
    }
}



// PERMISOS POR ROL
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
