const sidebar = document.getElementById("sidebar");
const toggle = document.getElementById("sidebarToggle");
const closeBtn = document.getElementById("closeSidebar");
const overlay = document.getElementById("sidebarOverlay");

toggle.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("visible");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("visible");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("visible");
});
