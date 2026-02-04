"use client"

import { GlassCard, GlassContent } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const router = useRouter()

    // Cliente Supabase Frontend
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: '¡Enlace mágico enviado! Revisa tu email.' })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md z-10"
            >
                <GlassCard className="border-zinc-800 bg-black/40 backdrop-blur-xl">
                    <GlassContent className="p-8 space-y-8">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-red-600 rounded mx-auto flex items-center justify-center italic font-black text-2xl mb-6 shadow-[0_0_30px_rgba(220,38,38,0.5)]">M</div>
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Identificación</h1>
                            <p className="text-zinc-500 text-sm">Ingresa tu email para acceder al Taller Digital.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-500 focus:ring-red-500/20 h-12 text-lg text-center"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.02]"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Enviar Magic Link"}
                            </Button>
                        </form>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`p-4 rounded-lg text-sm text-center font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                            >
                                {message.text}
                            </motion.div>
                        )}
                    </GlassContent>
                </GlassCard>

                <p className="text-center text-zinc-600 text-xs mt-8">
                    Acceso seguro • Moto Taller CRM v2.0
                </p>
            </motion.div>
        </div>
    )
}
