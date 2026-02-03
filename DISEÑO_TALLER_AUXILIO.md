# Diseño de Arquitectura - App Auxilio Mecánico

Este documento detalla la implementación técnica para la gestión de Suscripciones de Auxilio Mecánico.

## 1. Estructura de Datos (Google Sheets)

Se requieren 5 hojas (tabs) en el Google Sheet principal.

### Tabla: `Clientes`
Almacena la información de los propietarios de los vehículos.
| Columna | Tipo de Dato (AppSheet) | Detalles |
| :--- | :--- | :--- |
| `ID_Cliente` | Text / ID | **KEY**. Fórmula Inicial: `UNIQUEID()` |
| `Nombre` | Name | Nombre completo |
| `Telefono` | Phone | Formato internacional (ej: +54911...) para WhatsApp |
| `Email` | Email | Correo electrónico |
| `Fecha_Alta` | Date | Fecha de registro |

### Tabla: `Vehiculos`
Los vehículos cubiertos. Un cliente puede tener varios.
| Columna | Tipo de Dato | Detalles |
| :--- | :--- | :--- |
| `ID_Vehiculo` | Text / ID | **KEY**. Fórmula: `UNIQUEID()` |
| `ID_Cliente` | Ref | Referencia a tabla `Clientes` |
| `Marca` | Text | Ej: Ford, Toyota |
| `Modelo` | Text | Ej: Focus, Hilux |
| `Patente` | Text | Matrícula del vehículo |
| `Año` | Number | Año de fabricación |

### Tabla: `Suscripciones`
Gestiona la vigencia del servicio y los límites.
| Columna | Tipo de Dato | Detalles |
| :--- | :--- | :--- |
| `ID_Suscripcion` | Text / ID | **KEY**. Fórmula: `UNIQUEID()` |
| `ID_Cliente` | Ref | Referencia a `Clientes` |
| `ID_Vehiculo` | Ref | Referencia a `Vehiculos` |
| `Fecha_Inicio` | Date | Fecha de alta de la suscripción |
| `Fecha_Vencimiento`| Date | Fórmula sugerida: `[Fecha_Inicio] + 365` |
| `Tipo_Plan` | Enum | Valores: `Básico`, `Premium` |
| `Limite_Eventos` | Number | Valor por defecto: `3` |
| `Limite_KM_Evento` | Number | Límite gratis por viaje (ej: 100) |
| `Precio_KM_Extra` | Price | Costo por KM excedente |
| `Estado` | Enum | `Activa`, `Vencida`, `Cancelada` |

### Tabla: `Historial_Auxilios`
Registro de cada uso del servicio.
| Columna | Tipo de Dato | Detalles |
| :--- | :--- | :--- |
| `ID_Auxilio` | Text / ID | **KEY** |
| `ID_Suscripcion` | Ref | Referencia a `Suscripciones` |
| `Fecha_Evento` | DateTime | Cuándo ocurrió el auxilio |
| `KM_Recorridos` | Number | Distancia total del traslado |
| `Costo_Extra` | Price | Calculado automáticamente (ver fórmulas) |
| `Detalles` | LongText | Notas del chofer/mecánico |
| `Estado_Servicio`| Enum | `Pendiente`, `Completado` |

### Tabla: `Configuracion_Precios` (Opcional)
Tabla de una sola fila para valores globales.
| Columna | Detalles |
| :--- | :--- |
| `Precio_Global_KM` | Precio actual del KM extra |
| `Email_Admin` | Email para notificaciones internas |

---

## 2. Lógica en AppSheet

### Columnas Virtuales (En tabla `Suscripciones`)

**1. Auxilios Usados (`Auxilios_Usados`)**
Cuenta cuántos auxilios se han consumido en esta suscripción.
```excel
COUNT(SELECT(Historial_Auxilios[ID_Auxilio], [ID_Suscripcion] = [_THISROW].[ID_Suscripcion]))
```

**2. Auxilios Restantes (`Auxilios_Restantes`)**
Muestra el saldo disponible.
```excel
[Limite_Eventos] - [Auxilios_Usados]
```

**3. Estado Icono (`Estado_Semaforo`)**
Para visualización rápida (Verde/Rojo).
```excel
IF(
  AND([Fecha_Vencimiento] >= TODAY(), [Auxilios_Restantes] > 0),
  "🟢 Activo",
  "🔴 Inactivo"
)
```

### Automatización de Costos (En tabla `Historial_Auxilios`)

**Fórmula para columna `Costo_Extra` (Auto Compute -> App Formula):**
Calcula automáticamente si se cobra extra por distancia.
```excel
IF(
  [KM_Recorridos] > [Suscripcion].[Limite_KM_Evento], 
  ([KM_Recorridos] - [Suscripcion].[Limite_KM_Evento]) * [Suscripcion].[Precio_KM_Extra], 
  0
)
```
*Nota: `[Suscripcion]` es la columna Ref, permitiendo acceder a los valores del padre.*

### Vista Tipo Semáforo (UX)
1. Crear una vista **Deck** o **Table** para `Suscripciones`.
2. Ir a **Format Rules**.
3. **Regla Roja**:
   - Condición: `OR([Fecha_Vencimiento] < TODAY(), [Auxilios_Restantes] <= 0)`
   - Formato: Texto color Rojo, Icono de advertencia.
4. **Regla Verde**:
   - Condición: `AND([Fecha_Vencimiento] >= TODAY(), [Auxilios_Restantes] > 0)`
   - Formato: Texto color Verde, Icono de check.

---

## 3. Automatización con n8n (Recordatorio de Vencimiento)

### Disparador (Trigger)
Utilizaremos un **Webhook** que será llamado por AppSheet.
1. **En AppSheet**: Crear un Bot.
   - **Event**: "Recordatorio Vencimiento".
     - Type: Scheduled (Daily).
     - Condition: `[Fecha_Vencimiento] = TODAY() + 3` (3 días antes).
     - Table: `Suscripciones`.
   - **Step**: "Llamar Webhook n8n".
     - Url: (Tu URL de n8n webhook production)
     - Verb: POST
     - Body: JSON
     ```json
     {
       "id_cliente": "<<[ID_Cliente]>>",
       "nombre_cliente": "<<[ID_Cliente].[Nombre]>>",
       "telefono": "<<[ID_Cliente].[Telefono]>>",
       "patente": "<<[ID_Vehiculo].[Patente]>>",
       "fecha_vence": "<<[Fecha_Vencimiento]>>"
     }
     ```

### Flujo n8n (JSON Concept)

El flujo recibe el webhook y envía el WhatsApp.

1.  **Webhook Node**: Método POST.
2.  **HTTP Request (WhatsApp API)**:
    -   Suponiendo una API genérica (ej. Meta Cloud API, Twilio, o servicio local).
    -   **Método**: POST
    -   **URL**: `https://api.whatsapp.provider.com/send`
    -   **Body**:
    ```json
    {
      "phone": "={{ $json.body.telefono }}",
      "message": "Hola {{ $json.body.nombre_cliente }}! 👋\n\nTe recordamos que tu suscripción de Auxilio Mecánico para el vehículo *{{ $json.body.patente }}* vence el próximo *{{ $json.body.fecha_vence }}*.\n\n⚠️ Te quedan pocos días para renovar y mantener tu tranquilidad en la ruta.\n\n¡Responde a este mensaje para renovar tu plan hoy mismo! 🚗🔧"
    }
    ```

### Resumen del Flujo n8n (Pseudocódigo Visual)
`[Webhook (POST)]` --> `[HTTP Request (Send WhatsApp)]`

---

## Pasos para comenzar
1. Crea una nueva hoja de cálculo en Google Sheets con las pestañas mencionadas.
2. Abre AppSheet -> "Make a new app" -> "Start with your own data" -> Selecciona la hoja.
3. Configura las columnas (Tipos de datos y Referencias) según la sección 1.
4. Implementa las columnas virtuales y fórmulas de la sección 2.
5. Configura el Bot en AppSheet y crea el workflow en n8n según la sección 3.
