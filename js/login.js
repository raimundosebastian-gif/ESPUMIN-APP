/* ============================================================
   LOGIN DEL SISTEMA ESPUMIN ERP
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const usuarioInput = document.getElementById("usuario");
    const claveInput = document.getElementById("clave");
    const recordarCheck = document.getElementById("recordar");
    const toggleClave = document.getElementById("toggleClave");
    const btn = document.getElementById("loginBtn");

    /* ============================================================
       Cargar usuario recordado
       ============================================================ */
    const recordado = localStorage.getItem("usuarioRecordado");
    if (recordado) {
        usuarioInput.value = recordado;
        recordarCheck.checked = true;
    }

    /* ============================================================
       Mostrar / ocultar contraseña
       ============================================================ */
    toggleClave.addEventListener("click", () => {
        if (claveInput.type === "password") {
            claveInput.type = "text";
            toggleClave.textContent = "Ocultar";
        } else {
            claveInput.type = "password";
            toggleClave.textContent = "Mostrar";
        }
    });

    /* ============================================================
       Login
       ============================================================ */
    btn.addEventListener("click", () => {
        const usuario = usuarioInput.value.trim();
        const clave = claveInput.value.trim();

        if (!usuario || !clave) {
            alert("Complete usuario y clave");
            return;
        }

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

        /* ============================================================
           Guardar usuario actual
           ============================================================ */
        localStorage.setItem("usuarioActual", JSON.stringify(u));

        /* ============================================================
           Recordar usuario (opcional)
           ============================================================ */
        if (recordarCheck.checked) {
            localStorage.setItem("usuarioRecordado", usuario);
        } else {
            localStorage.removeItem("usuarioRecordado");
        }

        /* ============================================================
           Auditoría
           ============================================================ */
        registrarAuditoria("Login", "Acceso", `Usuario ${u.usuario} inició sesión`);

        /* ============================================================
           Redirección
           ============================================================ */
        window.location.href = "dashboard.html";
    });
});
