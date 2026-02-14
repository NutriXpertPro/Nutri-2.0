"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { usePatientDiet } from "@/hooks/use-patient-diet"
import {
    Flame,
    Utensils,
    Check,
    RefreshCcw,
    Clock,
    Sun,
    Moon,
    Sunset,
    ChevronDown,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
}

export function DietTab() {
    const { data: diet, isLoading } = usePatientDiet()

    if (isLoading) {
        return (
            <div className="p-4 pt-24 space-y-6">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-60 w-full rounded-2xl" />
                <Skeleton className="h-60 w-full rounded-2xl" />
            </div>
        )
    }

    if (!diet) {
        return (
            <div className="p-4 pt-24 text-center space-y-4">
                <Utensils className="h-12 w-12 text-muted-foreground mx-auto" />
                <h2 className="text-xl font-bold">Nenhum plano ativo</h2>
                <p className="text-muted-foreground">Você ainda não possui um plano alimentar ativo. Entre em contato com seu nutricionista.</p>
            </div>
        )
    }

    const totalCalories = diet.meals_rel?.reduce((acc, m) =>
        acc + m.items?.reduce((sum, i) => sum + (i.calories || 0), 0), 0
    ) || 0

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen pt-40 pb-28 px-4 space-y-6"
        >
            {/* Sticky Macro Header */}
            <div className="fixed top-16 left-0 right-0 z-40 glass-header px-6 py-4 border-b border-border/10">
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Meta Diária</p>
                        <div className="flex items-baseline gap-1">
                            <h2 className="text-3xl font-bold tracking-tight">{totalCalories.toLocaleString()}</h2>
                            <span className="text-sm font-medium text-muted-foreground">/ {diet.target_calories} kcal</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end text-emerald-500 mb-0.5">
                            <Zap className="h-4 w-4 fill-emerald-500" />
                            <span className="text-sm font-bold">60%</span>
                        </div>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase">No Caminho</p>
                    </div>
                </div>
                <Progress value={60} className="h-2 bg-emerald-500/10" indicatorClassName="bg-emerald-500" />

                <div className="flex justify-between mt-4 gap-4">
                    <MacroIndicator label="Prot" value={diet.target_protein} current={140} color="bg-blue-500" />
                    <MacroIndicator label="Carbos" value={diet.target_carbs} current={120} color="bg-amber-500" />
                    <MacroIndicator label="Gords" value={diet.target_fats} current={45} color="bg-orange-500" />
                </div>
            </div>

            {/* Meal List */}
            <div className="space-y-5">
                {diet.meals_rel?.sort((a, b) => a.order - b.order).map((meal, idx) => (
                    <MealCard key={meal.id} meal={meal} isCurrent={idx === 1} />
                ))}
            </div>
        </motion.div>
    )
}

function MacroIndicator({ label, value, current, color }: { label: string, value: number, current: number, color: string }) {
    const percent = Math.min((current / value) * 100, 100)
    return (
        <div className="flex flex-col items-center flex-1">
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-1">{label}</span>
            <div className="h-1 w-full bg-muted/30 rounded-full mb-1">
                <div className={cn("h-full rounded-full", color)} style={{ width: `${percent}%` }} />
            </div>
            <span className="text-[11px] font-bold">{current}g</span>
        </div>
    )
}

function MealCard({ meal, isCurrent }: { meal: any, isCurrent?: boolean }) {
    const totalKcal = meal.items?.reduce((sum: number, i: any) => sum + (i.calories || 0), 0) || 0

    // Escolher ícone baseado no nome da refeição
    const getIcon = () => {
        const name = meal.name.toLowerCase()
        if (name.includes("café") || name.includes("desjejum")) return <Sun className="h-5 w-5" />
        if (name.includes("almoço")) return <Zap className="h-5 w-5" />
        if (name.includes("lanche")) return <Utensils className="h-5 w-5" />
        if (name.includes("jantar") || name.includes("ceia")) return <Moon className="h-5 w-5" />
        return <Clock className="h-5 w-5" />
    }

    return (
        <div className={cn(
            "rounded-[2rem] p-5 border transition-all duration-300",
            isCurrent
                ? "bg-emerald-500/5 border-emerald-500/20 shadow-lg scale-[1.02]"
                : "glass-card border-white/5 opacity-80"
        )}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                        isCurrent ? "bg-emerald-500/10 text-emerald-600" : "bg-muted/30 text-muted-foreground"
                    )}>
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-none">{meal.name}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-wider">
                            {meal.time.substring(0, 5)} • {totalKcal} kcal
                        </p>
                    </div>
                </div>
                {isCurrent && (
                    <div className="bg-emerald-500 text-white p-1 rounded-full">
                        <Check className="h-3 w-3" />
                    </div>
                )}
            </div>

            <div className="pl-[52px] space-y-3 mb-6">
                {meal.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                            <span className="text-sm font-medium">{item.food_name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-lg tabular-nums">
                            {item.quantity}{item.unit}
                        </span>
                    </div>
                ))}
            </div>

            {isCurrent && (
                <div className="pl-[52px] flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-11 rounded-xl glass-card border-emerald-500/20 text-emerald-600 font-bold uppercase text-[10px] tracking-widest">
                        <RefreshCcw className="h-3.5 w-3.5 mr-2" /> Substituir
                    </Button>
                    <Button size="sm" className="flex-[1.5] h-11 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-lg">
                        <Check className="h-3.5 w-3.5 mr-2" /> Registrar
                    </Button>
                </div>
            )}
        </div>
    )
}
