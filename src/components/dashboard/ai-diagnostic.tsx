"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, Mic, Video, FileAudio, X, Sparkles, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AIDiagnostic() {
    const [file, setFile] = useState<File | null>(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            simulateAnalysis()
        }
    }

    const simulateAnalysis = () => {
        setAnalyzing(true)
        // Mock API Call delay
        setTimeout(() => {
            setAnalyzing(false)
            setResult("Posible holgura en cadena de distribución o tensor hidráulico defectuoso. Se recomienda inspección visual inmediata.")
        }, 4000)
    }

    const reset = () => {
        setFile(null)
        setResult(null)
    }

    return (
        <div className="relative overflow-hidden p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white tracking-wide">Gemini Vision Diagnostic</h3>
                <span className="text-[10px] bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">BETA</span>
            </div>

            <AnimatePresence mode="wait">
                {!file && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="border-2 border-dashed border-zinc-700 hover:border-purple-500 rounded-xl p-8 transition-colors group cursor-pointer text-center relative"
                    >
                        <input
                            type="file"
                            accept="video/*,audio/*"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={handleUpload}
                        />
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-900/40 transition-colors">
                            <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-purple-400" />
                        </div>
                        <p className="text-sm font-medium text-zinc-300 mb-1">
                            &quot;¿Qué ruido hace?&quot;
                        </p>
                        <p className="text-xs text-zinc-500">
                            Sube un video o audio del motor para un pre-diagnóstico con IA.
                        </p>
                    </motion.div>
                )}

                {analyzing && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-8"
                    >
                        <div className="relative w-16 h-16 mb-4">
                            <BrainCircuit className="w-full h-full text-purple-500 animate-pulse" />
                            <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-purple-400 font-mono text-sm animate-pulse">ANALIZANDO FRECUENCIAS DE AUDIO...</p>
                        <p className="text-xs text-zinc-600 font-mono mt-2">Enviando a Gemini 1.5 Pro</p>
                    </motion.div>
                )}

                {!analyzing && result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-950 border border-purple-500/20 rounded-xl p-4"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Diagnóstico IA</span>
                            </div>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-zinc-500 hover:text-white" onClick={reset}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <p className="text-sm text-zinc-300 leading-relaxed font-mono">
                            {result}
                        </p>

                        <div className="mt-4 flex gap-2">
                            <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs">
                                &quot;ANALIZANDO COMPORTAMIENTO DINÁMICO&quot;
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
