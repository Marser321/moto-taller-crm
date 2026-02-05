"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, ShieldCheck, CheckCircle2, ArrowRight, Activity, Battery, Thermometer, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import ScrollytellingContainer from "@/components/moto-viva/ScrollytellingContainer"
import IgnitionButton from "@/components/ui/IgnitionButton"

// Animaciones Variantes
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer: Variants = {
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
// BENTO GRID DASHBOARD SECTION
function FeatureScanner() {
  const [activePoint, setActivePoint] = useState(0)
  const [engineLoad, setEngineLoad] = useState(42)
  const [intakeTemp, setIntakeTemp] = useState(48)

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

    const dataInterval = setInterval(() => {
      setEngineLoad(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 10)))
      setIntakeTemp(prev => Math.min(120, Math.max(20, prev + (Math.random() - 0.5) * 5)))
    }, 800)

    return () => {
      clearInterval(interval)
      clearInterval(dataInterval)
    }
  }, [scanPoints.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const diagnostics = [
    {
      title: "Conexión ECU",
      desc: "Protocolo directo TXT IDC5.",
      icon: <Activity className="w-6 h-6 text-green-500" />,
      color: "green",
      stat: "CONNECTED"
    },
    {
      title: "Sensores Live",
      desc: "Monitoreo TPS, MAP, IAT.",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      color: "yellow",
      stat: "128ms"
    },
    {
      title: "Historial DTC",
      desc: "Escaneo profundo de fallas.",
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      color: "red",
      stat: "0 FAULTS"
    }
  ]

  return (
    <section className="relative bg-zinc-950 py-24 border-y border-zinc-900 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.15),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 text-center md:text-left">
          <Badge variant="outline" className="border-red-600/50 text-red-500 mb-4 tracking-widest uppercase bg-red-950/20">System Diagnostic v2.0</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">
            Centro de <span className="text-red-600">Control.</span>
          </h2>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">

          {/* 1. VISUALIZADOR PRINCIPAL (MOTO + RADAR) - Ocupa mucho espacio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-8 lg:col-span-8 h-[400px] md:h-[500px] bg-black/80 border border-zinc-800 rounded-3xl relative overflow-hidden group shadow-2xl"
          >
            {/* Radar Sweep */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(220,38,38,0.4)_360deg)]"
              />
            </div>

            {/* Decoración Esquinas */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-red-600/30 rounded-tl-xl z-20"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-red-600/30 rounded-br-xl z-20"></div>

            {/* Moto */}
            <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
              <div className="relative w-full h-full max-w-lg">
                <div className="absolute inset-0 bg-[url('/images/yamaha-r1.jpg')] bg-contain bg-center bg-no-repeat opacity-90 contrast-125 drop-shadow-[0_0_30px_rgba(220,38,38,0.2)]"></div>

                {/* Puntos Interactivos */}
                {scanPoints.map((p, i) => (
                  <div key={i} className="absolute flex items-center gap-2" style={{ top: p.top, left: p.left }}>
                    <div className={`w-3 h-3 rounded-full ${activePoint === i ? 'bg-red-500 shadow-[0_0_15px_red] scale-150' : 'bg-red-900'} transition-all duration-300`}></div>
                    <span className={`text-[10px] font-mono font-bold text-red-500 bg-black/90 px-2 py-1 border border-red-900/50 backdrop-blur-md ${activePoint === i ? 'opacity-100' : 'opacity-0'} transition-opacity`}>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 2. PANEL DE MÉTRICAS (Derecha) */}
          <div className="col-span-1 md:col-span-4 lg:col-span-4 flex flex-col gap-6">

            {/* Metrics Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-md hover:border-red-900/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Live Telemetry</h3>
                <Activity className="w-4 h-4 text-red-500 animate-pulse" />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm font-mono text-zinc-400">
                    <span>Engine Load</span>
                    <span>{Math.round(engineLoad)}%</span>
                  </div>
                  <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-600 to-red-400"
                      animate={{ width: `${engineLoad}%` }}
                      transition={{ type: "spring", bounce: 0 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2 text-sm font-mono text-zinc-400">
                    <span>Intake Temp</span>
                    <span>{Math.round(intakeTemp)}°C</span>
                  </div>
                  <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                      animate={{ width: `${Math.min(100, (intakeTemp / 120) * 100)}%` }}
                      transition={{ type: "spring", bounce: 0 }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-green-500">SYSTEM OPTIMAL</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Call To Action Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[150px] bg-red-900/10 border border-red-900/30 rounded-3xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-pointer hover:bg-red-900/20 transition-colors"
            >
              <div className="relative z-10">
                <Link href="/servicios">
                  <h4 className="text-white font-black uppercase italic text-xl mb-2 group-hover:scale-105 transition-transform">Ver Specs</h4>
                  <p className="text-red-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    Completo <ArrowRight className="w-4 h-4" />
                  </p>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* 3. CARACTERÍSTICAS (Fila inferior) */}
          {diagnostics.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
              className="col-span-1 md:col-span-4 bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl hover:bg-zinc-900/60 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-black border border-zinc-800 group-hover:border-${item.color}-500/50 transition-colors`}>
                  {item.icon}
                </div>
                <Badge variant="secondary" className="bg-zinc-900 text-zinc-500 font-mono text-[10px]">{item.stat}</Badge>
              </div>
              <h3 className="text-lg font-black text-white uppercase italic mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}

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
            &quot;DESCUBRIERON UNA FALLA EN EL ABS QUE NOS SALVÓ LA VIDA.&quot;
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
