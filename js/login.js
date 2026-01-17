/* ============================================================
   LOGIN DEL SISTEMA ESPUMIN ERP
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("loginBtn");

    btn.addEventListener("click", () => {
        const usuario = document.getElementById("usuario").value.trim();
        const clave = document.getElementById("clave").value.trim();

        if (!usuario || !clave) {
            alert("Complete usuario y clave");
            return;
        }

        // Buscar usuario en la base local
        const usuarios = getData("usuarios");
        const u = usuarios.find(x => x.usuario === usuario && x.password === clave);

        if (!u) {
            alert("Usuario o clave incorrectos");
            return;
        }

        if (!u.activo) {
            alert("El usuario está inactivo");
            return;
        }

        // Guardar usuario actual
        localStorage.setItem("usuarioActual", JSON.stringify(u));

        // Auditoría
        registrarAuditoria("Login", "Acceso", `Usuario ${u.usuario} inició sesión`);

        // Redirección
        window.location.href = "dashboard.html";
    });
});
