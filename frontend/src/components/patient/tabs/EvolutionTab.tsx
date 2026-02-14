"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEvolution, useMeasurements } from "@/hooks/useEvolution"
import { useComparisonPhotos } from "@/hooks/useComparisonPhotos"
import {
    TrendingDown,
    Scale,
    Ruler,
    Trophy,
    Camera,
    Activity,
    ChevronRight,
    ArrowDownRight,
    ArrowUpRight,
    Info
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer as RC
} from 'recharts'
import { cn } from "@/lib/utils"

const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
}

export function EvolutionTab() {
    const [view, setView] = React.useState<'stats' | 'photos' | 'measures'>('stats')
    const { data: weightData, loading: weightLoading } = useEvolution('weight')
    const { comparison, loading: compLoading } = useComparisonPhotos()
    const { measurements, loading: measLoading } = useMeasurements()

    const currentWeight = weightData.length > 0 ? (weightData[weightData.length - 1].value || 0) : 0
    const initialWeight = weightData.length > 0 ? (weightData[0].value || 0) : 0
    const weightDiff = currentWeight - initialWeight

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen pt-20 pb-28 px-4 space-y-6"
        >
            {/* Header / Subnav */}
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Evolução</h1>
                <div className="flex bg-muted/30 p-1 rounded-2xl border border-border/10">
                    {[
                        { id: 'stats', label: 'Status' },
                        { id: 'photos', label: 'Fotos' },
                        { id: 'measures', label: 'Medidas' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id as any)}
                            className={cn(
                                "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                                view === tab.id
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'stats' && (
                    <motion.div key="stats" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                        {/* Comparison Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="glass-card p-4 rounded-3xl relative overflow-hidden border-none shadow-md">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <Scale className="h-12 w-12" />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Peso Atual</span>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold tabular-nums">{currentWeight || "--"}</span>
                                    <span className="text-xs text-muted-foreground">kg</span>
                                </div>
                                <div className={cn(
                                    "mt-3 flex items-center gap-1 text-[10px] font-bold",
                                    weightDiff <= 0 ? "text-emerald-500" : "text-orange-500"
                                )}>
                                    {weightDiff <= 0 ? <TrendingDown className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                                    {Math.abs(weightDiff).toFixed(1)}kg
                                    <span className="text-muted-foreground/60 ml-0.5">desde o início</span>
                                </div>
                            </Card>

                            <Card className="glass-card p-4 rounded-3xl relative overflow-hidden border-none shadow-md">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <Activity className="h-12 w-12 text-emerald-500" />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Meta de Peso</span>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold tabular-nums">75.0</span>
                                    <span className="text-xs text-muted-foreground">kg</span>
                                </div>
                                <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-blue-500">
                                    <Trophy className="h-3 w-3 fill-blue-500" />
                                    No Foco!
                                </div>
                            </Card>
                        </div>

                        {/* Chart */}
                        <Card className="glass-card p-6 rounded-[2.5rem] border-none shadow-md space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">Tendência de Peso</h3>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-foreground/5">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                            <div className="h-48 w-full -ml-6" style={{ minWidth: 0 }}>
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <AreaChart data={weightData}>
                                        <defs>
                                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--emerald-500)" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="var(--emerald-500)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="date" hide />
                                        <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                                            itemStyle={{ color: '#10b981' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorWeight)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-t border-white/5 pt-4">
                                <span>Jan 15</span>
                                <span>Hoje</span>
                            </div>
                        </Card>

                        {/* Achievements */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg pl-1">Conquistas</h3>
                            <div className="glass-card p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-emerald-500">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Trophy className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Meta 80kg Atingida</h4>
                                    <p className="text-[10px] text-muted-foreground font-medium">Concluído em 12 Fev</p>
                                </div>
                                <div className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                                    Check!
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === 'photos' && (
                    <motion.div key="photos" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                        {[
                            { label: "Frente", key: "front" },
                            { label: "Lado", key: "side" },
                            { label: "Costas", key: "back" }
                        ].map((angle) => {
                            const initialUrl = (comparison?.initial as any)?.[angle.key]
                            const currentUrl = (comparison?.current as any)?.[angle.key]?.url

                            return (
                                <div key={angle.key} className="space-y-4">
                                    <div className="flex items-center gap-2 border-b border-border/10 pb-2">
                                        <span className="text-xs font-black uppercase tracking-[0.2em]">{angle.label}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Foto Inicial */}
                                        <div className="space-y-2">
                                            <div className="text-center">
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Inicial</span>
                                            </div>
                                            <div className="aspect-[3/4] rounded-3xl bg-muted/20 border border-border/10 overflow-hidden relative shadow-sm">
                                                {initialUrl ? (
                                                    <img src={initialUrl} alt="Inicial" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                                                        <Camera className="h-8 w-8 mb-1" />
                                                        <span className="text-[8px] font-bold uppercase">Sem Foto</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Foto Atual */}
                                        <div className="space-y-2">
                                            <div className="text-center">
                                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Atual</span>
                                            </div>
                                            <div className="aspect-[3/4] rounded-3xl bg-emerald-500/5 border border-emerald-500/20 overflow-hidden relative shadow-md">
                                                {currentUrl ? (
                                                    <img src={currentUrl} alt="Atual" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-600/30">
                                                        <Camera className="h-10 w-10 mb-2" />
                                                        <Button variant="ghost" size="sm" className="h-6 text-[8px] font-bold bg-emerald-500/10 uppercase">Adicionar</Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </motion.div>
                )}

                {view === 'measures' && (
                    <motion.div key="measures" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {measurements?.map((m, idx) => (
                                <Card key={idx} className="glass-card p-5 rounded-3xl border-none shadow-sm flex items-center justify-between group hover:bg-emerald-500/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors">
                                            <Ruler className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">{m.bodyPart}</h4>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Histórico de Medidas</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <span className="block text-[8px] font-bold text-muted-foreground uppercase">Inicial</span>
                                            <span className="text-sm font-bold tabular-nums text-muted-foreground">{m.initial}{m.unit}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[8px] font-bold text-emerald-500 uppercase">Atual</span>
                                            <span className="text-lg font-bold tabular-nums">{m.current}{m.unit}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Action Button */}
            <div className="fixed bottom-24 right-6 z-40">
                <Button className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:scale-110 active:scale-95 transition-all">
                    <Camera className="h-7 w-7" />
                </Button>
            </div>
        </motion.div>
    )
}
