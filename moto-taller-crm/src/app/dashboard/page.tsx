"use client"

import { useState } from "react"
import { createBrowserClient } from '@supabase/ssr'

import { GlassCard, GlassHeader, GlassContent } from "@/components/ui/glass-card"
import { PanicButton } from "@/components/dashboard/panic-button"
import { AIDiagnostic } from "@/components/dashboard/ai-diagnostic"
import { Badge } from "@/components/ui/badge"
import { Wrench, MapPin, Calendar, Clock, ArrowUpRight, Gauge } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {

    // Estado local para feedback inmediato
    const [loadingPanic, setLoadingPanic] = useState(false)

    // Cliente Supabase
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handlePanic = async () => {
        setLoadingPanic(true)
        console.log("Iniciando protocolo de auxilio...")

        // Obtener ubicación real (si el navegador lo permite)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const { data, error } = await supabase.rpc('solicitar_auxilio', {
                        p_lat: latitude,
                        p_long: longitude
                    })

                    if (error) throw error

                    if (data && data.success) {
                        alert(`🚨 AUXILIO ENVIADO: ${data.message}. Restantes: ${data.restantes}`)
                    } else {
                        alert(`❌ ERROR: ${data?.message || 'No se pudo procesar'}`)
                    }
                } catch (err) {
                    console.error("Error crítico:", err)
                    alert("Error de conexión. Llama al 911 si es una emergencia vital.")
                } finally {
                    setLoadingPanic(false)
                }

            }, (error) => {
                console.error("Error GPS:", error)
                alert("No pudimos obtener tu ubicación. Por favor activa el GPS.")
                setLoadingPanic(false)
            })
        } else {
            alert("Tu dispositivo no soporta geolocalización.")
            setLoadingPanic(false)
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
                        <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-black italic shadow-lg shadow-red-900/50">M</div>
                        <div>
                            <span className="font-bold tracking-tight text-sm block leading-none">MOTO TALLER</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Client App</span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden relative">
                        <div className="w-full h-full bg-gradient-to-tr from-zinc-700 to-zinc-600"></div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
                    </div>
                </div>
            </GlassHeader>

            <main className="container mx-auto px-4 py-6 space-y-6 relative z-10 max-w-md md:max-w-5xl mx-auto">

                {/* 1. HERO - RESUMEN DE MOTO (Más compacto) */}
                <section className="relative w-full rounded-3xl overflow-hidden bg-zinc-900/50 border border-zinc-800">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10"></div>
                    <div className="absolute top-0 right-0 w-2/3 h-full opacity-60 mix-blend-screen">
                        {/* Imagen de fondo recortada para dar espacio al texto */}
                        <Image
                            src="/images/yamaha-hero.jpg"
                            alt="Mi Moto"
                            fill
                            className="object-cover object-center"
                        />
                    </div>

                    <div className="relative z-20 p-6 flex flex-col justify-center min-h-[160px]">
                        <Badge className="w-fit mb-2 bg-red-600/20 text-red-500 border-red-600/30 backdrop-blur-md">YAMAHA R1M</Badge>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-1">Mi Máquina</h2>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-mono font-bold text-white">12,450</span>
                            <span className="text-xs text-zinc-500 uppercase">Km Recorridos</span>
                        </div>
                    </div>
                </section>

                {/* 2. BOTÓN DE PÁNICO (Prioridad Alta) */}
                <div className="flex justify-center py-4">
                    <PanicButton onActivate={handlePanic} />
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
                                <div className="font-bold text-white text-sm">15 Mar 2026</div>
                            </div>
                        </GlassContent>
                    </GlassCard>

                    <GlassCard className="active:scale-95 transition-transform border-red-900/30 bg-red-950/10">
                        <GlassContent className="p-4 flex flex-col items-center text-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-500">
                                <Gauge className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] text-red-400/70 uppercase font-bold">Suscripción</div>
                                <div className="font-bold text-white text-sm">PREMIUM</div>
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
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-200">Service General</p>
                                        <p className="text-[10px] text-zinc-500">Hace 2 meses</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-zinc-400">$ 4,500</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="h-12"></div> {/* Spacer for bottom nav if needed */}
            </main>
        </div>
    )

}
