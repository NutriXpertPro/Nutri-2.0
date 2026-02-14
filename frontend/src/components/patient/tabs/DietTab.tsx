"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useTodayMeals, useTodayMetrics, useCheckInMeal } from "@/hooks/use-patient-data"
import { cn } from "@/lib/utils"
import { PatientMeal } from "@/services/patient-data-service"

const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
}

export function DietTab() {
    const { data: meals, isLoading: loadingMeals } = useTodayMeals()
    const { data: metrics, isLoading: loadingMetrics } = useTodayMetrics()
    const checkInMutation = useCheckInMeal()

    if (loadingMeals || loadingMetrics) {
        return <div className="p-6 pt-40 animate-pulse space-y-4">
            <div className="h-32 bg-surface rounded-3xl" />
            <div className="h-64 bg-surface rounded-3xl" />
        </div>
    }

    if (!meals || meals.length === 0 || !metrics) {
        return (
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col min-h-screen bg-background-dark text-white font-sans overflow-hidden">
                <header className="flex-none px-6 pt-4 pb-4 sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/20">
                    <h1 className="text-2xl font-bold tracking-tight text-white">Dieta</h1>
                    <p className="text-sm text-zinc-400 font-medium tracking-tight">Seu plano alimentar</p>
                </header>
                <main className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center space-y-4 opacity-70">
                        <span className="material-symbols-outlined text-5xl text-zinc-500 block">restaurant_menu</span>
                        <p className="text-base font-bold text-zinc-400">Nenhuma dieta cadastrada</p>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-[260px] mx-auto">Seu nutricionista ainda não criou um plano alimentar para você. Aguarde a próxima consulta.</p>
                    </div>
                </main>
            </motion.div>
        )
    }

    // Porcentagem de calorias baseada na meta
    const caloriePercentage = Math.min(100, Math.round((metrics.calories.current / metrics.calories.goal) * 100));

    // Gerar dias da semana para a barra de datas
    const getWeekDays = () => {
        const days = [];
        const today = new Date();
        const first = today.getDate() - today.getDay() + 1; // Segunda-feira

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(first + i);
            days.push({
                day: date.getDate(),
                label: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i],
                isToday: date.getDate() === today.getDate() && date.getMonth() === today.getMonth()
            });
        }
        return days;
    };

    const weekDays = getWeekDays();

    // Calcular totais de macros das refeições marcadas como concluídas
    const macroTotals = meals.reduce((acc, meal) => {
        if (meal.status === 'completed') {
            acc.protein += meal.protein || 0;
            acc.carbs += meal.carbs || 0;
            acc.fats += meal.fats || 0;
        }
        return acc;
    }, { protein: 0, carbs: 0, fats: 0 });

    // Tentar obter as metas da primeira dieta ativa se disponível (ou usar valores das métricas se expandirmos)
    // Por enquanto, vamos estimar as metas baseadas nas métricas ou um valor fixo razoável se não disponível
    const macroGoals = {
        protein: 150, // Fallback
        carbs: 200,
        fats: 60
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen bg-background-dark text-white font-sans overflow-hidden"
        >
            {/* STICKY MACRO HEADER */}
            <div className="fixed top-[72px] left-0 right-0 z-40 bg-background-dark/95 backdrop-blur-md px-6 pt-3 pb-2 border-b border-white/20">
                <div className="flex items-end justify-between mb-3">
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] mb-1">Meta Diária</p>
                        <div className="flex items-baseline gap-1">
                            <h2 className="text-2xl font-bold tracking-tight text-white">{(metrics.calories.current || 0)}</h2>
                            <span className="text-xs font-bold text-zinc-500">/ {(metrics.calories.goal || 1800)} kcal</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end text-primary mb-1">
                            <span className="material-symbols-outlined text-lg">local_fire_department</span>
                            <span className="text-sm font-bold">{caloriePercentage}%</span>
                        </div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase">No Caminho</p>
                    </div>
                </div>

                <div className="h-2 w-full bg-surface-light rounded-full relative mb-4">
                    <div className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_15px_rgba(204,255,0,0.6)] transition-all duration-1000 ease-out z-10" style={{ width: `${caloriePercentage}%` }}></div>
                </div>

                <div className="flex justify-between gap-4 mb-4">
                    {[
                        { label: 'Proteína', color: 'bg-blue-500', current: macroTotals.protein, goal: macroGoals.protein },
                        { label: 'Carbos', color: 'bg-amber-500', current: macroTotals.carbs, goal: macroGoals.carbs },
                        { label: 'Gorduras', color: 'bg-secondary', current: macroTotals.fats, goal: macroGoals.fats }
                    ].map((macro, i) => {
                        const percentage = Math.min(100, Math.round((macro.current / macro.goal) * 100));

                        return (
                            <div key={i} className="flex flex-col items-center flex-1">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">{macro.label}</span>
                                <div className="h-1 w-full bg-surface-light rounded-full mb-1 relative">
                                    <div className={`h-full rounded-full ${macro.color}`} style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="text-xs font-semibold text-white tabular-nums">{Math.round(macro.current)}g</span>
                            </div>
                        );
                    })}
                </div>

                {/* BARRA DE DATAS (Dentro do header fixo) */}
                <div className="flex justify-between px-2 pt-3 border-t border-white/10">
                    {weekDays.map((day, i) => (
                        <div key={i} className={cn(
                            "flex flex-col items-center transition-all duration-300",
                            day.isToday ? "text-primary" : "opacity-40"
                        )}>
                            <span className="text-[10px] font-bold uppercase tracking-widest">{day.label}</span>
                            <span className={cn(
                                "text-sm font-bold mt-1",
                                day.isToday && "border-b-2 border-primary pb-0.5"
                            )}>{day.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            <main className="flex-1 overflow-y-auto no-scrollbar pb-24 pt-[300px] px-6 space-y-5">

                {meals.map((meal, idx) => (
                    <MealCard key={meal.id} meal={meal} isCurrent={meal.status === 'current'} />
                ))}
            </main>
        </motion.div>
    )
}

function MealCard({ meal, isCurrent }: { meal: PatientMeal, isCurrent: boolean }) {
    const checkInMutation = useCheckInMeal()
    const isMealConsumed = meal.status === 'completed'
    const totalKcal = meal.calories || 0

    const handleMealConsumed = () => {
        checkInMutation.mutate(meal.id)
    }

    return (
        <div className={cn(
            "rounded-[2rem] p-5 relative overflow-hidden transition-all duration-300 border border-white/20 snap-start",
            isMealConsumed ? "glass-card opacity-50" : (isCurrent ? "bg-surface card-gradient border border-primary/20 shadow-glow relative overflow-hidden" : "glass-card opacity-80")
        )}>
            {isCurrent && !isMealConsumed && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}

            <div className="flex justify-between items-start mb-5 pl-2">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                        isCurrent && !isMealConsumed ? "bg-primary/20 text-primary" : "bg-surface-light text-zinc-400"
                    )}>
                        <span className="material-symbols-outlined font-bold">
                            {meal.name.toLowerCase().includes('café') ? 'wb_sunny' :
                                meal.name.toLowerCase().includes('almoço') ? 'restaurant' :
                                    meal.name.toLowerCase().includes('lanche') ? 'fastfood' : 'bedtime'}
                        </span>
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg text-white leading-none">{meal.name}</h3>
                        <p className={`text-[10px] font-bold ${isMealConsumed ? "text-green-500" : "text-zinc-500"} uppercase mt-1.5 tracking-widest`}>
                            {meal.time.substring(0, 5)} • {totalKcal} kcal
                        </p>
                    </div>
                </div>
                {isCurrent && !isMealConsumed && (
                    <div className="flex gap-2">
                        <button className="w-14 items-center justify-center rounded-xl border border-white/10 text-white active:scale-95 transition-all flex">
                            <span className="material-symbols-outlined">swap_horiz</span>
                        </button>
                        <button
                            className="flex-1 bg-primary text-black font-bold text-[10px] py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95 transition-all"
                            onClick={handleMealConsumed}
                        >
                            <span className="material-symbols-outlined text-lg font-bold">check</span>
                            Registrar
                        </button>
                    </div>
                )}
                {isMealConsumed && (
                    <div className="flex flex-col items-end gap-1 mr-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                        <span className="text-[9px] font-bold text-green-500 flex items-center gap-1 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[12px] filled">check_circle</span> Consumida
                        </span>
                    </div>
                )}
            </div>

            <div className="pl-14 space-y-3 mb-6">
                {meal.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                            <span className={cn(
                                "text-sm font-medium transition-colors",
                                isMealConsumed ? "text-zinc-500 line-through" : "text-zinc-200"
                            )}>{item.name || item.food_name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 bg-surface-light px-2.5 py-1 rounded-lg tabular-nums">
                            {item.quantity}{item.unit}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    )
}
