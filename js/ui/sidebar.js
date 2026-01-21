// Manejo de apertura y cierre de grupos del sidebar
document.querySelectorAll(".group-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const group = btn.parentElement;
    group.classList.toggle("group-open");
  });
});
