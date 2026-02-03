-- MOTO TALLER - Schema Completo

-- Limpiar políticas existentes
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read clientes" ON clientes;
  DROP POLICY IF EXISTS "Allow anonymous insert clientes" ON clientes;
  DROP POLICY IF EXISTS "Allow anonymous update clientes" ON clientes;
  DROP POLICY IF EXISTS "Allow anonymous delete clientes" ON clientes;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read turnos" ON turnos;
  DROP POLICY IF EXISTS "Allow anonymous insert turnos" ON turnos;
  DROP POLICY IF EXISTS "Allow anonymous update turnos" ON turnos;
  DROP POLICY IF EXISTS "Allow anonymous delete turnos" ON turnos;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read servicios" ON servicios;
  DROP POLICY IF EXISTS "Allow anonymous insert servicios" ON servicios;
  DROP POLICY IF EXISTS "Allow anonymous update servicios" ON servicios;
  DROP POLICY IF EXISTS "Allow anonymous delete servicios" ON servicios;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read facturas" ON facturas;
  DROP POLICY IF EXISTS "Allow anonymous insert facturas" ON facturas;
  DROP POLICY IF EXISTS "Allow anonymous update facturas" ON facturas;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Tabla Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  telefono text UNIQUE NOT NULL,
  nombre text,
  modelo text,
  matricula text,
  km_current integer DEFAULT 0,
  km_last_service integer DEFAULT 0,
  km_interval integer DEFAULT 2500,
  oil_type text,
  last_service_date date,
  fecha_vencimiento date,
  auxilios_total integer DEFAULT 3,
  auxilios_usados integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read clientes" ON clientes FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert clientes" ON clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update clientes" ON clientes FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete clientes" ON clientes FOR DELETE USING (true);

-- Tabla Turnos
CREATE TABLE IF NOT EXISTS turnos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid REFERENCES clientes(id),
  cliente_telefono text,
  cliente text,
  moto text,
  servicio text,
  fecha text,
  estado text DEFAULT 'requested',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read turnos" ON turnos FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert turnos" ON turnos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update turnos" ON turnos FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete turnos" ON turnos FOR DELETE USING (true);

-- Tabla Servicios
CREATE TABLE IF NOT EXISTS servicios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL,
  precio integer NOT NULL,
  descripcion text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read servicios" ON servicios FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert servicios" ON servicios FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update servicios" ON servicios FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete servicios" ON servicios FOR DELETE USING (true);

INSERT INTO servicios (nombre, precio, descripcion) VALUES
  ('Cambio de Aceite', 1500, 'Cambio de aceite y filtro'),
  ('Service Completo', 4500, 'Aceite, filtros, ajustes'),
  ('Frenos', 2500, 'Cambio de pastillas o zapatas'),
  ('Cadena', 2000, 'Lubricacion, ajuste o reemplazo'),
  ('Neumaticos', 3000, 'Cambio de neumatico'),
  ('Diagnostico', 800, 'Revision completa')
ON CONFLICT DO NOTHING;

-- Tabla Facturas
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
CREATE POLICY "Allow anonymous read facturas" ON facturas FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert facturas" ON facturas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update facturas" ON facturas FOR UPDATE USING (true);

-- Datos ejemplo
INSERT INTO clientes (telefono, nombre, modelo, matricula, fecha_vencimiento, auxilios_total, auxilios_usados)
VALUES 
  ('099123456', 'Juan Perez', 'Honda CB 190R', 'SBU 1234', '2025-12-31', 3, 0),
  ('098765432', 'Maria Garcia', 'Yamaha FZ25', 'SBX 5678', '2025-06-15', 3, 1)
ON CONFLICT (telefono) DO NOTHING;
