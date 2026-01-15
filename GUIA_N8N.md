# Guía de Configuración n8n - Moto Taller

## Estado Actual
La aplicación utiliza **localStorage** como almacenamiento principal. n8n es **opcional** para sincronización en red.

---

## ⚠️ Problema Actual
Los workflows existentes en n8n tienen nodos desconectados que causan el error:
```
"Unused Respond to Webhook node found in the workflow"
```

---

## Solución Rápida (5 minutos)

### Paso 1: Eliminar workflows problemáticos
1. Ir a http://localhost:5679/workflows
2. Eliminar todos los workflows llamados "API Clientes UNIFICADO..."

### Paso 2: Crear workflow simple manualmente
1. Click en **"Create workflow"** (botón azul arriba a la derecha)
2. Agregar nodo **Webhook**:
   - Arrastra "Webhook" desde el panel izquierdo
   - Configura:
     - **HTTP Method**: `GET` y `POST` (ambos)
     - **Path**: `api/clientes`
     - **Response**: `Respond Using 'Respond to Webhook' Node`
3. Agregar nodo **Respond to Webhook**:
   - Arrastra "Respond to Webhook" al canvas
   - Configura:
     - **Respond With**: `JSON`
     - **Response Body**: 
     ```json
     [{"id":"CLI001","nombre":"Juan Demo","telefono":"099123456","modelo":"Honda CB 190R","matricula":"SBU 1234"}]
     ```
4. **CONECTAR LOS NODOS**: Arrastra una línea desde Webhook → Respond to Webhook
5. Click en **"Save"** y luego **"Publish"**
6. **Activar** el workflow con el toggle

### Paso 3: Probar
Abrir en el navegador: http://localhost:5679/webhook/api/clientes

Debería mostrar el JSON con los datos de prueba.

---

## Alternativa: Usar solo localStorage
La app funciona perfectamente sin n8n. Los datos se guardan en el navegador y puedes:
- **Exportar CSV**: Botón "CSV" en el Admin Panel
- **Importar CSV**: Botón "IMPORTAR" en el Admin Panel

---

## Contacto
Para dudas, pregunta a tu asistente de desarrollo.
