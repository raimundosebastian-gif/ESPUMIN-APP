# Módulo Ventas — ESPUMIN ERP

El módulo de Ventas gestiona pedidos, clientes y reportes comerciales.  
Es un módulo clave para el flujo operativo, ya que conecta la demanda del cliente con la disponibilidad de productos y la planificación interna.

---

## 📂 Estructura del módulo

ventas/
├── ventas-listado.html
├── ventas-nuevo.html
├── ventas-editar.html
├── ventas-reportes.html
└── readme-ventas.md

---

## 🧩 Submódulos incluidos

### 1. Listado

Visualización de todos los pedidos registrados, con filtros y acciones rápidas.

### 2. Nuevo

Alta de pedidos, selección de cliente, productos, cantidades y condiciones comerciales.

### 3. Editar

Modificación de pedidos existentes antes de su facturación o entrega.

### 4. Reportes

Análisis de ventas por cliente, por período, por producto y por tendencia.

---

## 🎨 Estándares visuales

- Sidebar dinámico
- Header con saludo y avatar
- Estilos corporativos unificados
- Formularios `.form` y `.form-group`
- Tablas `.table`
- Tarjetas `.report-card`

---

## 🔧 Estándares técnicos

- HTML modular
- Rutas relativas limpias
- Independencia total del resto de módulos
- Preparado para backend (IDs y estructura lista)
- Sin dependencias cruzadas
- Compatible conceptualmente con Inventario y Clientes

---

## ✔️ Estado del módulo

---

## 📌 Notas de integración

- Se relaciona conceptualmente con Inventario (egresos de stock)
- Se relaciona con Clientes (datos comerciales)
- Puede integrarse con Logística en módulos futuros
- No tiene dependencias técnicas directas

---

## 🏷 Versión

Versión: 1.0  
Autor: Meñarg SAS
