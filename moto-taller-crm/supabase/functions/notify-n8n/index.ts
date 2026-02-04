import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL')

serve(async (req) => {
    if (!N8N_WEBHOOK_URL) {
        return new Response(JSON.stringify({ error: 'N8N_WEBHOOK_URL not set' }), { status: 500 })
    }

    const { record, old_record, type } = await req.json()

    // Solo notificar si el estado cambia a 'finalizado' o 'entregado'
    if (
        type === 'UPDATE' &&
        record.estado !== old_record.estado &&
        (record.estado === 'finalizado' || record.estado === 'entregado')
    ) {

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orden_id: record.id,
                    cliente_id: record.cliente_id || null, // Asegurarse de tener esto en la tabla o hacer join
                    moto_id: record.moto_id,
                    nuevo_estado: record.estado,
                    costo_total: (record.costo_mano_obra || 0) + (record.costo_repuestos || 0),
                    mensaje: `Tu moto está lista 🏍️. Estado: ${record.estado}`
                }),
            })

            if (response.ok) {
                console.log(`Notificación enviada a N8N para orden ${record.id}`)
                return new Response(JSON.stringify({ success: true }), { status: 200 })
            } else {
                console.error('Error enviando a N8N', await response.text())
                return new Response(JSON.stringify({ error: 'Failed to send to N8N' }), { status: 500 })
            }
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), { status: 500 })
        }
    }

    return new Response(JSON.stringify({ message: 'No action needed' }), { status: 200 })
})
