"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEvolution, useMeasurements } from "@/hooks/useEvolution"
import { useComparisonPhotos } from "@/hooks/useComparisonPhotos"
import { usePatient } from "@/contexts/patient-context"
import { Card } from "@/components/ui/card"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts'
import { cn } from "@/lib/utils"

const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
}

export function EvolutionTab() {
    const { patient } = usePatient()
    const [view, setView] = React.useState<'stats' | 'photos' | 'measures'>('stats')

    const { data: weightData, loading: loadingWeight } = useEvolution('weight')
    const { data: fatData } = useEvolution('fat')
    const { data: muscleData } = useEvolution('muscle')
    const { comparison } = useComparisonPhotos()
    const { measurements, loading: loadingMeasures } = useMeasurements()

    const currentWeight = weightData.length > 0 ? (weightData[weightData.length - 1].value || 0) : 0
    const lastWeight = weightData.length > 1 ? (weightData[weightData.length - 2].value || 0) : 0
    const weightDiff = weightData.length > 1 ? currentWeight - lastWeight : 0

    const firstWeight = weightData.length > 0 ? (weightData[0].value || 0) : 0
    const totalLoss = weightData.length > 1 ? firstWeight - currentWeight : 0

    const currentFat = fatData.length > 0 ? (fatData[fatData.length - 1].value || 0) : 0

    const heightInMeters = patient?.height ? patient.height / 100 : 1.70
    const imc = currentWeight > 0 ? currentWeight / (heightInMeters * heightInMeters) : 0

    const noData = weightData.length === 0 && !loadingWeight

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen bg-background-dark text-white font-sans overflow-hidden"
        >
            <header className="flex-none px-6 pt-4 pb-4 flex items-center justify-between sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Evolução</h1>
                    <p className="text-sm text-zinc-400 font-medium tracking-tight">Mantenha o ritmo</p>
                </div>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-white/10 text-primary hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined">share</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative px-6">
                {/* Tab Switcher */}
                <div className="mb-8 mt-2">
                    <div className="glass-panel rounded-full p-1.5 flex relative">
                        <motion.div
                            className="absolute bg-primary rounded-full shadow-neon z-0 h-[calc(100%-12px)] top-1.5"
                            initial={false}
                            animate={{
                                width: "calc(33.33% - 4px)",
                                left: view === 'stats' ? "6px" : view === 'photos' ? "calc(33.33% + 2px)" : "calc(66.66% - 2px)"
                            }}
                        />
                        <button onClick={() => setView('stats')} className={cn("relative z-10 flex-1 py-2 text-sm font-bold text-center rounded-full transition-all", view === 'stats' ? "text-black" : "text-zinc-500")}>
                            Status
                        </button>
                        <button onClick={() => setView('photos')} className={cn("relative z-10 flex-1 py-2 text-sm font-bold text-center rounded-full transition-all", view === 'photos' ? "text-black" : "text-zinc-500")}>
                            Fotos
                        </button>
                        <button onClick={() => setView('measures')} className={cn("relative z-10 flex-1 py-2 text-sm font-bold text-center rounded-full transition-all", view === 'measures' ? "text-black" : "text-zinc-500")}>
                            Medidas
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'stats' && (
                        <motion.div key="stats" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                            {noData ? (
                                <div className="text-center py-16 opacity-60">
                                    <span className="material-symbols-outlined text-5xl text-zinc-500 mb-4 block">monitoring</span>
                                    <p className="text-sm font-bold text-zinc-400">Sem dados de evolução</p>
                                    <p className="text-xs text-zinc-500 mt-1">Aguarde o nutricionista registrar suas medidas.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
                                            <div className="relative z-10">
                                                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Peso Atual</span>
                                                <div className="flex items-baseline mt-2 gap-1">
                                                    <span className="text-3xl font-extrabold text-white tracking-tighter">{currentWeight > 0 ? currentWeight.toFixed(1) : '--'}</span>
                                                    <span className="text-xs text-zinc-500 font-bold uppercase">kg</span>
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex items-center gap-1 text-primary">
                                                <span className="material-symbols-outlined text-[16px]">{weightDiff <= 0 ? 'trending_down' : 'trending_up'}</span>
                                                <span className="text-xs font-bold">{Math.abs(weightDiff).toFixed(1)} kg</span>
                                                <span className="text-[10px] text-zinc-500 ml-1 font-medium">vs anterior</span>
                                            </div>
                                        </div>

                                        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/10 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
                                            <div className="relative z-10">
                                                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Perda Total</span>
                                                <div className="flex items-baseline mt-2 gap-1">
                                                    <span className="text-3xl font-extrabold text-white tracking-tighter">{totalLoss > 0 ? totalLoss.toFixed(1) : '0.0'}</span>
                                                    <span className="text-xs text-zinc-500 font-bold uppercase">kg</span>
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex items-center gap-1 text-secondary">
                                                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                                                <span className="text-xs font-bold uppercase tracking-widest">{totalLoss > 0 ? 'No Foco!' : 'Continue!'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weight Chart */}
                                    <Card className="glass-panel p-6 rounded-[2rem] border-none shadow-md space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold">Tendência de Peso</h3>
                                            <div className="flex gap-2">
                                                <button className="text-[10px] font-bold bg-white/10 text-white px-3 py-1 rounded-full uppercase tracking-widest">1M</button>
                                                <button className="text-[10px] font-bold text-zinc-500 px-3 py-1 rounded-full uppercase tracking-widest">3M</button>
                                            </div>
                                        </div>
                                        <div className="h-48 w-full relative">
                                            <ResponsiveContainer width="99%" height={192}>
                                                <AreaChart data={weightData}>
                                                    <defs>
                                                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#CCFF00" stopOpacity={0.3} />
                                                            <stop offset="100%" stopColor="#CCFF00" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                                    <XAxis dataKey="date" hide />
                                                    <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: 'rgba(30,30,34,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                                        itemStyle={{ color: '#CCFF00' }}
                                                        labelStyle={{ display: 'none' }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="value"
                                                        stroke="#CCFF00"
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#chartFill)"
                                                        animationDuration={1500}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] border-t border-white/5 pt-4 px-1">
                                            <span>Início</span>
                                            <span>Hoje</span>
                                        </div>
                                    </Card>

                                    {/* IMC + Fat */}
                                    <div className="grid grid-cols-2 gap-4 pb-4">
                                        <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-none">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <span className="material-symbols-outlined">accessibility_new</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">IMC</p>
                                                <p className="text-xl font-extrabold tracking-tight">{imc > 0 ? imc.toFixed(1) : '--'}</p>
                                            </div>
                                        </div>
                                        <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-none">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                                <span className="material-symbols-outlined">water_drop</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Gordura</p>
                                                <p className="text-xl font-extrabold tracking-tight">{currentFat > 0 ? `${currentFat}%` : '--'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {view === 'photos' && (
                        <motion.div key="photos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-8">
                            {comparison && (comparison.initial.front || comparison.current.front) ? (
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Comparação</h3>
                                    {['front', 'side', 'back'].map((angle) => {
                                        const initial = comparison.initial[angle as keyof typeof comparison.initial]
                                        const current = comparison.current[angle as keyof typeof comparison.current]
                                        if (!initial && !current) return null
                                        return (
                                            <div key={angle} className="space-y-2">
                                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                                    {angle === 'front' ? 'Frente' : angle === 'side' ? 'Lateral' : 'Costas'}
                                                </p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="glass-panel rounded-2xl overflow-hidden aspect-[3/4]">
                                                        {typeof initial === 'string' && initial ? (
                                                            <img src={initial} alt="Inicial" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                                <span className="material-symbols-outlined text-3xl">photo_camera</span>
                                                            </div>
                                                        )}
                                                        <p className="text-[9px] text-center py-1 text-zinc-500 uppercase font-bold">Inicial</p>
                                                    </div>
                                                    <div className="glass-panel rounded-2xl overflow-hidden aspect-[3/4]">
                                                        {current && typeof current === 'object' && current.url ? (
                                                            <img src={current.url} alt="Atual" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                                <span className="material-symbols-outlined text-3xl">photo_camera</span>
                                                            </div>
                                                        )}
                                                        <p className="text-[9px] text-center py-1 text-zinc-500 uppercase font-bold">Atual</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16 opacity-50">
                                    <span className="material-symbols-outlined text-4xl mb-2">photo_camera</span>
                                    <p className="text-xs font-bold uppercase tracking-widest">Nenhuma foto registrada</p>
                                    <p className="text-xs text-zinc-500 mt-2">Envie fotos de progresso para acompanhar visualmente.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {view === 'measures' && (
                        <motion.div key="measures" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-4">
                            {loadingMeasures ? (
                                <div className="text-center py-12">
                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-xs text-zinc-500">Carregando medidas...</p>
                                </div>
                            ) : measurements.length === 0 ? (
                                <div className="text-center py-16 opacity-50">
                                    <span className="material-symbols-outlined text-4xl mb-2">straighten</span>
                                    <p className="text-xs font-bold uppercase tracking-widest">Nenhuma medida registrada</p>
                                    <p className="text-xs text-zinc-500 mt-2">Aguarde o nutricionista registrar suas medidas corporais.</p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Medidas Corporais</h3>
                                    {measurements.map((m, idx) => {
                                        const diff = m.current - m.initial
                                        return (
                                            <div key={idx} className="glass-panel p-4 rounded-2xl flex items-center justify-between border-none">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <span className="material-symbols-outlined">straighten</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{m.bodyPart}</p>
                                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                                            {m.initial}{m.unit} → {m.current}{m.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "flex items-center gap-1 text-sm font-bold",
                                                    diff < 0 ? "text-primary" : diff > 0 ? "text-secondary" : "text-zinc-500"
                                                )}>
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {diff < 0 ? 'trending_down' : diff > 0 ? 'trending_up' : 'trending_flat'}
                                                    </span>
                                                    {Math.abs(diff).toFixed(1)}{m.unit}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="fixed bottom-24 right-6 z-40">
                    <button className="h-14 w-14 rounded-full bg-primary text-black shadow-neon flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>add</span>
                    </button>
                </div>
            </main>
        </motion.div>
    )
}
