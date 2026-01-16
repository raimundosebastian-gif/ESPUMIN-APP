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

        // Usamos el login centralizado del core
        const acceso = login(usuario, clave);

        if (!acceso) {
            alert("Usuario o clave incorrectos");
            return;
        }

        // Redirección al dashboard
        window.location.href = "dashboard.html";
    });
});
