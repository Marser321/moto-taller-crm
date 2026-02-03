import { GraficoAuxilios } from "@/components/grafico-auxilios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, History, MessageSquare, PhoneCall } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

// Definición de tipos
interface Cliente {
    nombre_cliente: string
    plan: string // Nota: En la DB es tipo_plan, mapearemos después
    auxilios_restantes: number
    total_auxilios: number // No está en DB, por defecto 3
    puntos: number
    nivel: string // Calculado
    fecha_renovacion: string
    patente: string
}

const CLIENTE_DEFAULT: Cliente = {
    nombre_cliente: "Demo User",
    plan: "Premium",
    auxilios_restantes: 3,
    total_auxilios: 3,
    puntos: 350,
    nivel: "Plata",
    fecha_renovacion: "15 Oct 2026",
    patente: "DEMO-123"
}

export default function DashboardPage() {
    const [cliente, setCliente] = useState<Cliente>(CLIENTE_DEFAULT)

    useEffect(() => {
        async function fetchData() {
            try {
                // MODO DEMO: Traer la primera suscripción activa encontrada
                const { data, error } = await supabase
                    .from('suscripciones_clientes')
                    .select('*')
                    .eq('estado', 'activo')
                    .limit(1)
                    .single()

                if (error) {
                    console.error("Error fetching data:", error)
                    return
                }

                if (data) {
                    setCliente({
                        nombre_cliente: data.nombre_cliente || "Usuario",
                        plan: data.tipo_plan || "Estándar",
                        auxilios_restantes: data.auxilios_restantes,
                        total_auxilios: 3,
                        puntos: data.puntos,
                        nivel: data.puntos > 500 ? "Oro" : data.puntos > 200 ? "Plata" : "Bronce",
                        fecha_renovacion: data.fecha_renovacion ? new Date(data.fecha_renovacion).toLocaleDateString('es-ES', { month: 'short', year: 'numeric', day: 'numeric' }) : "Sin fecha",
                        patente: data.patente || "---"
                    })
                }
            } catch (e) {
                console.error("Error inesperado:", e)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-black text-zinc-100 p-4 font-sans">
            {/* Header Premium */}
            <header className="flex items-center justify-between mb-8 pt-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Hola, {cliente.nombre_cliente}</h1>
                    <p className="text-zinc-500 text-sm">Plan {cliente.plan} Activo</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-400 text-xs">JD</span>
                </div>
            </header>

            <main className="space-y-6">
                {/* Card Principal: Matricula y Vencimiento */}
                <Card className="bg-zinc-950 border-zinc-900 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                            Vigente
                        </span>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-3xl font-black italic text-zinc-100">
                            {cliente.patente}
                        </CardTitle>
                        <p className="text-xs text-zinc-500">Vencimiento: {cliente.fecha_renovacion}</p>
                    </CardHeader>
                </Card>

                {/* Gráfico de Auxilios */}
                <GraficoAuxilios
                    restantes={cliente.auxilios_restantes}
                    total={cliente.total_auxilios}
                />

                {/* Acciones Rápidas */}
                <div className="grid grid-cols-1 gap-4">
                    <Button
                        variant="destructive"
                        className="h-24 text-lg font-black uppercase tracking-tighter flex items-center gap-3 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all"
                    >
                        <AlertCircle className="w-8 h-8 animate-pulse" />
                        Solicitar Grúa (SOS)
                    </Button>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 bg-zinc-950 border-zinc-900 hover:bg-zinc-900 flex flex-col gap-1">
                            <History className="w-5 h-5 text-zinc-400" />
                            <span className="text-xs font-bold">Historial</span>
                        </Button>
                        <Button variant="outline" className="h-20 bg-zinc-950 border-zinc-900 hover:bg-zinc-900 flex flex-col gap-1">
                            <MessageSquare className="w-5 h-5 text-emerald-500" />
                            <span className="text-xs font-bold">WhatsApp</span>
                        </Button>
                    </div>
                </div>

                {/* Fidelidad */}
                <Card className="bg-zinc-950 border-zinc-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">💎</div>
                            <div>
                                <p className="text-lg font-bold">{cliente.puntos} pts</p>
                                <p className="text-xs text-zinc-500">Nivel {cliente.nivel}</p>
                            </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-emerald-500 font-bold hover:text-emerald-400">
                            Canjear
                        </Button>
                    </CardContent>
                </Card>
            </main>

            <footer className="mt-12 text-center pb-8">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Moto Taller CRM • v2.1</p>
            </footer>
        </div>
    )
}
