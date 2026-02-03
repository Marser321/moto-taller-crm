-- ============================================
-- MOTO TALLER - Nuevas Tablas (Servicios + Facturas)
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Delete RLS for turnos (add DELETE permission)
CREATE POLICY IF NOT EXISTS "Allow anonymous delete turnos" ON turnos FOR DELETE USING (true);

-- ============================================
-- Tabla Servicios (Catálogo de Precios)
-- ============================================
CREATE TABLE IF NOT EXISTS servicios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL,
  precio integer NOT NULL,
  descripcion text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe re-run)
DROP POLICY IF EXISTS "Allow anonymous read servicios" ON servicios;
DROP POLICY IF EXISTS "Allow anonymous insert servicios" ON servicios;
DROP POLICY IF EXISTS "Allow anonymous update servicios" ON servicios;
DROP POLICY IF EXISTS "Allow anonymous delete servicios" ON servicios;

CREATE POLICY "Allow anonymous read servicios" ON servicios FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert servicios" ON servicios FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update servicios" ON servicios FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete servicios" ON servicios FOR DELETE USING (true);

-- Servicios predeterminados
INSERT INTO servicios (nombre, precio, descripcion) VALUES
  ('Cambio de Aceite', 1500, 'Cambio de aceite y filtro'),
  ('Service Completo', 4500, 'Aceite, filtros, ajustes, revisión general'),
  ('Frenos', 2500, 'Cambio de pastillas o zapatas'),
  ('Cadena/Transmisión', 2000, 'Lubricación, ajuste o reemplazo'),
  ('Neumáticos', 3000, 'Cambio de neumático delantero o trasero'),
  ('Diagnóstico', 800, 'Revisión completa del vehículo')
ON CONFLICT DO NOTHING;

-- ============================================
-- Tabla Facturas
-- ============================================
CREATE TABLE IF NOT EXISTS facturas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  numero serial,
  cliente_id uuid REFERENCES clientes(id),
  cliente_nombre text,
  cliente_telefono text,
  turno_id uuid REFERENCES turnos(id),
  items jsonb,
  subtotal integer,
  descuento integer DEFAULT 0,
  total integer NOT NULL,
  estado text DEFAULT 'pendiente',
  notas text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe re-run)
DROP POLICY IF EXISTS "Allow anonymous read facturas" ON facturas;
DROP POLICY IF EXISTS "Allow anonymous insert facturas" ON facturas;
DROP POLICY IF EXISTS "Allow anonymous update facturas" ON facturas;

CREATE POLICY "Allow anonymous read facturas" ON facturas FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert facturas" ON facturas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update facturas" ON facturas FOR UPDATE USING (true);

-- Listo! Las nuevas tablas están creadas.
