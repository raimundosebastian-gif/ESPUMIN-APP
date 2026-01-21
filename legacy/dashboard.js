document.addEventListener("DOMContentLoaded", () => {
  /* ============================
     ACORDEÓN REAL
  ============================ */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".group-btn");
    if (!btn) return;

    const group = btn.closest(".sidebar-group");

    // Cerrar todos los demás
    document.querySelectorAll(".sidebar-group").forEach((g) => {
      if (g !== group) g.classList.remove("group-open");
    });

    // Abrir/cerrar el clickeado
    group.classList.toggle("group-open");
  });

  /* ============================
     MARCAR MÓDULO ACTIVO SEGÚN URL
  ============================ */
  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".group-content a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");

      const parentGroup = link.closest(".sidebar-group");
      parentGroup.classList.add("group-open", "active");
    }
  });

  /* ============================
     HEADER: USUARIO Y AVATAR
  ============================ */
  const usuario = localStorage.getItem("usuario");

  if (usuario) {
    document.getElementById("headerUser").textContent = usuario;
    document.getElementById("headerAvatar").textContent = usuario
      .charAt(0)
      .toUpperCase();
  }

  /* ============================
     BOTÓN SALIR
  ============================ */
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
      window.location.href = "login.html";
    });
  }
});
