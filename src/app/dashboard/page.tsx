
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { signout } from "@/app/auth/actions"

import { GlassCard, GlassHeader, GlassContent } from "@/components/ui/glass-card"
import { PanicButton } from "@/components/dashboard/panic-button"
import { AIDiagnostic } from "@/components/dashboard/ai-diagnostic"
import { Badge } from "@/components/ui/badge"
import { Calendar, Gauge, AlertTriangle, PlusCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Verificar Sesión
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // 2. Fetch Datos del Cliente
    const { data: cliente, error: clientError } = await supabase
        .from("clientes")
        .select("*")
        .eq("user_id", user.id)
        .single()

    // Estructura incial para usuarios nuevos sin perfil
    const clientName = cliente?.nombre || user.email?.split("@")[0] || "Piloto"
    const auxiliosRestantes = cliente?.auxilios_total ? (cliente.auxilios_total - (cliente.auxilios_usados || 0)) : 3

    // 3. Fetch Datos de la Moto (Prioridad: Primera moto activa)
    let moto = null
    if (cliente) {
        const { data: motos } = await supabase
            .from("motos")
            .select("*")
            .eq("cliente_id", cliente.id)
            .limit(1)

        if (motos && motos.length > 0) {
            moto = motos[0]
        }
    }

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-zinc-100 pb-24 font-sans relative overflow-x-hidden selection:bg-red-900/30">
            {/* FONDO INDUSTRIAL GLOBAL */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,30,30,1)_0%,rgba(10,10,10,1)_80%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            </div>

            {/* HEADER COMPACTO */}
            <GlassHeader className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/5 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-black italic shadow-lg shadow-red-900/50 transform -skew-x-12">M</div>
                        <div>
                            <span className="font-bold tracking-tight text-sm block leading-none">MOTO TALLER</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Client App</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* ADMIN BUTTON */}
                        {user.email === 'fede@mototaller.com' && (
                            <Link href="/admin">
                                <Button variant="outline" size="sm" className="hidden md:flex bg-red-950/20 border-red-600/50 text-red-500 hover:bg-red-950/40 hover:text-red-400 font-bold uppercase tracking-wider text-[10px] h-7 mr-2">
                                    Admin Panel
                                </Button>
                                <Button size="icon" className="md:hidden w-8 h-8 bg-red-600 text-white rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-400 mr-2">
                                    <Badge className="p-0 w-full h-full flex items-center justify-center bg-transparent hover:bg-transparent border-0">
                                        <Gauge className="w-4 h-4" />
                                    </Badge>
                                </Button>
                            </Link>
                        )}


                        import {signout} from "@/app/auth/actions"

                        // ... (imports) ...

                        // ... (in DashboardPage component) ...

                        <span className="hidden md:inline text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">
                            {clientName}
                        </span>

                        {/* LOGOUT BUTTON */}
                        <form action={signout}>
                            <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white hover:border-red-500 transition-colors ml-2">
                                <LogOut className="w-3 h-3" />
                            </Button>
                        </form>

                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden relative">
                            {/* ... existing avatar code ... */}
                            <div className="w-full h-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-xs font-bold">
                                {clientName.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </GlassHeader>

            <main className="container mx-auto px-4 py-6 space-y-6 relative z-10 max-w-md md:max-w-5xl mx-auto">

                {/* 1. HERO - RESUMEN DE MOTO */}
                {moto ? (
                    <section className="relative w-full rounded-3xl overflow-hidden bg-zinc-900/50 border border-zinc-800 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>
                        <div className="absolute top-0 right-0 w-3/4 h-full opacity-60 mix-blend-screen transition-transform duration-700 group-hover:scale-105">
                            {/* Fallback image if no moto image */}
                            <Image
                                src={moto.imagen_url || "/images/yamaha-hero.jpg"}
                                alt={moto.modelo || "Mi Moto"}
                                fill
                                className="object-cover object-center"
                            />
                        </div>

                        <div className="relative z-20 p-6 flex flex-col justify-center min-h-[160px]">
                            <Badge className="w-fit mb-2 bg-red-600/20 text-red-500 border-red-600/30 backdrop-blur-md">
                                {moto.marca} {moto.modelo}
                            </Badge>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-1 text-white">
                                {moto.patente}
                            </h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-mono font-bold text-white tracking-tight">
                                    {(moto.kilometraje_actual || 0).toLocaleString()}
                                </span>
                                <span className="text-xs text-zinc-500 uppercase font-bold">Km Recorridos</span>
                            </div>

                            {/* Status Indicators */}
                            {(moto.brake_status === 'warning' || moto.oil_status === 'warning') && (
                                <div className="mt-4 flex gap-2">
                                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 bg-yellow-950/20 text-[10px] animate-pulse">
                                        <AlertTriangle className="w-3 h-3 mr-1" /> REVISIÓN NECESARIA
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </section>
                ) : (
                    // SHOW EMPTY STATE IF NO MOTO
                    <section className="relative w-full rounded-3xl overflow-hidden bg-zinc-900/30 border border-zinc-800 border-dashed p-8 text-center flex flex-col items-center justify-center min-h-[160px]">
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                            <PlusCircle className="text-zinc-500 w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">Sin Moto Registrada</h2>
                        <p className="text-zinc-500 text-sm mb-4">Agrega tu vehículo para activar el diagnóstico.</p>
                        <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                            Registrar Moto
                        </Button>
                    </section>
                )}


                {/* 2. BOTÓN DE PÁNICO (Prioridad Alta) */}
                <div className="flex justify-center py-4">
                    <PanicButton onActivate={undefined} />
                    {/* Nota: PanicButton maneja su propia logica interna ahora por simplicidad, 
                        pero idealmente podriamos pasar el user_id o telefono aqui */}
                </div>

                {/* 3. ACCIONES RÁPIDAS (Grid 2 col) */}
                <div className="grid grid-cols-2 gap-4">
                    <GlassCard className="active:scale-95 transition-transform">
                        <GlassContent className="p-4 flex flex-col items-center text-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold">Próximo Service</div>
                                <div className="font-bold text-white text-sm">
                                    {cliente?.fecha_vencimiento || "---"}
                                    {/* Usando fecha_vencimiento como proxy de prox service si no hay otro campo mejor */}
                                </div>
                            </div>
                        </GlassContent>
                    </GlassCard>

                    <GlassCard className="active:scale-95 transition-transform border-red-900/30 bg-red-950/10">
                        <GlassContent className="p-4 flex flex-col items-center text-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-500">
                                <Gauge className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] text-red-400/70 uppercase font-bold">Auxilios Disp.</div>
                                <div className="font-bold text-white text-sm">{auxiliosRestantes} / {cliente?.auxilios_total || 3}</div>
                            </div>
                        </GlassContent>
                    </GlassCard>
                </div>

                {/* 4. DIAGNÓSTICO AI (Full width) */}
                <div className="pt-2">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">Estado del Sistema</h3>
                    <AIDiagnostic />
                </div>

                {/* 5. HISTORIAL */}
                <section>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">Última Actividad</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
                            <p className="text-zinc-500 text-xs italic text-center w-full">
                                No hay actividad reciente registrada.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="h-12"></div>
            </main>
        </div>
    )
}
