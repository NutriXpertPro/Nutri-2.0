"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { usePatient } from "@/contexts/patient-context"
import {
    Flame,
    Droplets,
    Target,
    ChevronRight,
    Utensils,
    CheckCircle2,
    ArrowRight,
    Plus,
    Clock,
    UserCircle
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
}

export function HomeTab() {
    const { patient } = usePatient()
    const firstName = patient?.name?.split(" ")[0] || "Paciente"

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen pt-20 pb-28 px-4 space-y-6"
        >
            {/* Header / Greeting */}
            <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
                </span>
                <h1 className="text-3xl font-bold tracking-tight">
                    Bom dia,<br />
                    <span className="text-emerald-500">{firstName}</span>
                </h1>
            </div>

            {/* Nutri Coach Card */}
            <section>
                <div className="relative overflow-hidden rounded-3xl glass-card p-5 border border-white/10 shadow-lg">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="relative">
                            <Avatar className="w-14 h-14 border-2 border-emerald-500/30">
                                <AvatarImage src={patient?.nutritionist_avatar} alt="Nutricionista" />
                                <AvatarFallback className="bg-emerald-500/10 text-emerald-600">
                                    <UserCircle className="w-8 h-8" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Dica da Nutri</p>
                            <p className="text-sm font-medium leading-snug text-foreground/90">
                                "Foco nas proteínas hoje! Vamos tentar bater a meta de água antes das 15h para evitar a retenção."
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/5">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Progress Carousel */}
            <section className="-mx-4 px-4 overflow-x-auto no-scrollbar flex gap-4 pb-2">
                {/* KCAL CARD */}
                <div className="flex-none w-40 h-44 glass-card rounded-[2rem] p-4 flex flex-col items-center justify-between">
                    <div className="w-full flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">KCAL</span>
                    </div>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="32" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-muted/20" />
                            <circle
                                cx="40" cy="40" r="32" fill="transparent" stroke="currentColor" strokeWidth="6"
                                className="text-emerald-500"
                                strokeDasharray="201" strokeDashoffset="60" strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-lg font-bold">1.2k</span>
                        </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Meta: 1.8k</span>
                </div>

                {/* WATER CARD */}
                <div className="flex-none w-40 h-44 glass-card rounded-[2rem] p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center gap-2 z-10">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">ÁGUA</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/10 h-[60%] transition-all">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/20 blur-sm" />
                    </div>
                    <div className="flex flex-col items-center z-10 mb-4">
                        <span className="text-3xl font-bold">6 <span className="text-xs font-normal text-muted-foreground">copos</span></span>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Consumo</p>
                    </div>
                    <Button size="icon" className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-400 text-white shadow-lg active:scale-90 transition-transform z-20">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* GOAL CARD */}
                <div className="flex-none w-40 h-44 glass-card rounded-[2rem] p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">META</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-base font-bold leading-tight">{patient?.goal || "Perda de Peso"}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Progressão</span>
                    </div>
                    <div className="space-y-1">
                        <Progress value={75} className="h-2 bg-emerald-500/10" indicatorClassName="bg-emerald-500" />
                        <div className="flex justify-between text-[8px] font-bold uppercase text-muted-foreground">
                            <span>Ativo</span>
                            <span>75%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Fluxo de Hoje
                        <span className="bg-emerald-500/10 text-[10px] font-bold px-2 py-0.5 rounded text-emerald-600 uppercase">3 restantes</span>
                    </h2>
                </div>

                <div className="relative border-l-2 border-border/10 ml-3.5 space-y-8 pb-4">
                    {/* Item 1 - Consumido */}
                    <div className="relative pl-8 group">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground/30 z-10" />
                        <div className="opacity-50 grayscale-[0.5]">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> 08:00 AM
                                </span>
                                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase">
                                    <CheckCircle2 className="h-3 w-3" /> Consumido
                                </span>
                            </div>
                            <div className="glass-card p-4 rounded-2xl flex items-center gap-4 border-none shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-600">
                                    <Utensils className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Omelete & Frutas</h4>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Café da Manhã</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Item 2 - Agora (Efeito de Pulsação) */}
                    <div className="relative pl-8 group">
                        <motion.div
                            className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 z-20 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> 12:30 PM • AGORA
                                </span>
                            </div>
                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-[2rem] shadow-lg relative overflow-hidden transition-all active:scale-95">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <Utensils className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base leading-none">Salada com Frango</h3>
                                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide mt-1.5">Almoço • Próxima Refeição</p>
                                        </div>
                                    </div>
                                    <div className="bg-black/80 dark:bg-black/40 px-2 py-1 rounded text-[10px] text-white font-bold tabular-nums">
                                        450 kcal
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide">
                                        Confirmar Refeição
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl glass-card text-foreground">
                                        <ArrowRight className="h-5 w-5 rotate-45" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fab Registrar Tudo */}
            <div className="fixed bottom-24 right-6 z-40">
                <Button className="h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full px-6 shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold uppercase text-[11px] tracking-widest">
                    <Plus className="h-5 w-5" />
                    Registrar Todas do Dia
                </Button>
            </div>
        </motion.div>
    )
}
