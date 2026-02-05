"use client"

import { GlassCard, GlassContent } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowRight } from "lucide-react"
import { login, signup } from "../auth/actions"

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, startTransition] = useTransition()
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setMessage(null)
        startTransition(async () => {
            const action = isLogin ? login : signup
            const result = await action(formData)

            if (result?.error) {
                setMessage({ type: 'error', text: result.error })
            }
        })
    }

    return (
        <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden selection:bg-red-900/30">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md z-10"
            >
                <GlassCard className="border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl">
                    <GlassContent className="p-8 md:p-10 space-y-8">
                        <div className="text-center space-y-3">
                            <div className="w-14 h-14 bg-red-600 rounded-xl mx-auto flex items-center justify-center italic font-black text-3xl mb-6 shadow-[0_0_30px_rgba(220,38,38,0.4)] transform -rotate-3">M</div>
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase relative z-10">
                                {isLogin ? "Bienvenido" : "Crear Cuenta"}
                            </h1>
                            <p className="text-zinc-500 text-sm font-medium">
                                {isLogin ? "Accede a tu historial y diagnósticos." : "Únete al taller digital de alta performance."}
                            </p>
                        </div>

                        <form action={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4 overflow-hidden">
                                    <Input
                                        name="name"
                                        type="text"
                                        placeholder="Nombre Completo"
                                        className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-500 focus:ring-red-500/20 h-12"
                                        required
                                    />
                                    <Input
                                        name="phone"
                                        type="tel"
                                        placeholder="Teléfono (Ej: 099123456)"
                                        className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-500 focus:ring-red-500/20 h-12"
                                        required
                                    />
                                </motion.div>
                            )}

                            <Input
                                name="email"
                                type="email"
                                placeholder="Correo Electrónico"
                                className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-500 focus:ring-red-500/20 h-12"
                                required
                            />

                            <Input
                                name="password"
                                type="password"
                                placeholder="Contraseña"
                                className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-500 focus:ring-red-500/20 h-12"
                                required
                                minLength={6}
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all hover:scale-[1.02] mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Ingresar" : "Registrarme")}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-zinc-950 px-2 text-zinc-600">O</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
                                className="text-zinc-400 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                            >
                                {isLogin ? "No tengo cuenta" : "Ya tengo cuenta"}
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-lg text-sm text-center font-bold font-mono border ${message.type === 'success' ? 'bg-green-950/30 text-green-500 border-green-500/20' : 'bg-red-950/30 text-red-500 border-red-500/20'}`}
                            >
                                {message.text}
                            </motion.div>
                        )}
                    </GlassContent>
                </GlassCard>

                <p className="text-center text-zinc-600 text-[10px] mt-8 uppercase tracking-widest opacity-50">
                    Secure Access • Moto Taller v2.1
                </p>
            </motion.div>
        </div>
    )
}
