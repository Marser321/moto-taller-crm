"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle2 } from "lucide-react"

interface PanicButtonProps {
    onActivate: () => void
}

export function PanicButton({ onActivate }: PanicButtonProps) {
    const [status, setStatus] = useState<"idle" | "activating" | "active">("idle")

    const handlePress = () => {
        if (status !== "idle") return
        setStatus("activating")

        // Simulating activation delay
        setTimeout(() => {
            setStatus("active")
            onActivate()
            // Reset after a while
            setTimeout(() => setStatus("idle"), 5000)
        }, 1500)
    }

    return (
        <div className="relative flex flex-col items-center justify-center p-8">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-zinc-800 bg-zinc-950/80 shadow-[inset_0_0_20px_rgba(0,0,0,1)]"></div>

            {/* Active Glow Ring */}
            <motion.div
                animate={{
                    opacity: status === "active" ? 1 : 0,
                    scale: status === "active" ? 1.1 : 1
                }}
                className="absolute inset-0 rounded-full border-4 border-red-600 blur-md opacity-0"
            />

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePress}
                disabled={status !== "idle"}
                className={`
          relative w-48 h-48 rounded-full border-4 shadow-2xl z-10 flex flex-col items-center justify-center
          transition-all duration-500 overflow-hidden group
          ${status === "active"
                        ? "bg-green-600 border-green-400 shadow-[0_0_50px_rgba(34,197,94,0.6)]"
                        : "bg-gradient-to-br from-zinc-800 to-black border-zinc-700 shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:shadow-inner"
                    }
        `}
            >
                {/* Metal Texture */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-500 via-transparent to-transparent pointer-events-none"></div>

                <AnimatePresence mode="wait">
                    {status === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-3xl font-black text-red-600 drop-shadow-md tracking-wider">START</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Solicitar Auxilio</span>
                        </motion.div>
                    )}

                    {status === "activating" && (
                        <motion.div
                            key="activating"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-full h-full border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <span className="absolute text-xs font-bold text-red-500 animate-pulse">CONECTANDO...</span>
                        </motion.div>
                    )}

                    {status === "active" && (
                        <motion.div
                            key="active"
                            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center"
                        >
                            <CheckCircle2 className="w-16 h-16 text-white mb-2 filter drop-shadow-lg" />
                            <span className="text-white font-bold text-sm tracking-wider">ENVIADO</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Warning Text */}
            <div className="mt-8 text-center max-w-xs">
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-900" />
                    Uso exclusivo para emergencias
                </p>
            </div>
        </div>
    )
}
