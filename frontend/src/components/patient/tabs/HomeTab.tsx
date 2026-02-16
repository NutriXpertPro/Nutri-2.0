"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { usePatient } from "@/contexts/patient-context"
import { cn } from "@/lib/utils"
import { useTodayMeals, useTodayMetrics, useCheckInMeal } from "@/hooks/use-patient-data"

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
}

export function HomeTab() {
    const { patient } = usePatient()
    const firstName = patient?.name?.split(" ")[0] || "Paciente"
    const { data: metrics } = useTodayMetrics()
    const { data: meals } = useTodayMeals()
    const checkInMeal = useCheckInMeal()

    const caloriesCurrent = metrics?.calories?.current || 0
    const caloriesGoal = metrics?.calories?.goal || 1800
    const caloriePercent = caloriesGoal > 0 ? Math.min(100, Math.round((caloriesCurrent / caloriesGoal) * 100)) : 0
    const calorieStrokeDashoffset = 201 - (201 * caloriePercent / 100)

    const waterCurrent = metrics?.water?.current || 0
    const waterGoal = metrics?.water?.goal || 8
    const waterPercent = waterGoal > 0 ? Math.min(100, Math.round((waterCurrent / waterGoal) * 100)) : 0

    const mealList = meals || []
    const completedMeals = mealList.filter(m => m.status === 'completed')
    const pendingMeals = mealList.filter(m => m.status !== 'completed')

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Bom dia"
        if (hour < 18) return "Boa tarde"
        return "Boa noite"
    }

    const getMealIcon = (name: string) => {
        const lower = name.toLowerCase()
        if (lower.includes('café') || lower.includes('desjejum')) return 'egg_alt'
        if (lower.includes('almoço')) return 'restaurant'
        if (lower.includes('jantar') || lower.includes('ceia')) return 'dinner_dining'
        if (lower.includes('lanche')) return 'restaurant_menu'
        return 'lunch_dining'
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen bg-background-dark text-white font-sans overflow-hidden"
        >
            <header className="flex-none pt-4 z-50 bg-background-dark/90 backdrop-blur-md sticky top-0 border-b border-white/20">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex flex-col text-left">
                        <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.05em] mb-1">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </span>
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground">
                            {getGreeting()}, <span className="text-primary">{firstName}</span>
                        </h1>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative px-0">
                {/* Coach Tip */}
                <section className="px-6 py-6 text-left">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1E22] to-[#25252A] p-5 shadow-lg border border-white/20">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="relative">
                                <img alt="Nutricionista" className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" src={patient?.nutritionist_avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBnbUmk4xhtdo4mzV2sq6LLYfUNncXScqiFfCEcaUmxvLuo__eCbVCsN2TLPlSKC46DH37896VwBWlAGe6Yl0LimqnTPxPLfVq1kFpkce3A96nIC9oWRetZIUyUtB8caNcfM3GAge-9Ikg7RIg4djXHYhrVmZTQNYEcMAKqBLmjoqG6gnOOMklA7u-Yt748b8dHGUltyaZEM74mVwU_fbLQJ_FwtU6igPqZOqo_iRYs_oeuv-v4z3Y3R7rsIO5exKjiBPSLgL8JoS7l"} />
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#1E1E22] rounded-full"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                                    {patient?.nutritionist_name ? `Dica de ${patient.nutritionist_name.split(' ').slice(0, 2).join(' ')}` : 'Dica do Coach'}
                                </p>
                                <p className="text-sm font-medium leading-snug text-zinc-200">
                                    {completedMeals.length > 0
                                        ? `Ótimo! Você já registrou ${completedMeals.length} refeição(ões) hoje. Continue assim!`
                                        : "Comece seu dia registrando suas refeições. Cada passo conta!"
                                    }
                                </p>
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5">
                                <span className="material-symbols-outlined text-sm text-zinc-400">arrow_forward_ios</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Metric Cards */}
                <section className="py-2 pl-6">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pr-6 pb-4 snap-x snap-mandatory">
                        {/* KCAL CARD */}
                        <div className="snap-center flex-none w-[160px] h-[180px] glass-panel rounded-3xl p-4 flex flex-col items-center justify-between relative border border-white/20">
                            <div className="absolute top-4 left-4 flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-lg font-bold">local_fire_department</span>
                                <span className="text-[10px] font-bold text-zinc-400">KCAL</span>
                            </div>
                            <div className="relative w-20 h-20 mt-4 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" fill="transparent" r="32" stroke="#333" strokeWidth="8"></circle>
                                    <circle cx="40" cy="40" fill="transparent" r="32" stroke="var(--primary-hex, #CCFF00)" strokeDasharray="201" strokeDashoffset={calorieStrokeDashoffset} strokeLinecap="round" strokeWidth="8" className="transition-all duration-1000"></circle>
                                </svg>
                                <div className="absolute text-center">
                                    <span className="block text-lg font-bold text-white leading-none">{caloriesCurrent}</span>
                                </div>
                            </div>
                            <div className="text-center w-full">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Meta: {caloriesGoal}</p>
                            </div>
                        </div>

                        {/* WATER CARD */}
                        <div className="snap-center flex-none w-[160px] h-[180px] glass-panel rounded-3xl p-4 flex flex-col relative overflow-hidden border border-white/20">
                            <div className="absolute top-4 left-4 flex items-center gap-1 z-10">
                                <span className="material-symbols-outlined text-blue-400 text-lg font-bold">water_drop</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">ÁGUA</span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-blue-500/20 transition-all duration-1000" style={{ height: `${waterPercent}%` }}>
                                <div className="absolute top-0 left-0 right-0 h-2 bg-blue-500/30 blur-sm"></div>
                            </div>
                            <div className="flex-1 flex flex-col justify-end items-center z-10 pb-2 text-center w-full">
                                <span className="text-3xl font-bold text-white leading-none">{waterCurrent}<span className="text-sm font-medium text-zinc-400 ml-1 uppercase">Copos</span></span>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-2">Meta: {waterGoal}</p>
                            </div>
                            <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform z-20">
                                <span className="material-symbols-outlined text-sm font-bold">add</span>
                            </button>
                        </div>

                        {/* GOAL CARD */}
                        <div className="snap-center flex-none w-[160px] h-[180px] glass-panel rounded-3xl p-4 flex flex-col justify-between border border-white/20">
                            <div className="flex items-center gap-1 text-left w-full">
                                <span className="material-symbols-outlined text-secondary text-lg font-bold">target</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">OBJETIVO</span>
                            </div>
                            <div className="flex flex-col gap-1 text-left w-full">
                                <span className="text-lg font-bold text-white leading-tight">{patient?.goal || "Manter peso"}</span>
                                <span className="text-[10px] text-zinc-500 uppercase font-bold">Meta Atual</span>
                            </div>
                            <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden mb-2">
                                <div className="bg-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${caloriePercent}%` }}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Daily Flow */}
                <section className="px-6 py-4 text-left">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        Fluxo de Hoje
                        <span className="bg-surface text-[10px] font-bold px-2 py-0.5 rounded text-zinc-400 uppercase">
                            {pendingMeals.length > 0 ? `${pendingMeals.length} Restantes` : 'Tudo feito!'}
                        </span>
                    </h2>

                    {mealList.length === 0 ? (
                        <div className="text-center py-12 opacity-60">
                            <span className="material-symbols-outlined text-4xl text-zinc-500 mb-3 block">restaurant_menu</span>
                            <p className="text-sm font-bold text-zinc-400">Nenhuma refeição cadastrada</p>
                            <p className="text-xs text-zinc-500 mt-1">Seu nutricionista ainda não criou um plano alimentar.</p>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-white/5 ml-3.5 space-y-8 pb-10">
                            {mealList.map((meal, idx) => {
                                const isCompleted = meal.status === 'completed'
                                const isCurrent = meal.status === 'current'
                                const isPending = meal.status === 'pending'

                                return (
                                    <div key={meal.id} className="relative pl-8 group">
                                        {/* Timeline dot */}
                                        {isCurrent ? (
                                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary z-20 shadow-neon">
                                                <div className="absolute inset-x-0 inset-y-0 bg-primary opacity-50 rounded-full animate-ping"></div>
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                "absolute -left-[9px] top-1 w-4 h-4 rounded-full z-10 border-2",
                                                isCompleted ? "bg-green-500 border-green-500" : "bg-surface border-zinc-600"
                                            )}></div>
                                        )}

                                        <div className={cn(
                                            isCompleted && !isCurrent && "opacity-60",
                                            isCurrent && "transform scale-[1.02]"
                                        )}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase",
                                                    isCurrent ? "text-primary" : "text-zinc-400"
                                                )}>
                                                    {meal.time}{isCurrent && " • AGORA"}
                                                </span>
                                                {isCompleted && (
                                                    <span className="text-[10px] font-bold text-green-500 flex items-center gap-1 uppercase">
                                                        <span className="material-symbols-outlined text-[14px] font-bold">check_circle</span> Consumido
                                                    </span>
                                                )}
                                            </div>

                                            {isCurrent ? (
                                                <div className="bg-surface border border-primary/30 p-5 rounded-3xl shadow-glow relative overflow-hidden">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
                                                    <div className="flex items-start justify-between mb-3 pl-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                                <span className="material-symbols-outlined font-bold">{getMealIcon(meal.name)}</span>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-white text-base">{meal.name}</h3>
                                                                <p className="text-[10px] font-bold text-primary/80 uppercase tracking-wide mt-0.5">
                                                                    Próxima Refeição
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-black/40 px-2 py-1 rounded text-[10px] text-white font-bold tabular-nums">
                                                            {meal.calories} kcal
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 pl-2 mt-4">
                                                        <button
                                                            className="flex-1 bg-primary text-black font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide active:scale-95 transition-all"
                                                            onClick={() => checkInMeal.mutate(meal.id)}
                                                        >
                                                            <span className="material-symbols-outlined text-lg font-bold">check</span>
                                                            Confirmar
                                                        </button>
                                                        <button className="w-12 flex items-center justify-center rounded-xl border border-white/10 text-white active:scale-95 transition-all">
                                                            <span className="material-symbols-outlined">swap_horiz</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border border-white/20">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-300">
                                                        <span className="material-symbols-outlined">{getMealIcon(meal.name)}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-white text-sm">{meal.name}</h4>
                                                        <p className="text-[10px] text-zinc-400 uppercase font-bold">{meal.calories} kcal</p>
                                                    </div>
                                                    {isPending && (
                                                        <button
                                                            className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full border border-primary/20 active:scale-95 transition-all"
                                                            onClick={() => checkInMeal.mutate(meal.id)}
                                                        >
                                                            Registrar
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>
            </main>
        </motion.div>
    )
}
