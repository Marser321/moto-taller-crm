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

// DEEP SCAN EXPERIENCE (STICKY SCROLLYTELLING V2)
function FeatureScanner() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const [activeFeature, setActiveFeature] = useState(0)

  // Simulation Data
  const [engineTemp, setEngineTemp] = useState(98)
  const [brakeWear, setBrakeWear] = useState(82)
  const [ecuLoad, setEcuLoad] = useState(34)

  useEffect(() => {
    const interval = setInterval(() => {
      setEngineTemp(prev => Math.min(115, Math.max(90, prev + (Math.random() - 0.5) * 5)))
      setBrakeWear(prev => Math.max(70, prev - Math.random() * 0.1))
      setEcuLoad(prev => Math.min(100, Math.max(10, prev + (Math.random() - 0.5) * 10)))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      id: "engine",
      title: "THERMAL ANALYSIS",
      subtitle: "Mapas de calor en tiempo real.",
      desc: "Detectamos puntos calientes en tapa de cilindros y fugas de compresión imperceptibles al oído.",
      image: "/images/scan-engine.png",
      statLabel: "TEMP",
      statValue: `${Math.round(engineTemp)}°C`,
      statColor: "text-orange-500",
      targetTop: "40%",
      targetLeft: "45%"
    },
    {
      id: "brakes",
      title: "X-RAY BRAKES",
      subtitle: "Escaneo de seguridad activa.",
      desc: "Medición micrométrica de discos y pastillas. Predecimos el desgaste antes de que sea un riesgo.",
      image: "/images/scan-brakes.png",
      statLabel: "VIDA ÚTIL",
      statValue: `${Math.round(brakeWear)}%`,
      statColor: "text-green-500",
      targetTop: "65%",
      targetLeft: "75%"
    },
    {
      id: "ecu",
      title: "ECU LOGIC",
      subtitle: "Forense digital de la moto.",
      desc: "Accedemos al 'cerebro' para leer logs de fallas pasadas, mapas de inyección y sensores.",
      image: "/images/scan-ecu.png",
      statLabel: "CPU LOAD",
      statValue: `${Math.round(ecuLoad)}%`,
      statColor: "text-blue-500",
      targetTop: "35%",
      targetLeft: "30%"
    }
  ]

  return (
    <section ref={containerRef} className="relative bg-black border-y border-zinc-900">
      {/* Ambient Backlight */}
      <div className="absolute inset-0 z-0 bg-red-900/5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Mobile Header (Visible only on mobile to give context) */}
        <div className="lg:hidden py-12 text-center">
          <Badge variant="outline" className="border-red-600/50 text-red-500 mb-4 tracking-widest uppercase bg-red-950/20">Deep Scan v2.0</Badge>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">
            Centro de <span className="text-red-600">Control.</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row">

          {/* LEFT COLUMN - STICKY (The Map) - DESKTOP ONLY MOSTLY */}
          <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex flex-col items-center justify-center py-8 lg:py-0 overflow-hidden">

            {/* Desktop Header */}
            <div className="hidden lg:block absolute top-12 left-0 z-20">
              <Badge variant="outline" className="border-red-600/50 text-red-500 mb-4 tracking-widest uppercase bg-red-950/20">Deep Scan v2.0</Badge>
              <h2 className="text-5xl xl:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                Centro de <br /><span className="text-red-600">Control.</span>
              </h2>
            </div>

            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">

              {/* Radar Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent_70%)] animate-pulse"></div>
              <div className="absolute inset-0 border border-zinc-800 rounded-full opacity-20 scale-75"></div>
              <div className="absolute inset-0 border border-zinc-800 rounded-full opacity-20 scale-50"></div>

              {/* Radar Line */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                className="absolute inset-0 z-0 opacity-30"
              >
                <div className="w-full h-1/2 bg-gradient-to-t from-transparent to-red-900/50 border-r border-red-500/50 absolute top-0 left-0 origin-bottom-right" style={{ transformOrigin: "50% 100%" }}></div>
              </motion.div>

              {/* Bike Image */}
              <div className="relative z-10 w-full h-full bg-[url('/images/yamaha-r1.jpg')] bg-contain bg-center bg-no-repeat opacity-100 drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]"></div>

              {/* Grid Overlay */}
              <div className="absolute inset-0 z-20 bg-[linear-gradient(rgba(20,20,20,0)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

              {/* Active Target Point */}
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  className="absolute w-12 h-12 border-2 border-red-500 rounded-full flex items-center justify-center z-30"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: activeFeature === i ? 1 : 0,
                    scale: activeFeature === i ? 1 : 0.5,
                    top: f.targetTop,
                    left: f.targetLeft
                  }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - SCROLLABLE CARDS */}
          <div className="lg:w-1/2 py-12 lg:py-24 space-y-24 lg:space-y-32">
            {features.map((f, i) => (
              <motion.div
                key={i}
                onViewportEnter={() => setActiveFeature(i)}
                viewport={{ amount: 0.5, margin: "0px 0px -200px 0px" }} // Trigger earlier
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative group perspective-1000"
              >
                <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-red-900/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:transform hover:rotate-y-1 hover:scale-[1.02]">

                  {/* Image Header */}
                  <div className="h-48 md:h-64 overflow-hidden relative border-b border-zinc-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.image} alt={f.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <Badge variant="outline" className="bg-black/50 border-zinc-700 text-zinc-300 backdrop-blur-md font-mono">
                        SYS.CHECK // 0{i + 1}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase mb-3 flex flex-col md:flex-row md:items-center gap-3">
                      {f.title}
                      <span className={`w-fit text-xs md:text-sm font-mono font-bold bg-black px-3 py-1 rounded border border-zinc-800 ${f.statColor}`}>
                        {f.statLabel}: {f.statValue}
                      </span>
                    </h3>
                    <h4 className="text-red-500 font-bold uppercase tracking-widest text-xs mb-4">{f.subtitle}</h4>
                    <p className="text-zinc-400 leading-relaxed text-base md:text-lg">
                      {f.desc}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-xs font-mono text-zinc-600">
                      <Activity className={`w-4 h-4 ${f.statColor} animate-pulse`} />
                      <div className="h-px bg-zinc-800 flex-1"></div>
                      <span>A.I. DIAGNOSTIC</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Final CTA in the stream */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="bg-gradient-to-br from-red-600 to-red-900 rounded-3xl p-8 text-center"
            >
              <h3 className="text-2xl font-black text-white uppercase italic mb-4">¿Tu moto necesita un scan?</h3>
              <p className="text-red-100 mb-6">Agenda tu diagnóstico computerizado oficial hoy.</p>
              <Link href="/servicios">
                <Button className="w-full bg-black text-white hover:bg-zinc-900 border border-red-500/30 text-lg font-bold py-6">
                  AGENDAR AHORA
                </Button>
              </Link>
            </motion.div>

            <div className="h-[10vh]"></div>
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
            <li className="pt-4">
              <Link href="/login" className="text-zinc-600 hover:text-red-600 transition-colors text-xs font-mono uppercase">
                [ Acceso Admin ]
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30 relative">
      <Link href="/login" className="fixed top-6 right-6 z-50">
        <Button variant="outline" className="bg-black/50 backdrop-blur-md border-red-600/50 text-red-500 hover:bg-red-950/50 hover:text-red-400 font-bold uppercase tracking-wider text-xs">
          Acceso Taller
        </Button>
      </Link>
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
