"use client"

import Link from "next/link"
import { GlassHeader } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const servicios = [
    {
        titulo: "Diagnóstico Computarizado",
        descripcion: "Escaneo profundo de ECU con tecnología TEXA. Lectura de parámetros en tiempo real y borrado de fallas.",
        imagen: "/images/tech-1.jpg",
        categoria: "ELECTRÓNICA"
    },
    {
        titulo: "Service Integral",
        descripcion: "Cambio de fluidos (Motul), filtros originales, tensión de cadena y revisión general de 25 puntos.",
        imagen: "/images/tech-2.jpg",
        categoria: "MANTENIMIENTO"
    },
    {
        titulo: "Frenos ABS & CBS",
        descripcion: "Purgado de sistema, cambio de pastillas Brembo/EBC y verificación de sensores de rueda.",
        imagen: "/images/ktm-duke.jpg",
        categoria: "SEGURIDAD"
    },
    {
        titulo: "Suspensión Pro",
        descripcion: "Service de barrales, cambio de retenes y aceite. Configuración de SAG para pista o calle.",
        imagen: "/images/yamaha-hero.jpg",
        categoria: "PERFORMANCE"
    },
]

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-900/50">
            <GlassHeader className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/5">
                <div className="container mx-auto px-4 flex justify-between items-center h-16">
                    <span className="font-black italic text-xl tracking-tighter">MOTO TALLER</span>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
                        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                        <a href="#" className="text-white">Servicios</a>
                        <a href="/dashboard" className="hover:text-white transition-colors">Mi Taller</a>
                    </nav>
                </div>
            </GlassHeader>

            <main className="pt-32 pb-20 container mx-auto px-4">
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <Badge variant="outline" className="mb-6 border-red-600/50 text-red-500 bg-red-950/20 px-4 py-1 text-xs tracking-[0.3em] uppercase">
                        Catálogo v2.0
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
                        Ingeniería <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">Aplicada.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        No somos un taller convencional. Somos un laboratorio de performance para tu máquina.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {servicios.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative h-[400px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-pointer"
                        >
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={s.imagen}
                                    alt={s.titulo}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            </div>

                            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                                <div className="mb-auto flex justify-between items-start">
                                    <Badge className="bg-white/10 backdrop-blur-md border-0 text-white hover:bg-white/20">
                                        {s.categoria}
                                    </Badge>
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                                        <ArrowUpRight className="text-white w-5 h-5" />
                                    </div>
                                </div>

                                <motion.div
                                    className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0"
                                >
                                    <h3 className="text-3xl font-black uppercase tracking-tight mb-2">{s.titulo}</h3>
                                    <p className="text-zinc-400 text-sm line-clamp-2 group-hover:line-clamp-none transition-all">
                                        {s.descripcion}
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    )
}
