"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAppointments } from "@/hooks/useAppointments"
import { usePatient } from "@/contexts/patient-context"

const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
}

export function AgendaTab() {
    const { patient } = usePatient()
    const { appointments: upcomingAppointments, loading: loadingUpcoming, confirmAppointment } = useAppointments('upcoming')
    const { appointments: pastAppointments, loading: loadingPast } = useAppointments('past')

    const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return {
                day: date.getDate().toString().padStart(2, '0'),
                month: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', ''),
                full: date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
            }
        } catch {
            return { day: '--', month: '---', full: dateStr }
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Confirmada'
            case 'scheduled': return 'Agendada'
            case 'cancelled': return 'Cancelada'
            case 'completed': return 'Concluída'
            default: return status
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-primary/10 border-primary/30 text-primary'
            case 'scheduled': return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            case 'cancelled': return 'bg-secondary/10 border-secondary/20 text-secondary'
            case 'completed': return 'bg-white/5 border-white/10 text-zinc-400'
            default: return 'bg-white/5 border-white/10 text-zinc-400'
        }
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen bg-background-dark text-white font-sans overflow-hidden"
        >
            <header className="flex-none px-6 pt-4 pb-4 flex items-center justify-between sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/20">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Agenda</h1>
                    <p className="text-sm text-zinc-400 font-medium tracking-tight">Gerencie suas consultas</p>
                </div>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-white/20 hover:bg-white/5 transition-colors group">
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">add</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto px-6 pb-24 space-y-8 no-scrollbar pt-6">
                {/* Next Appointment */}
                <section className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Próxima Consulta</h2>
                    </div>

                    {loadingUpcoming ? (
                        <div className="text-center py-8">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-xs text-zinc-500">Carregando...</p>
                        </div>
                    ) : nextAppointment ? (
                        <Card className="glass-panel rounded-[2rem] p-6 relative overflow-hidden group shadow-xl border border-white/20">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex flex-col">
                                    <span className="text-5xl font-extrabold text-white tracking-tighter leading-none">{formatDate(nextAppointment.date).day}</span>
                                    <span className="text-lg font-bold text-zinc-400 uppercase tracking-widest mt-1">{formatDate(nextAppointment.date).month}</span>
                                </div>
                                <div className={cn("px-3 py-1.5 rounded-full flex items-center gap-1.5 border", getStatusStyle(nextAppointment.status))}>
                                    {nextAppointment.status === 'confirmed' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                                    <span className="text-[10px] font-bold tracking-wide uppercase">{getStatusLabel(nextAppointment.status)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-primary to-transparent shadow-neon">
                                        <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-zinc-400 font-bold overflow-hidden border border-white/10">
                                            {nextAppointment.avatar ? (
                                                <img src={nextAppointment.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                patient?.nutritionist_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'NT'
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-1.5 border border-white/10 shadow-lg">
                                        <span className="material-symbols-outlined text-primary text-[16px] leading-none">
                                            {nextAppointment.type === 'Online' ? 'videocam' : 'location_on'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight tracking-tight">
                                        {nextAppointment.title || patient?.nutritionist_name || 'Consulta'}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium mt-0.5">
                                        <span className="material-symbols-outlined text-[16px] leading-none">schedule</span>
                                        <span>{nextAppointment.time} • {nextAppointment.specialty || nextAppointment.type}</span>
                                    </div>
                                </div>
                            </div>

                            {nextAppointment.type === 'Online' && nextAppointment.videoLink && (
                                <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold rounded-full shadow-neon flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                    <span className="material-symbols-outlined font-bold">videocam</span>
                                    <span className="uppercase tracking-widest text-[11px]">Entrar na Sala Virtual</span>
                                </Button>
                            )}

                            {nextAppointment.status === 'scheduled' && (
                                <Button
                                    className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-bold rounded-full shadow-neon flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                    onClick={() => confirmAppointment(nextAppointment.id)}
                                >
                                    <span className="material-symbols-outlined font-bold">check_circle</span>
                                    <span className="uppercase tracking-widest text-[11px]">Confirmar Presença</span>
                                </Button>
                            )}
                        </Card>
                    ) : (
                        <div className="glass-panel rounded-[2rem] p-8 text-center border border-white/20">
                            <span className="material-symbols-outlined text-4xl text-zinc-500 mb-3 block">event_busy</span>
                            <p className="text-sm font-bold text-zinc-400">Nenhuma consulta agendada</p>
                            <p className="text-xs text-zinc-500 mt-1">Aguarde seu nutricionista agendar a próxima consulta.</p>
                        </div>
                    )}
                </section>

                {/* History */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Histórico</h2>
                        <div className="h-[1px] flex-1 bg-white/10 ml-4"></div>
                    </div>

                    {loadingPast ? (
                        <div className="text-center py-4">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : pastAppointments.length === 0 ? (
                        <div className="text-center py-6 opacity-60">
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Nenhuma consulta anterior</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pastAppointments.map((item) => {
                                const dateFormatted = formatDate(item.date)
                                const isCancelled = item.status === 'cancelled'
                                return (
                                    <Card key={item.id} className={cn(
                                        "glass-card rounded-2xl p-4 border border-white/20 shadow-sm flex items-center gap-4 group active:bg-white/5 transition-colors",
                                        isCancelled && "opacity-70"
                                    )}>
                                        <div className={cn(
                                            "flex flex-col items-center justify-center w-12 h-14 bg-surface rounded-xl border border-white/5 flex-shrink-0 transition-all",
                                            isCancelled && "grayscale"
                                        )}>
                                            <span className="text-[10px] font-bold text-zinc-400 leading-tight tracking-widest">{dateFormatted.month}</span>
                                            <span className="text-lg font-bold text-white leading-tight">{dateFormatted.day}</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className={cn(
                                                "text-base font-bold text-white truncate",
                                                isCancelled && "line-through decoration-white/30 text-zinc-500"
                                            )}>
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">
                                                {item.specialty || item.type}
                                            </p>
                                        </div>

                                        <div className="shrink-0">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-[0.05em]",
                                                getStatusStyle(item.status)
                                            )}>
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}

                    <Button variant="ghost" className="w-full py-6 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-all">
                        Ver todo histórico
                    </Button>
                </section>
            </main>
        </motion.div>
    )
}
