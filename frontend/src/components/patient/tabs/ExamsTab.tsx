"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    FileText,
    Upload,
    MoreHorizontal,
    FilePlus,
    CheckCircle2,
    Clock,
    Search,
    FileIcon,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
}

export function ExamsTab() {
    const [filter, setFilter] = React.useState('all')

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen pt-24 pb-28 px-4 space-y-6"
        >
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Exames</h1>
                <Button className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-white gap-2 px-5 py-6">
                    <FilePlus className="h-5 w-5" />
                    <span className="uppercase tracking-widest text-[10px] font-black">Enviar</span>
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1 bg-muted/30 rounded-2xl border border-border/10">
                {[
                    { id: 'all', label: 'Todos' },
                    { id: 'pending', label: 'Em Análise' },
                    { id: 'reviewed', label: 'Revisados' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={cn(
                            "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all",
                            filter === tab.id
                                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Resultados Recentes</h2>

                {[
                    { id: 1, name: "Hemograma Completo", date: "24 Out, 2025", size: "2.4 MB", status: "pending" },
                    { id: 2, name: "Perfil Lipídico", date: "10 Set, 2025", size: "1.1 MB", status: "reviewed" },
                    { id: 3, name: "Glicemia de Jejum", date: "15 Ago, 2025", size: "0.8 MB", status: "reviewed" },
                ].map((exam) => (
                    <Card key={exam.id} className="glass-card p-4 rounded-3xl border-none shadow-sm flex items-start gap-4 hover:bg-emerald-500/5 transition-all group">
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner transition-colors",
                            exam.status === 'pending' ? "bg-orange-500/10 text-orange-500" : "bg-emerald-500/10 text-emerald-500"
                        )}>
                            <FileText className="h-7 w-7" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-base truncate pr-6 leading-tight">{exam.name}</h3>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                                {exam.date} • {exam.size}
                            </p>

                            <div className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-3 border text-[9px] font-black uppercase tracking-wider",
                                exam.status === 'pending'
                                    ? "bg-orange-500/5 border-orange-500/20 text-orange-600"
                                    : "bg-emerald-500/5 border-emerald-500/20 text-emerald-600"
                            )}>
                                {exam.status === 'pending' ? (
                                    <>
                                        <Clock className="h-3 w-3" />
                                        <span>Em Análise</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-3 w-3" />
                                        <span>Revisado</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State / CTA */}
            <div className="mt-8">
                <div className="bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/10 rounded-[2.5rem] p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-600">
                        <Upload className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg">Novos exames?</h4>
                        <p className="text-xs text-muted-foreground font-medium px-4">Mantenha seu plano atualizado enviando seus últimos exames laboratoriais.</p>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-2xl glass-card border-emerald-500/20 text-emerald-600 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-emerald-500/5">
                        Procurar Arquivo
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
