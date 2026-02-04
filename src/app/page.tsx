"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, ShieldCheck, CheckCircle2, ArrowRight, Activity, Battery, Thermometer, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import ScrollytellingContainer from "@/components/moto-viva/ScrollytellingContainer"
import IgnitionButton from "@/components/ui/IgnitionButton"

// Animaciones Variantes
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
}

function HeroSection() {
  return (
    <section className="relative h-[95vh] w-full overflow-hidden flex items-center justify-center bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10" />

      {/* Background Image Real con Parallax Suave */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center z-0 opacity-80"
        style={{ backgroundImage: 'url("/images/yamaha-hero.jpg")' }} // High Res Image
      ></motion.div>

      <div className="relative z-20 container mx-auto px-4 text-center md:text-left">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-5xl">
          <motion.div variants={fadeIn}>
            <Badge variant="outline" className="mb-6 border-red-600/50 text-red-500 bg-red-950/20 px-6 py-2 text-xs tracking-[0.4em] uppercase font-bold backdrop-blur-md">
              System Online • v2.0
            </Badge>
          </motion.div>

          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] leading-none">
            Tu Moto <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900">Habla.</span><br />
            <span className="text-zinc-500">Nosotros Escuchamos.</span>
          </motion.h1>

          <motion.p variants={fadeIn} className="text-lg md:text-xl text-zinc-300 mb-12 font-light leading-relaxed max-w-2xl border-l-2 border-red-600 pl-6">
            Diagnóstico computarizado de grado industrial.
            No adivinamos fallas, analizamos datos en tiempo real.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col md:flex-row gap-6 items-center justify-center md:justify-start">
            <Link href="/dashboard">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-black px-12 py-8 text-xl rounded-none skew-x-[-10deg] hover:skew-x-0 transition-all shadow-[0_0_50px_rgba(220,38,38,0.4)] hover:shadow-[0_0_80px_rgba(220,38,38,0.6)] border border-red-500 group">
                <span className="skew-x-[10deg] group-hover:skew-x-0 flex items-center gap-3">
                  INGRESAR AL TALLER <ArrowRight className="w-6 h-6" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function PartnersSection() {
  const brands = ["GOODYEAR", "TEXA", "MOTUL", "BREMBO", "YAMAHA"]

  return (
    <section className="py-16 bg-black border-y border-zinc-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <p className="text-zinc-600 text-xs font-black tracking-[0.3em] mb-12 uppercase">Nuestros Aliados Tecnológicos</p>
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          {brands.map((b, i) => (
            <h3 key={i} className="text-3xl md:text-5xl font-black italic text-zinc-500 hover:text-white cursor-default select-none transition-colors tracking-tighter">
              {b}
            </h3>
          ))}
        </div>
      </div>
    </section>
  )
}

// STICKY SCROLLYTELLING SECTION
function FeatureScanner() {
  const [activePoint, setActivePoint] = useState(0)

  // Puntos de escaneo simulados
  const scanPoints = [
    { top: "30%", left: "40%", label: "ECU MAP" },
    { top: "55%", left: "65%", label: "O2 SENSOR" },
    { top: "70%", left: "30%", label: "ABS MOD" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePoint(prev => (prev + 1) % scanPoints.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const diagnostics = [
    {
      title: "Conexión ECU Establecida",
      desc: "Enlace directo con el cerebro de tu moto vía protocolo TXT IDC5.",
      icon: <Activity className="w-8 h-8 text-green-500" />,
      color: "green"
    },
    {
      title: "Análisis de Sensores",
      desc: "Lectura en tiempo real: TPS, MAP, IAT y Sondos Lambda monitoreados al milisegundo.",
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      color: "yellow"
    },
    {
      title: "Detección de Fallas",
      desc: "Identificación precisa de códigos de error (DTC) ocultos en el historial.",
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      color: "red"
    }
  ]

  return (
    <section className="relative bg-zinc-950 overflow-hidden border-y border-zinc-900">
      {/* Fondo Tecnológico Global */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(50,50,50,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(50,50,50,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.08)_0%,transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-16">

          {/* COLUMNA IZQUIERDA: VISUAL STICKY TIPO "HUD" */}
          <div className="lg:w-3/5 h-[600px] lg:h-[80vh] lg:sticky lg:top-24 mb-12 lg:mb-0 bg-black/40 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm relative group">

            {/* Marco HUD Decorativo */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-red-600/50 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-red-600/50 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-red-600/50 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-red-600/50 rounded-br-lg"></div>

            {/* Imagen Central Escaneada */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative w-full h-full max-w-2xl"
              >
                <div className="absolute inset-0 bg-[url('/images/yamaha-r1.jpg')] bg-contain bg-center bg-no-repeat opacity-50 grayscale contrast-125"></div>
                {/* Grid overlay sobre la moto */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,black_3px)] bg-[size:100%_4px] opacity-20"></div>

                {/* Puntos de Escaneo Animados */}
                {scanPoints.map((p, i) => (
                  <div key={i} className="absolute flex items-center gap-2 group-hover:scale-110 transition-transform duration-500" style={{ top: p.top, left: p.left }}>
                    <div className={`w-3 h-3 rounded-full ${activePoint === i ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-red-900'} transition-colors duration-300`}></div>
                    <div className={`h-[1px] w-12 bg-red-500/50 ${activePoint === i ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                    <span className={`text-[10px] font-mono text-red-400 bg-black/80 px-2 py-1 border border-red-900/50 ${activePoint === i ? 'opacity-100' : 'opacity-0'}`}>{p.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Panel de Datos (Side Panel) */}
            <div className="absolute top-8 right-8 w-64 space-y-4 hidden md:block">
              <div className="bg-black/60 border border-zinc-800 p-4 rounded-xl backdrop-blur-md">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Engine Load</div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mb-2">
                  <motion.div animate={{ width: ["10%", "60%", "30%"] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-red-600" />
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-mono font-bold text-white">42%</span>
                  <span className="text-xs text-green-500 font-mono">NORMAL</span>
                </div>
              </div>

              <div className="bg-black/60 border border-zinc-800 p-4 rounded-xl backdrop-blur-md">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Intake Temp</div>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-mono font-bold text-white">48°C</span>
                  <Activity className="w-4 h-4 text-zinc-500" />
                </div>
              </div>

              <div className="bg-black/60 border border-zinc-800 p-4 rounded-xl backdrop-blur-md overflow-hidden relative">
                <div className="absolute inset-0 bg-red-900/10 animate-pulse"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="text-[10px] text-red-400 font-bold tracking-widest">DIAGNOSTIC</div>
                    <div className="text-sm font-bold text-white">ACTIVE</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan Line Vertical */}
            <motion.div
              animate={{ left: ["0%", "100%", "0%"] }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              className="absolute top-0 bottom-0 w-[2px] bg-red-600/50 shadow-[0_0_30px_red] z-20"
            />
          </div>

          {/* COLUMNA DERECHA: TEXTO SCROLLABLE (Más ancho para compensar) */}
          <div className="lg:w-2/5 space-y-[30vh] py-[5vh] lg:py-[20vh]">
            {diagnostics.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-30% 0px -30% 0px" }}
                transition={{ duration: 0.8 }}
                key={i}
                className="p-8 border-l-4 border-zinc-800 hover:border-red-600 transition-all bg-gradient-to-r from-zinc-900/50 to-transparent backdrop-blur-sm rounded-r-xl group"
              >
                <div className={`w-14 h-14 rounded-xl bg-black flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-${item.color}-500/50 transition-colors shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tight">{item.title}</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-light border-l border-zinc-800 pl-4">{item.desc}</p>
              </motion.div>
            ))}

            <div className="h-[20vh] flex items-center pl-8">
              <Link href="/servicios">
                <Button variant="link" className="text-white hover:text-red-500 text-xl p-0 h-auto group w-fit">
                  Ver especificaciones completas <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform text-red-600" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const planes = [
    {
      nombre: "BÁSICO",
      precio: "$550",
      descripcion: "Cobertura esencial.",
      features: ["1 Auxilio mensual", "15km Remolque", "Mecánica Ligera"],
      dark: true,
    },
    {
      nombre: "PREMIUM",
      precio: "$950",
      descripcion: "Tranquilidad total.",
      features: ["3 Auxilios mensuales", "Remolque ILIMITADO", "Scanner Anual", "Atención 24/7"],
      dark: false, // Este será el destacado (Rojo/Black)
    },
    {
      nombre: "FLOTAS",
      precio: "B2B",
      descripcion: "Para empresas.",
      features: ["Gestión Centralizada", "Prioridad Taller", "Facturación A"],
      dark: true,
    },
  ]

  return (
    <section className="py-32 bg-zinc-950 relative" id="planes">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <Badge variant="outline" className="border-red-600/30 text-red-500 mb-4">SUSCRIPCIONES v2.0</Badge>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6">Mecánica <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">On-Demand.</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planes.map((plan, i) => (
            <Card
              key={i}
              className={`border-0 rounded-3xl overflow-hidden relative group transition-all duration-500 hover:-translate-y-2 ${plan.dark ? "bg-zinc-900/50" : "bg-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)] scale-110 z-10"}`}
            >
              <CardHeader className="p-8 pb-0">
                <h3 className={`text-2xl font-black uppercase tracking-wider ${plan.dark ? "text-zinc-500" : "text-red-950"}`}>{plan.nombre}</h3>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-6xl font-black ${plan.dark ? "text-white" : "text-white"}`}>{plan.precio}</span>
                </div>
                <p className={`text-sm font-medium mb-8 ${plan.dark ? "text-zinc-600" : "text-red-200"}`}>{plan.descripcion}</p>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-3 text-sm font-bold ${plan.dark ? "text-zinc-400" : "text-white"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${plan.dark ? "bg-red-600" : "bg-white"}`}></div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full py-6 font-bold text-lg rounded-xl border-0 ${plan.dark ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-black text-white hover:bg-zinc-900"}`}>
                  ELEGIR PLAN
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="min-h-[60vh] relative flex items-center bg-fixed bg-cover bg-center border-t border-zinc-900" style={{ backgroundImage: 'url("/images/ktm-duke.jpg")' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl">
          <div className="flex text-red-600 mb-6 gap-2">★★★★★</div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 italic tracking-tighter leading-tight">
            "DESCUBRIERON UNA FALLA EN EL ABS QUE NOS SALVÓ LA VIDA."
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-xl font-bold text-zinc-500">JM</div>
            <div>
              <strong className="block text-white font-bold text-lg">Javier Martínez</strong>
              <span className="text-zinc-500 text-sm uppercase font-bold tracking-wider">Ducati Monster 821</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-black text-zinc-500 py-20 border-t border-zinc-900 text-sm">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <h3 className="text-white text-2xl font-black uppercase tracking-tighter mb-6">Moto Taller CRM</h3>
          <p className="max-w-sm mb-6">Ingeniería aplicada al servicio de tu moto. Especialistas en inyección electrónica y diagnóstico avanzado en Montevideo.</p>
          <div className="flex gap-4">
            {/* Socials */}
            <div className="w-8 h-8 border border-zinc-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">Ig</div>
            <div className="w-8 h-8 border border-zinc-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">Fb</div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase mb-6">Servicios</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-red-500 transition-colors">Diagnóstico ID5</a></li>
            <li><a href="#" className="hover:text-red-500 transition-colors">Service Oficial</a></li>
            <li><a href="#" className="hover:text-red-500 transition-colors">Suscripciones</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase mb-6">Contacto</h4>
          <ul className="space-y-3">
            <li>Av. Italia 4500</li>
            <li>Montevideo, Uruguay</li>
            <li>+598 99 123 456</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30">
      <ScrollytellingContainer />
      <IgnitionButton />
      {/* <HeroSection /> - Replaced by Moto Viva */}
      <PartnersSection />
      <FeatureScanner />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
