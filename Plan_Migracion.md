# Plan de Migración: Moto Taller CRM a Next.js 15

Este documento detalla la estrategia para migrar la arquitectura actual basada en HTML/Google Sheets a un sistema moderno full-stack.

## 1. Extracción de Lógica y Reglas de Negocio

### Servicios y Precios Detectados
- **Suscripción Anual**: Costo de renovación estimado en `$U 5.500` (según `index.html`).
- **Límite de Auxilios**: Actualmente 3 anuales, pero se migrará a **3 mensuales** según requerimiento.
- **Puntos de Fidelidad**: Los clientes acumulan puntos (ej: 350 pts = Nivel Plata).
- **Vencimiento**: Las suscripciones vencen 365 días después del alta.
- **Estado de Servicio**: Activo si hay auxilios restantes y la fecha de vencimiento es futura.

### Inconsistencias Halladas
> [!WARNING]
> La documentación técnica previa (`DISEÑO_TALLER_AUXILIO.md`) menciona 3 auxilios **anuales**, pero el nuevo requerimiento solicita **3 mensuales**. Procederemos con el reset mensual.

---

## 2. Arquitectura de Datos (Supabase)

### Script SQL: Tabla `suscripciones_clientes`
```sql
-- Habilitar extensión pg_cron si está disponible para el reset mensual en Supabase
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE TABLE suscripciones_clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    estado TEXT CHECK (estado IN ('activo', 'inactivo')) DEFAULT 'activo',
    auxilios_restantes INTEGER DEFAULT 3,
    fecha_renovacion DATE NOT NULL,
    puntos INTEGER DEFAULT 0,
    tipo_plan TEXT DEFAULT 'Premium',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Función para resetear auxilios
CREATE OR REPLACE FUNCTION reset_monthly_auxilios()
RETURNS VOID AS $$
BEGIN
    UPDATE suscripciones_clientes
    SET auxilios_restantes = 3
    WHERE estado = 'activo';
END;
$$ LANGUAGE plpgsql;

-- Nota: Para que sea automático, se debe programar via Supabase Edge Functions 
-- o utilizando pg_cron:
-- SELECT cron.schedule('0 0 1 * *', 'SELECT reset_monthly_auxilios()');
```

---

## 3. Interfaz de Usuario (Frontend)

### Dashboard del Cliente (Next.js 15)
- **Tecnología**: Tailwind CSS, Shadcn/UI, Framer Motion.
- **Estética**: Dark Mode Premium (Fondo `#0a0a0a`, Acentos en `red-600` o `emerald-500`).
- **Componente Principal**: Chart radial (gráfico circular) para los auxilios.

#### Estructura de Proyecto:
```text
src/
├── app/
│   ├── (auth)/         # Login/Registro
│   ├── dashboard/      # Panel del cliente
│   │   └── page.tsx    # Vista con el gráfico circular
│   └── api/            # API endpoints para n8n
├── components/
│   ├── ui/             # Shadcn components
│   └── radial-chart.tsx # El gráfico circular solicitado
└── lib/                # Supabase configuration
```

¿Ves alguna inconsistencia adicional o deseas ajustar el script SQL antes de proceder?
