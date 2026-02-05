"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client"
import { CalendarIcon, Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function CreateAppointmentDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const clientName = formData.get("clientName") as string
        const clientPhone = formData.get("clientPhone") as string
        const date = formData.get("date") as string
        const time = formData.get("time") as string
        const service = formData.get("service") as string
        const moto = formData.get("moto") as string

        // Combine date and time to ISO string
        const fecha = new Date(`${date}T${time}`).toISOString()

        // Insert into 'turnos' table
        // Note: Since this is manual, we might not have a user_id or client_id linked initially
        // The table schema dependent, assuming it allows null client_id or we store the name in a 'notes' or 'cliente_nombre' field if it exists
        // Based on previous view of page.tsx, we saw 'cliente_nombre' being used.

        const { error } = await supabase
            .from("turnos")
            .insert({
                fecha,
                servicio,
                moto, // Storing moto model directly string for manual entry
                cliente_nombre: clientName,
                cliente_telefono: clientPhone,
                estado: "confirmed", // Manual entries are auto-confirmed
                origen: "manual" // To distinguish from app requests
            })

        setLoading(false)

        if (!error) {
            setOpen(false)
            router.refresh()
        } else {
            console.error("Error creating appointment:", error)
            alert("Error al crear el turno. Verifica la consola.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 font-bold uppercase tracking-wider">
                    <Plus className="w-4 h-4" /> Nuevo Turno
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">Agendar Manualmente</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="clientName" className="text-zinc-400 font-bold uppercase text-xs">Cliente</Label>
                        <Input id="clientName" name="clientName" placeholder="Nombre del cliente" required className="bg-zinc-950 border-zinc-800 text-white" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="clientPhone" className="text-zinc-400 font-bold uppercase text-xs">Teléfono</Label>
                        <Input id="clientPhone" name="clientPhone" placeholder="099..." required className="bg-zinc-950 border-zinc-800 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date" className="text-zinc-400 font-bold uppercase text-xs">Fecha</Label>
                            <Input id="date" name="date" type="date" required className="bg-zinc-950 border-zinc-800 text-white" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="time" className="text-zinc-400 font-bold uppercase text-xs">Hora</Label>
                            <Input id="time" name="time" type="time" required className="bg-zinc-950 border-zinc-800 text-white" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="service" className="text-zinc-400 font-bold uppercase text-xs">Servicio</Label>
                        <Select name="service" required>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="Service Oficial">Service Oficial</SelectItem>
                                <SelectItem value="Diagnóstico ID5">Diagnóstico ID5</SelectItem>
                                <SelectItem value="Mecánica Ligera">Mecánica Ligera</SelectItem>
                                <SelectItem value="Cambio Neumáticos">Cambio Neumáticos</SelectItem>
                                <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="moto" className="text-zinc-400 font-bold uppercase text-xs">Moto (Modelo/Matrícula)</Label>
                        <Input id="moto" name="moto" placeholder="Ej: Honda CB500 - ABC 123" required className="bg-zinc-950 border-zinc-800 text-white" />
                    </div>

                    <Button type="submit" disabled={loading} className="mt-4 bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Confirmar Turno"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
