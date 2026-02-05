
import { GlassCard, GlassContent } from "@/components/ui/glass-card"
import { createClient } from "@/utils/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Clock, User, Phone, CheckCircle2, XCircle } from "lucide-react"

import { CreateAppointmentDialog } from "@/components/admin/create-appointment-dialog"

export default async function AdminAgendaPage() {
    const supabase = await createClient()

    // Fetch turnos (ordered by date)
    const { data: turnos } = await supabase
        .from('turnos')
        .select('*')
        .order('fecha', { ascending: true })

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Agenda de Taller</h1>
                    <p className="text-zinc-500">Gestión de turnos y servicios programados.</p>
                </div>
                <CreateAppointmentDialog />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* UPCOMING LIST */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Próximos Turnos</h2>

                    {turnos && turnos.length > 0 ? (
                        turnos.map((turno) => (
                            <GlassCard key={turno.id} className="bg-zinc-900/50 border-zinc-800">
                                <GlassContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center justify-center p-3 bg-zinc-950 rounded-xl border border-zinc-800 min-w-[70px]">
                                            <span className="text-xs font-bold text-red-500 uppercase">{new Date(turno.fecha).toLocaleDateString('es-UY', { month: 'short' })}</span>
                                            <span className="text-2xl font-black text-white">{new Date(turno.fecha).getDate()}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white mb-1">{turno.servicio}</h3>
                                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {turno.cliente_nombre}</span>
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {turno.cliente_telefono || "S/D"}</span>
                                            </div>
                                            <div className="mt-2 text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 w-fit text-zinc-400">
                                                {turno.moto}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        {turno.estado === 'requested' && (
                                            <>
                                                <ActionBtn icon={CheckCircle2} color="text-green-500" bg="hover:bg-green-950/30" label="Confirmar" />
                                                <ActionBtn icon={XCircle} color="text-red-500" bg="hover:bg-red-950/30" label="Rechazar" />
                                            </>
                                        )}
                                        <StatusBadge status={turno.estado} />
                                    </div>
                                </GlassContent>
                            </GlassCard>
                        ))
                    ) : (
                        <div className="p-8 text-center border border-zinc-800 border-dashed rounded-xl text-zinc-500">
                            No hay turnos programados.
                        </div>
                    )}
                </div>

                {/* CALENDAR MINI (Visual Placeholder) */}
                <div>
                    <GlassCard className="bg-zinc-900/50 border-zinc-800 sticky top-6">
                        <GlassContent className="p-6">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Calendario</h3>
                            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 text-center text-sm text-zinc-600">
                                [Componente de Calendario]
                                <br />
                                (Implementar React-Calendar aquí)
                            </div>
                        </GlassContent>
                    </GlassCard>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        requested: "bg-yellow-950/30 text-yellow-500 border-yellow-500/20",
        confirmed: "bg-green-950/30 text-green-500 border-green-500/20",
        completed: "bg-blue-950/30 text-blue-500 border-blue-500/20",
        cancelled: "bg-red-950/30 text-red-500 border-red-500/20"
    }

    return (
        <Badge variant="outline" className={`${styles[status] || "bg-zinc-800 text-zinc-400"} uppercase text-[10px] tracking-widest`}>
            {status}
        </Badge>
    )
}

function ActionBtn({ icon: Icon, color, bg, label }: any) {
    return (
        <button className={`p-2 rounded-lg transition-colors ${bg} group`} title={label}>
            <Icon className={`w-5 h-5 ${color} opacity-70 group-hover:opacity-100`} />
        </button>
    )
}
