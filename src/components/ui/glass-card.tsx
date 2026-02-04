import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GlassCardProps {
    children: ReactNode
    className?: string
    variant?: "default" | "alert" | "success"
}

export function GlassCard({ children, className, variant = "default" }: GlassCardProps) {
    const variants = {
        default: "bg-zinc-900/40 border-white/20 from-zinc-800/20 to-zinc-900/20",
        alert: "bg-red-950/20 border-red-500/30 from-red-900/10 to-black",
        success: "bg-green-950/20 border-green-500/30 from-green-900/10 to-black",
    }

    return (
        <div
            className={cn(
                "relative rounded-2xl overflow-hidden backdrop-blur-xl border shadow-xl flex flex-col",
                "bg-gradient-to-br",
                variants[variant],
                className
            )}
        >
            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat brightness-200 contrast-200"></div>

            {/* Metallic Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            {children}
        </div>
    )
}

export function GlassHeader({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("p-6 border-b border-white/5 bg-black/20 flex items-center justify-between", className)}>
            {children}
        </div>
    )
}

export function GlassContent({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn("p-6 relative z-10", className)}>{children}</div>
}
