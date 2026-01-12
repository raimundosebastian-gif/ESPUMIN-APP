<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Empleados</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div id="header-container"></div>

  <main class="contenedor">

    <h2>Empleados</h2>

    <!-- Búsqueda -->
    <div class="card">
      <input type="text" id="buscarEmpleado" placeholder="Buscar empleado..." class="input-buscar">
    </div>

    <!-- Formulario -->
    <div class="card">
      <h3 id="tituloFormEmpleado">Agregar Empleado</h3>

      <form id="formEmpleado" class="form form-dos-columnas">

        <!-- COLUMNA IZQUIERDA -->
        <div class="columna">
          <label>Nombre:</label>
          <input type="text" id="nombreEmpleado" required>

          <label>Teléfono (10 dígitos):</label>
          <input type="text" id="telefonoEmpleado" required>

          <label>Email (opcional):</label>
          <input type="email" id="emailEmpleado" placeholder="empleado@empresa.com">
        </div>

        <!-- COLUMNA DERECHA -->
        <div class="columna">
          <label>Tipo de empleado:</label>
          <select id="tipoEmpleado" required>
            <option value="">Seleccionar...</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Operativo">Operativo</option>
            <option value="Reparto">Reparto</option>
          </select>

          <label>Observaciones:</label>
          <textarea id="obsEmpleado"></textarea>
        </div>

        <button type="submit" class="btn-guardar">Guardar Empleado</button>
      </form>
    </div>

    <!-- Tabla -->
    <div class="card">
      <h3>Listado de Empleados</h3>

      <table class="tabla">
        <thead>
          <tr>
            <th onclick="ordenarPorNombre()" style="cursor:pointer">Nombre ⬍</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Alta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="listaEmpleados"></tbody>
      </table>

      <button onclick="exportarEmpleados()" class="btn-exportar">Exportar a Excel</button>
      <button onclick="borrarTodoEmpleados()" class="btn-borrar-todo">Borrar todos los empleados</button>
    </div>

  </main>

  <script src="app.js"></script>
  <script src="empleados.js"></script>
</body>
</html>
