# Módulo Finanzas — ESPUMIN ERP

El módulo Finanzas centraliza la gestión económica del sistema: pagos, cobranzas, caja diaria y reportes financieros.  
Permite controlar el flujo de dinero, analizar resultados y mantener la salud financiera del negocio.

---

## 📂 Estructura del módulo

finanzas/
├── finanzas-cuentas-pagar.html
├── finanzas-cuentas-cobrar.html
├── finanzas-caja.html
├── finanzas-reportes.html
└── readme-finanzas.md

---

## 🧩 Submódulos incluidos

### 1. Cuentas por Pagar

Gestión de obligaciones con proveedores, vencimientos, estados y pagos.

### 2. Cuentas por Cobrar

Control de facturación a clientes, cobranzas, vencimientos y seguimiento.

### 3. Caja

Movimientos diarios de ingresos y egresos, con resumen del día.

### 4. Reportes

Indicadores financieros, KPIs, análisis mensual y resultados netos.

---

## 🎨 Estándares visuales

- Sidebar corporativo
- Header con saludo y avatar
- Tablas `.table`
- Tarjetas `.report-card`
- Botones `.btn` y `.btn-small`
- Estilos unificados con el resto del ERP
- Rutas relativas limpias

---

## 🔧 Estándares técnicos

- HTML modular
- Preparado para backend (IDs consistentes, estructura lista para API)
- Tablas listas para carga dinámica
- Independencia total del resto de módulos
- Compatible con reportes globales del ERP

---

## ✔️ Estado del módulo

[✔] Cuentas por Pagar
[✔] Cuentas por Cobrar
[✔] Caja
[✔] Reportes
[✔] Integración con sidebar
[✔] Integración con header
[✔] Estilos unificados
[✔] Datos de ejemplo en todas las pantallas

---

## 📌 Notas de integración

- Se relaciona con Ventas (cobranzas)
- Se relaciona con Compras (pagos)
- Se integra con Dashboard para KPIs globales
- Preparado para backend en la próxima versión

---

## 🏷 Versión

Versión: 1.1  
Autor: Meñarg SAS
