
import { GlassCard, GlassContent } from "@/components/ui/glass-card"
import { createClient } from "@/utils/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Car, Star, Shield, Filter } from "lucide-react"

export default async function AdminClientsPage() {
    const supabase = await createClient()

    const { data: clientes } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Base de Clientes</h1>
                    <p className="text-zinc-500">Gestión de usuarios y suscripciones activas.</p>
                </div>
            </header>

            <GlassCard className="bg-zinc-900/50 border-zinc-800">
                <GlassContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-950/50 text-zinc-500 uppercase font-bold text-xs tracking-wider">
                                <tr>
                                    <th className="p-4 pl-6">Cliente</th>
                                    <th className="p-4">Contacto</th>
                                    <th className="p-4">Suscripción</th>
                                    <th className="p-4 text-center">Auxilios</th>
                                    <th className="p-4 text-right pr-6">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {clientes?.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-zinc-900/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-white">{cliente.nombre}</div>
                                            <div className="text-xs text-zinc-500">ID: {cliente.id.slice(0, 8)}...</div>
                                        </td>
                                        <td className="p-4 opacity-80">
                                            {cliente.telefono}
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-400 gap-1 pl-1">
                                                <Star className="w-3 h-3 text-yellow-600" /> PREMIUM
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-950 border border-zinc-800">
                                                <span className="font-mono text-white font-bold">{cliente.auxilios_total - (cliente.auxilios_usados || 0)}</span>
                                                <span className="text-zinc-600">/</span>
                                                <span className="text-zinc-500">{cliente.auxilios_total}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <a
                                                href={`https://wa.me/${cliente.telefono?.replace(/\D/g, '') || ''}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-bold text-green-500 hover:text-green-400 transition-colors flex items-center justify-end gap-1 uppercase"
                                            >
                                                Whatsapp
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassContent>
            </GlassCard>
        </div>
    )
}
