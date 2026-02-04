# 🕵️ INFORME DE AUDITORÍA: PROTOCOLO DEEP MECHANIC

**Fecha del Reporte:** 03 de Febrero, 2026
**Objetivo:** Análisis de integridad, seguridad y rendimiento de Fede Moto Servicios.
**Estado:** 🛑 CRÍTICO (Requiere acción inmediata antes de producción)

## 🚨 Resumen de Hallazgos

| Gravedad | Área | Problema Detectado | Solución Sugerida |
| :--- | :--- | :--- | :--- |
| **CRÍTICA** | 🔒 Seguridad | **RLS "Puertas Abiertas"**: Las tablas `clientes` y `motos` tienen una política `Public Read Access` (`USING true`). Cualquier usuario (incluso anónimo) puede descargar toda la base de datos de clientes. | Eliminar la política pública. Crear políticas RLS que solo permitan `SELECT` donde `auth.uid() == user_id`. |
| **CRÍTICA** | 🛡️ Seguridad | **Falta Middleware**: No existe archivo `middleware.ts`. Rutas protegidas como `/dashboard` son accesibles por cualquiera sin iniciar sesión. | Crear `middleware.ts` usando `@supabase/auth-helpers-nextjs` para proteger rutas `/dashboard/*` y redirigir a `/login`. |
| **ALTA** | 🧠 Lógica | **Botón de Pánico "Fake"**: La función `handlePanic` en el Dashboard solo hace un `console.log`. No hay registro en base de datos. | Implementar Server Action o API Route. **Importante**: Usar una Función de Base de Datos para restar el auxilio atómicamente y evitar *Race Conditions*. |
| **MEDIA** | ⚡ Rendimiento | **Imágenes CSS**: El Hero y el Scanner usan `backgroundImage: url(...)`. Estas imágenes no se optimizan (WebP, Lazy Load) y pesan mucho en móviles. | Migrar a componente `<Image fill />` de `next/image` con `object-fit: cover` y `priority` en el LCP. |
| **BAJA** | 🧹 Código | **Datos Hardcodeados**: El Dashboard muestra "2 / 3" auxilios fijos. El gráfico no refleja datos reales. | Conectar `DashboardPage` con Supabase para traer la suscripción real del usuario logueado. |

---

## 🛠️ Detalle de Puntos Críticos

### 1. 💀 Lógica de Negocio: Condición de Carrera en Auxilios
Actualmente el código no existe, pero si se implementa mal (ej: `read -> if > 0 -> update -1`), un usuario rápido puede pedir 2 grúas con 1 solo "token" disponible.
**Solución Robusta (PL/PGSQL + N8N):**
Crear una función en base de datos `solicitar_auxilio(user_id)` que:
1.  Bloquee la fila (row locking).
2.  Verifique `saldo > 0`.
3.  Reste 1.
4.  Inserte en `historial_auxilios`.
5.  Trigger -> Webhook a N8N -> WhatsApp.

### 2. 🔐 Fuga de Datos (RLS)
En `20260203000000_v2_schema_retry.sql`:
```sql
CREATE POLICY "Public Read Access" ON public.clientes FOR SELECT USING (true); -- ❌ PELIGRO
```
Esto expone nombres, emails y teléfonos de TODOS tus clientes a internet.

---

## 💡 Innovación Sugerida: Notificaciones WhatsApp vía N8N

Para evitar emails aburridos, proponemos esta arquitectura:

1.  **Supabase Database Webhook**: Escucha `INSERT` en la tabla `ordenes_trabajo` cuando `estado = 'listo'`.
2.  **Supabase Edge Function**: Procesa el evento y llama al Webhook de N8N.
3.  **Flujo N8N**:
    *   Recibe Datos (Cliente, Moto, Costo).
    *   Formatea Mensaje: *"Hola [Nombre]! Tu [Moto] está lista para rodar 🏍️. Total: $[Monto]."*
    *   Envía WhatsApp (vía Meta API o Twilio).

---

**¿Por cuál error crítico quieres empezar?**
1.  **Seguridad (RLS & Middleware)**: Cerrar las puertas del taller antes de que entren ladrones.
2.  **Lógica (Auxilios & Dashboard)**: Hacer que el botón de pánico funcione de verdad.
