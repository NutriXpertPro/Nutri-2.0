"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useExams } from "@/hooks/useExams"

const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
}

export function ExamsTab() {
    const [filter, setFilter] = React.useState('all')
    const { exams, loading } = useExams()

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        } catch {
            return dateStr
        }
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return ''
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const filteredExams = exams.filter(exam => {
        if (filter === 'all') return true
        if (filter === 'pending') return !exam.notes || exam.notes.trim() === ''
        if (filter === 'done') return exam.notes && exam.notes.trim() !== ''
        return true
    })

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen bg-background-dark text-white font-sans overflow-hidden"
        >
            <header className="flex-none px-6 pt-4 pb-4 flex items-center justify-between sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
                <div className="text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Exames</h1>
                    <p className="text-sm text-zinc-400 font-medium tracking-tight">Últimos resultados</p>
                </div>
                <button className="flex items-center justify-center h-12 px-6 rounded-full bg-primary text-black font-bold gap-2 shadow-neon transition-transform active:scale-95">
                    <span className="material-symbols-outlined font-bold">upload_file</span>
                    <span className="uppercase tracking-widest text-[10px]">Enviar</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar pb-24 pt-6 px-6 space-y-8">
                {/* Filter Tabs */}
                <div className="flex p-1 bg-surface rounded-2xl border border-white/5">
                    {[
                        { id: 'all', label: 'Todos' },
                        { id: 'pending', label: 'Análise' },
                        { id: 'done', label: 'Vistos' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={cn(
                                "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                                filter === tab.id
                                    ? "bg-[#25252A] text-white shadow-lg border border-white/10"
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Exams List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Meus Documentos</h2>
                        <span className="material-symbols-outlined text-zinc-600 text-lg">search</span>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-xs text-zinc-500">Carregando exames...</p>
                        </div>
                    ) : filteredExams.length === 0 ? (
                        <div className="text-center py-12 opacity-60">
                            <span className="material-symbols-outlined text-4xl text-zinc-500 mb-3 block">folder_open</span>
                            <p className="text-sm font-bold text-zinc-400">
                                {filter === 'all' ? 'Nenhum exame enviado' : filter === 'pending' ? 'Nenhum em análise' : 'Nenhum revisado'}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">Envie seus exames para análise do nutricionista.</p>
                        </div>
                    ) : (
                        filteredExams.map((exam) => {
                            const hasNotes = exam.notes && exam.notes.trim() !== ''
                            const status = hasNotes ? 'done' : 'pending'

                            return (
                                <div key={exam.id} className="glass-card p-4 rounded-3xl border-none shadow-sm flex items-start gap-4 active:bg-white/5 transition-colors group relative overflow-hidden">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 transition-colors",
                                        status === 'pending' ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                                    )}>
                                        <span className="material-symbols-outlined text-3xl font-light">
                                            {exam.file_type?.includes('pdf') ? 'picture_as_pdf' : 'description'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5 text-left">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-base text-zinc-100 truncate pr-4 leading-tight">{exam.file_name}</h3>
                                            <span className="material-symbols-outlined text-zinc-600">more_vert</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1.5 tracking-wider">
                                            {formatDate(exam.uploaded_at)}
                                        </p>

                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-4 border text-[9px] font-bold uppercase tracking-wider",
                                            status === 'pending'
                                                ? "bg-secondary/5 border-secondary/20 text-secondary"
                                                : "bg-primary/5 border-primary/20 text-primary"
                                        )}>
                                            <span className="material-symbols-outlined text-[14px]">
                                                {status === 'pending' ? 'history' : 'verified'}
                                            </span>
                                            {status === 'pending' ? 'Em Análise' : 'Revisado'}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Upload CTA */}
                <div className="mt-6">
                    <div className="bg-gradient-to-br from-primary/5 to-transparent border border-white/5 rounded-[2.5rem] p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                            <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-lg text-white">Adicionar Exame</h4>
                            <p className="text-[11px] text-zinc-500 font-medium px-4 leading-relaxed">Envie seus resultados para uma análise completa do coach.</p>
                        </div>
                        <button className="w-full h-14 rounded-2xl bg-surface border border-white/10 text-primary font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
                            Selecionar Arquivo
                        </button>
                    </div>
                </div>
            </main>
        </motion.div>
    )
}
