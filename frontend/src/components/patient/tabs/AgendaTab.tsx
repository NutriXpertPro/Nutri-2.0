"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Calendar,
    Plus,
    ChevronRight,
    Clock,
    Video,
    MapPin,
    CheckCircle2,
    XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
}

export function AgendaTab() {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen pt-24 pb-28 px-4 space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
                    <p className="text-sm text-muted-foreground font-medium">Suas consultas e retornos</p>
                </div>
                <Button size="icon" className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20">
                    <Plus className="h-6 w-6" />
                </Button>
            </div>

            {/* Next Appointment Card */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Próxima Consulta</h2>
                    <button className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                        Gerenciar <ChevronRight className="h-3 w-3" />
                    </button>
                </div>

                <Card className="glass-card rounded-[2.5rem] p-6 border-none shadow-xl relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

                    <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col">
                            <span className="text-5xl font-black tracking-tighter leading-none">24</span>
                            <span className="text-lg font-bold text-muted-foreground uppercase tracking-widest">Outubro</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Confirmada</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-emerald-500 to-transparent">
                                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                                    JS
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm">
                                <Video className="h-3 w-3 text-emerald-500 fill-emerald-500/20" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Dra. Sarah Fit</h3>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                                <Clock className="h-3.5 w-3.5" />
                                <span>10:00 • 45 min</span>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-all">
                        <Video className="h-5 w-5 fill-white" />
                        <span className="uppercase tracking-widest text-xs">Entrar na Sala Virtual</span>
                    </Button>
                </Card>
            </section>

            {/* Past Appointments */}
            <section className="space-y-4">
                <div className="flex items-center gap-4 px-1">
                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Histórico</h2>
                    <div className="h-px w-full bg-border/40" />
                </div>

                <div className="space-y-3">
                    {[
                        { date: "10 OUT", title: "Check-in Mensal", type: "Vídeo", status: "Concluída" },
                        { date: "28 SET", title: "Consulta Inicial", type: "Presencial", status: "Concluída" },
                        { date: "14 SET", title: "Ajuste de Plano", type: "Vídeo", status: "Cancelada" },
                    ].map((item, idx) => (
                        <Card key={idx} className={cn(
                            "glass-card p-4 rounded-3xl border-none shadow-sm flex items-center gap-4",
                            item.status === "Cancelada" && "opacity-60"
                        )}>
                            <div className="flex flex-col items-center justify-center w-12 h-14 bg-muted/30 rounded-2xl shrink-0">
                                <span className="text-[8px] font-black text-muted-foreground uppercase">{item.date.split(" ")[1]}</span>
                                <span className="text-lg font-black">{item.date.split(" ")[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={cn(
                                    "font-bold text-sm truncate",
                                    item.status === "Cancelada" && "line-through text-muted-foreground"
                                )}>
                                    {item.title}
                                </h4>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.type}</p>
                            </div>
                            <div className="shrink-0">
                                {item.status === "Concluída" ? (
                                    <div className="bg-emerald-500/10 text-emerald-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase border border-emerald-500/10">
                                        Ok
                                    </div>
                                ) : (
                                    <div className="bg-orange-500/10 text-orange-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase border border-orange-500/10">
                                        Off
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:bg-transparent hover:text-foreground">
                    Ver todo histórico
                </Button>
            </section>
        </motion.div>
    )
}
