
-- 1. CLIENTES (Mejorada)
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nombre_completo TEXT NOT NULL,
    telefono TEXT,
    email TEXT UNIQUE,
    tipo_cliente TEXT CHECK (tipo_cliente IN ('particular', 'flota', 'empresa')),
    nivel_fidelidad TEXT DEFAULT 'Bronce',
    puntos_acumulados INTEGER DEFAULT 0,
    notas_internas TEXT
);

-- 2. MOTOS / VEHICULOS (Nueva - Gestión de Flota)
CREATE TABLE IF NOT EXISTS public.motos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    anio INTEGER,
    patente TEXT UNIQUE NOT NULL,
    vin TEXT,
    kilometraje_actual INTEGER DEFAULT 0,
    ultima_actualizacion_km TIMESTAMP WITH TIME ZONE,
    imagen_url TEXT
);

-- 3. SUSCRIPCIONES (Refactorizada)
CREATE TABLE IF NOT EXISTS public.suscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES public.clientes(id),
    plan_nombre TEXT NOT NULL,
    estado TEXT CHECK (estado IN ('activo', 'pausado', 'vencido', 'cancelado')),
    auxilios_mensuales_limite INTEGER DEFAULT 3,
    auxilios_usados_mes INTEGER DEFAULT 0,
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_renovacion TIMESTAMP WITH TIME ZONE NOT NULL,
    precio_mensual DECIMAL(10, 2)
);

-- 4. DIAGNOSTICOS / CHEQUEO COMPUTARIZADO (Nueva - Core V2)
CREATE TABLE IF NOT EXISTS public.diagnosticos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moto_id UUID REFERENCES public.motos(id),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tecnico_id UUID,
    resultado_global TEXT,
    detalles_tecnicos JSONB, 
    observaciones TEXT,
    archivo_pdf_url TEXT
);

-- 5. ORDENES DE TRABAJO / HISTORIAL (Nueva)
CREATE TABLE IF NOT EXISTS public.ordenes_trabajo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moto_id UUID REFERENCES public.motos(id),
    estado TEXT CHECK (estado IN ('presupuesto', 'aprobado', 'en_proceso', 'esperando_repuestos', 'finalizado', 'entregado')),
    descripcion_problema TEXT,
    informe_tecnico TEXT,
    fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_prometida TIMESTAMP WITH TIME ZONE,
    fecha_entrega TIMESTAMP WITH TIME ZONE,
    costo_mano_obra DECIMAL(10, 2) DEFAULT 0,
    costo_repuestos DECIMAL(10, 2) DEFAULT 0
);

-- 6. FACTURAS (Nueva)
CREATE TABLE IF NOT EXISTS public.facturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_trabajo_id UUID REFERENCES public.ordenes_trabajo(id),
    cliente_id UUID REFERENCES public.clientes(id),
    numero_factura SERIAL,
    fecha_emision TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    monto_total DECIMAL(10, 2),
    estado_pago TEXT CHECK (estado_pago IN ('pendiente', 'pagado', 'anulado')),
    metodo_pago TEXT,
    url_pdf TEXT
);

-- Habilitar RLS (Row Level Security) por seguridad
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_trabajo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;

-- Politicas basicas (Reader publico temporal, ajustar con auth)
DROP POLICY IF EXISTS "Public Read Access" ON public.clientes;
DROP POLICY IF EXISTS "Public Read Access" ON public.motos;
CREATE POLICY "Public Read Access" ON public.clientes FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.motos FOR SELECT USING (true);
