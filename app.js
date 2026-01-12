// Inserta el header.html en cada página
fetch("header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-container").innerHTML = html;
  });
