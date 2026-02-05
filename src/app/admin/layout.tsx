import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Calendar, Users, Briefcase, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-black text-white selection:bg-red-900/30 overflow-hidden">

            {/* SIDEBAR */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex flex-col">
                <div className="p-6 border-b border-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-black italic shadow-lg shadow-red-900/50 transform -skew-x-12">M</div>
                        <div>
                            <span className="font-bold tracking-tight text-sm block leading-none">MOTO TALLER</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Admin Panel</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    <NavItem href="/admin" icon={LayoutDashboard} label="Resumen" />
                    <NavItem href="/admin/agenda" icon={Calendar} label="Agenda / Turnos" />
                    <NavItem href="/admin/clientes" icon={Users} label="Clientes" />
                    <NavItem href="/admin/finanzas" icon={Briefcase} label="Finanzas" />

                    <div className="pt-8 pb-2 px-3">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Configuración</span>
                    </div>
                    <NavItem href="/admin/settings" icon={Settings} label="Ajustes" />
                </div>

                <div className="p-4 border-t border-zinc-900">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs">F</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">Fede Morer</p>
                            <p className="text-xs text-zinc-500 truncate">fede@mototaller.com</p>
                        </div>
                    </div>

                    {/* Note: In a real app, this should be a form action to sign out */}
                    <form action="/auth/signout" method="post">
                        <Button variant="outline" size="sm" className="w-full justify-start text-zinc-400 hover:text-white border-zinc-800 hover:bg-zinc-900">
                            <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                        </Button>
                    </form>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-black italic shadow-lg shadow-red-900/50 transform -skew-x-12">M</div>
                        <span className="font-bold text-sm tracking-tight text-white">ADMIN PANEL</span>
                    </div>

                    <Link href="/admin/settings">
                        <Button size="icon" variant="ghost" className="text-zinc-400">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>

                {/* Mobile Nav Bar (Bottom) */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 p-2 z-50 flex justify-around items-center pb-safe">
                    <MobileNavItem href="/admin" icon={LayoutDashboard} label="Home" />
                    <MobileNavItem href="/admin/agenda" icon={Calendar} label="Agenda" />
                    <MobileNavItem href="/admin/clientes" icon={Users} label="Clientes" />
                    <MobileNavItem href="/dashboard" icon={LogOut} label="Salir" />
                </div>

                <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

function NavItem({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium group">
            <Icon className="w-5 h-5 text-zinc-500 group-hover:text-red-500 transition-colors" />
            {label}
        </Link>
    )
}

function MobileNavItem({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center p-2 text-zinc-500 hover:text-white transition-colors">
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold uppercase">{label}</span>
        </Link>
    )
}
