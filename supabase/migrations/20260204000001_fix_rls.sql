-- MIGRACTION: FIX RLS SECURITY
-- Eliminar politicas inseguras anteriores
DROP POLICY IF EXISTS "Public Read Access" ON public.clientes;
DROP POLICY IF EXISTS "Public Read Access" ON public.motos;
DROP POLICY IF EXISTS "Public Read Access" ON public.suscripciones; 
DROP POLICY IF EXISTS "Public Read Access" ON public.diagnosticos;
DROP POLICY IF EXISTS "Public Read Access" ON public.ordenes_trabajo; 
DROP POLICY IF EXISTS "Public Read Access" ON public.facturas;

-- 1. Vincular clientes con auth.users si no existe
-- (Solo agrega la columna si no estaba)
ALTER TABLE public.clientes 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Politicas para CLIENTES
-- Ver perfil propio
CREATE POLICY "Usuarios ven su propio perfil" 
ON public.clientes 
FOR SELECT 
USING (auth.uid() = user_id);

-- Actualizar perfil propio
CREATE POLICY "Usuarios actualizan su propio perfil" 
ON public.clientes 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insertar perfil propio (al registrarse)
CREATE POLICY "Usuarios pueden crear su perfil" 
ON public.clientes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Politicas para MOTOS
-- Solo ver motos vinculadas a mi cliente
CREATE POLICY "Usuarios ven sus propias motos" 
ON public.motos 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.clientes c
        WHERE c.id = public.motos.cliente_id
        AND c.user_id = auth.uid()
    )
);

-- 4. Politicas para SUSCRIPCIONES
CREATE POLICY "Usuarios ven sus suscripciones" 
ON public.suscripciones 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.clientes c
        WHERE c.id = public.suscripciones.cliente_id
        AND c.user_id = auth.uid()
    )
);

-- 5. Politicas para ORDENES DE TRABAJO
CREATE POLICY "Usuarios ven sus ordenes" 
ON public.ordenes_trabajo 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.motos m
        JOIN public.clientes c ON m.cliente_id = c.id
        WHERE m.id = public.ordenes_trabajo.moto_id
        AND c.user_id = auth.uid()
    )
);

-- 6. Politicas para DIAGNOSTICOS
CREATE POLICY "Usuarios ven sus diagnosticos" 
ON public.diagnosticos 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.motos m
        JOIN public.clientes c ON m.cliente_id = c.id
        WHERE m.id = public.diagnosticos.moto_id
        AND c.user_id = auth.uid()
    )
);
