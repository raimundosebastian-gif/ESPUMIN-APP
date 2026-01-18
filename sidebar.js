document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("sidebarToggle");
  const closeBtn = document.getElementById("closeSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const groups = document.querySelectorAll(".sidebar-group");

  /* ============================
     ABRIR SIDEBAR
  ============================ */
  toggleBtn?.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("visible");
  });

  /* ============================
     CERRAR SIDEBAR
  ============================ */
  const closeSidebar = () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("visible");
  };

  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);

  /* ============================
     CERRAR AL HACER CLIC EN ENLACE
  ============================ */
  document.querySelectorAll(".sidebar-links a").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  /* ============================
     GRUPOS PLEGABLES
  ============================ */
  groups.forEach((group) => {
    const btn = group.querySelector(".group-btn");
    btn.addEventListener("click", () => {
      group.classList.toggle("group-open");
    });
  });
});
