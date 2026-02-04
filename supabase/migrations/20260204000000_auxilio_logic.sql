-- 1. Tabla para historial de auxilios (para registro detallado)
CREATE TABLE IF NOT EXISTS public.historial_auxilios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES public.clientes(id),
    suscripcion_id UUID REFERENCES public.suscripciones(id),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ubicacion_lat FLOAT,
    ubicacion_long FLOAT,
    estado TEXT DEFAULT 'solicitado' -- solicitado, en_curso, finalizado, cancelado
);

ALTER TABLE public.historial_auxilios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven sus propios auxilios" 
ON public.historial_auxilios 
FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.clientes WHERE id = public.historial_auxilios.cliente_id));

-- 2. Funcion Atomica para pedir auxilio
CREATE OR REPLACE FUNCTION public.solicitar_auxilio(
    p_lat FLOAT, 
    p_long FLOAT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_cliente_id UUID;
    v_suscripcion_id UUID;
    v_limite INT;
    v_usados INT;
    v_estado_suscripcion TEXT;
BEGIN
    v_user_id := auth.uid();
    
    -- Obtener cliente
    SELECT id INTO v_cliente_id FROM public.clientes WHERE user_id = v_user_id LIMIT 1;
    IF v_cliente_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Cliente no encontrado');
    END IF;

    -- Obtener suscripción con BLOQUEO (FOR UPDATE) para evitar Race Conditions
    SELECT id, auxilios_mensuales_limite, auxilios_usados_mes, estado
    INTO v_suscripcion_id, v_limite, v_usados, v_estado_suscripcion
    FROM public.suscripciones
    WHERE cliente_id = v_cliente_id
    AND estado = 'activo'
    FOR UPDATE; -- <--- CLAVE: Bloquea la fila hasta que termine la transacción

    IF v_suscripcion_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'No tienes una suscripción activa');
    END IF;

    IF v_usados >= v_limite THEN
        RETURN jsonb_build_object('success', false, 'message', 'Has superado el límite de auxilios mensuales');
    END IF;

    -- Proceder con el descuento
    UPDATE public.suscripciones
    SET auxilios_usados_mes = auxilios_usados_mes + 1
    WHERE id = v_suscripcion_id;

    -- Registrar historial
    INSERT INTO public.historial_auxilios (cliente_id, suscripcion_id, ubicacion_lat, ubicacion_long)
    VALUES (v_cliente_id, v_suscripcion_id, p_lat, p_long);

    RETURN jsonb_build_object('success', true, 'message', 'Auxilio solicitado correctamente', 'restantes', v_limite - (v_usados + 1));
END;
$$;

-- 3. Configurar Webhook para N8N (Trigger)
-- Nota: Esto requiere que se haya creado la Edge Function y se tenga la URL.
-- Como paso previo, insertamos el hook. Pero la definicion del webhook se hace normalmente via API o Dashboard en Supabase.
-- Sin embargo, podemos usar pg_net o triggers de base de datos si la extension esta habilitada.
-- Para simplificar, usaremos un trigger que llame a una funcion segura si es posible, o dejaremos preparado el hook para la UI.
-- En este script, solo crearemos el armazón.
-- La mejor práctica actual en Supabase es usar "Database Webhooks" desde el Dashboard o Edge Functions triggers.

-- Vamos a simular que la Edge Function es invocada por un trigger de base de datos nativo.
-- (Supabase permite crear Webhooks en la UI que apuntan a Edge Functions).
