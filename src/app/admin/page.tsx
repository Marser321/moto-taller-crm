
import { GlassCard, GlassContent } from "@/components/ui/glass-card"
import { createClient } from "@/utils/supabase/server"
import { Users, Calendar, DollarSign, Activity, ArrowUpRight } from "lucide-react"

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // KPIs: Fetch real counts from DB
    const { count: clientCount } = await supabase.from('clientes').select('*', { count: 'exact', head: true })
    const { count: turnosCount } = await supabase.from('turnos').select('*', { count: 'exact', head: true }).eq('estado', 'requested')
    const { count: motosCount } = await supabase.from('motos').select('*', { count: 'exact', head: true })

    // Simulate Revenue for now or fetch if 'facturas' table had data
    const revenue = 125000 // Placeholder

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Panel de Control</h1>
                <p className="text-zinc-500">Bienvenido al centro de comando de Moto Taller CRM.</p>
            </header>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Clientes Totales"
                    value={clientCount || 0}
                    icon={Users}
                    trend="+12% vs mes pasado"
                    trendUp={true}
                />
                <KpiCard
                    title="Turnos Pendientes"
                    value={turnosCount || 0}
                    icon={Calendar}
                    trend="Requieren Atención"
                    trendUp={false}
                    color="text-yellow-500"
                />
                <KpiCard
                    title="Ingresos (Mes)"
                    value={`$${revenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+5% vs mes pasado"
                    trendUp={true}
                    color="text-green-500"
                />
                <KpiCard
                    title="Motos en Taller"
                    value={motosCount || 0}
                    icon={Activity}
                    trend="Capacidad al 80%"
                    trendUp={true}
                />
            </div>

            {/* RECENT ACTIVITY SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <GlassCard className="h-full bg-zinc-900/50 border-zinc-800">
                        <GlassContent className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold uppercase tracking-wide">Actividad Reciente</h3>
                                <button className="text-xs text-red-500 font-bold hover:underline">Ver Todo</button>
                            </div>

                            <div className="space-y-4">
                                {/* Placeholder Activity Items */}
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-zinc-800/50 hover:bg-black/40 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">Nuevo turno solicitado</p>
                                                <p className="text-xs text-zinc-500">Hace {i * 15} minutos • Juan Pérez (Honda CB500)</p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-zinc-600" />
                                    </div>
                                ))}
                            </div>
                        </GlassContent>
                    </GlassCard>
                </div>

                <div>
                    <GlassCard className="h-full bg-zinc-900/50 border-zinc-800">
                        <GlassContent className="p-6">
                            <h3 className="text-lg font-bold uppercase tracking-wide mb-6">Acciones Rápidas</h3>
                            <div className="space-y-3">
                                <QuickAction label="Nuevo Turno Manual" />
                                <QuickAction label="Registrar Entrada Taller" />
                                <QuickAction label="Crear Presupuesto" />
                                <QuickAction label="Enviar Recordatorio" />
                            </div>
                        </GlassContent>
                    </GlassCard>
                </div>
            </div>
        </div>
    )
}

function KpiCard({ title, value, icon: Icon, trend, trendUp, color = "text-white" }: any) {
    return (
        <GlassCard className="bg-zinc-900/50 border-zinc-800">
            <GlassContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    {trend && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-950/30 text-green-500' : 'bg-red-950/30 text-red-500'}`}>
                            {trend}
                        </span>
                    )}
                </div>
                <div>
                    <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
                    <span className={`text-3xl font-black tracking-tight ${color}`}>{value}</span>
                </div>
            </GlassContent>
        </GlassCard>
    )
}

function QuickAction({ label }: { label: string }) {
    return (
        <button className="w-full text-left p-4 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 transition-all text-sm font-bold text-zinc-400 hover:text-white flex items-center justify-between group">
            {label}
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
        </button>
    )
}
