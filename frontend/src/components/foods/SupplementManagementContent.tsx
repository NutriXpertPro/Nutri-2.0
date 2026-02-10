'use client';

import React, { useState, useEffect } from 'react'
import { Search, Plus, Filter, Download, Edit, Utensils, Info, ChevronDown, Check, Dumbbell, Flame, Zap, Cookie, Milk, Layers, Database, Sparkles } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supplementService, Supplement, SUPPLEMENT_DATA } from '@/services/supplement-service'
import { customSupplementService, CustomSupplement } from '@/services/custom-supplement-service'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import { SupplementManagementTable } from './SupplementManagementTable'
import { SupplementFormModal } from './SupplementFormModal'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function SupplementManagementContent() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sourceFilter, setSourceFilter] = useState<string>('ALL')
    const [page, setPage] = useState(1)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [editingSupplement, setEditingSupplement] = useState<any>(null)
    const debouncedSearch = useDebounce(searchQuery, 300)
    const queryClient = useQueryClient()

    // Cálculo de quantidades (Memoizado para performance)
    const counts = React.useMemo(() => {
        const sourceMap: Record<string, string> = {
            'WHEY PROTEIN': 'Whey Protein',
            'HIPER': 'Hipercalóricos',
            'CREATINA': 'Creatina',
            'AMINO': 'Amino/Albumina/Caseína',
            'TERMO_PRE': 'Termo/Pré-Treino',
            'SNACKS': 'Snacks/Pastas/Barras',
            'BEBIDAS': 'Bebidas/Géis'
        };

        const result: Record<string, number> = {
            'ALL': SUPPLEMENT_DATA.length,
            'PERSONAL': 0 // Será atualizado se houver dados da API
        };

        Object.keys(sourceMap).forEach(key => {
            result[key] = SUPPLEMENT_DATA.filter(s => s.source === sourceMap[key]).length;
        });

        return result;
    }, []);

    // Query for unified search (existing + Custom)
    const { data: searchResults, isLoading: isSearching } = useQuery({
        queryKey: ['supplements-manage', debouncedSearch, sourceFilter, page],
        queryFn: () => supplementService.search(debouncedSearch, {
            source: sourceFilter === 'ALL' ? '' :
                    sourceFilter === 'SUA TABELA' ? 'PERSONAL' :
                    sourceFilter,
            limit: 50,
            page: page
        }),
    })

    // Atualizar contagem de "Meus Itens" dinamicamente baseado na API
    const personalCount = sourceFilter === 'PERSONAL' ? (searchResults?.results?.length || 0) : 0;

    const sources = [
        {
            id: 'ALL',
            label: 'Todos',
            icon: <Layers className="w-4 h-4" />,
            colorClass: "text-zinc-500 bg-zinc-500/10",
            activeClass: 'bg-primary text-primary-foreground border-primary shadow-primary/20',
            count: counts['ALL']
        },
        {
            id: 'SUA TABELA',
            label: 'Meus Itens',
            icon: <Database className="w-4 h-4" />,
            colorClass: "text-emerald-500 bg-emerald-500/10",
            activeClass: 'bg-primary text-primary-foreground border-primary shadow-primary/20',
            count: personalCount
        },
        {
            id: 'WHEY PROTEIN',
            label: 'Whey Protein',
            icon: <Dumbbell className="w-4 h-4" />,
            colorClass: "text-blue-500 bg-blue-500/10",
            activeClass: 'bg-primary text-primary-foreground border-primary shadow-primary/20',
            count: counts['WHEY PROTEIN']
        },
        {
            id: 'HIPER',
            label: 'Hipercalóricos',
            icon: <Sparkles className="w-4 h-4" />,
            colorClass: "text-orange-500 bg-orange-500/10",
            activeClass: 'bg-primary text-primary-foreground border-primary shadow-primary/20',
            count: counts['HIPER']
        },
        {
            id: 'CREATINA',
            label: 'Creatina',
            icon: <Zap className="w-4 h-4" />,
            colorClass: "text-purple-500 bg-purple-500/10",
            activeClass: 'bg-primary text-primary-foreground border-primary shadow-primary/20',
            count: counts['CREATINA']
        },
        {
            id: 'AMINO',
            label: 'Amino/Recup.',
            icon: <Utensils className="w-4 h-4" />,
            colorClass: "text-indigo-500 bg-indigo-500/10",
            activeClass: 'bg-primary text-primary-foreground border-primary shadow-primary/20',
            count: counts['AMINO']
        },
        {
            id: 'TERMO_PRE',
            label: 'Pré-Treino',
            icon: <Flame className="w-4 h-4" />,
            colorClass: "text-red-500 bg-red-500/10",
            activeClass: 'bg-primary text-primary-foreground border-primary shadow-primary/20',
            count: counts['TERMO_PRE']
        },
        {
            id: 'SNACKS',
            label: 'Snacks/Pastas',
            icon: <Cookie className="w-4 h-4" />,
            colorClass: "text-amber-500 bg-amber-500/10",
            activeClass: 'bg-primary text-primary-foreground border-primary shadow-primary/20',
            count: counts['SNACKS']
        },
        {
            id: 'BEBIDAS',
            label: 'Bebidas/Géis',
            icon: <Milk className="w-4 h-4" />,
            colorClass: "text-cyan-500 bg-cyan-500/10",
            activeClass: 'bg-primary text-primary-foreground border-primary shadow-primary/20',
            count: counts['BEBIDAS']
        }
    ]

    const handleCreate = () => {
        setEditingSupplement(null)
        setIsFormModalOpen(true)
    }

    const handleEdit = (supplement: any) => {
        if (supplement.source !== 'Meus Suplementos') {
            toast.error("Acesso Negado", {
                description: "Somente suplementos de 'Meus Suplementos' podem ser editados."
            })
            return
        }
        setEditingSupplement(supplement)
        setIsFormModalOpen(true)
    }

    const handleCopy = (supplement: any) => {
        // Clone supplement data but remove specific identifiers to treat as new
        const supplementCopy = {
            ...supplement,
            id: undefined, // Clear ID to force create mode
            source: 'Meus Suplementos', // Force source to personal table
            nome: `${supplement.nome}${supplement.source !== 'Meus Suplementos' ? '' : ' (Cópia)'}`, // Add suffix only if copying from own table
            // Ensure zeros if null/undefined
            proteina_g: supplement.proteina_g || 0,
            lipidios_g: supplement.lipidios_g || 0,
            carboidrato_g: supplement.carboidrato_g || 0,
            energia_kcal: supplement.energia_kcal || 0,
            fibra_g: supplement.fibra_g || 0,
        }

        setEditingSupplement(supplementCopy)
        setIsFormModalOpen(true)
        toast.info("Modo de Cópia", {
            description: "Você está criando um novo suplemento baseado em um existente. Ajuste os dados se necessário."
        })
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500 mt-4">
            {/* Top Section: Search and Primary Actions */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Pesquise por nome, marca ou característica do suplemento..."
                            className="pl-12 h-12 bg-card border-border/40 rounded-2xl focus:ring-primary/20 shadow-sm w-full text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="h-12 px-6 rounded-2xl font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 border-0 w-full md:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Novo Suplemento</span>
                    </Button>
                </div>
            </div>

            {/* Category Filters: Organized Grid */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground/70">Categorias Profissionais</h3>
                    <Badge variant="outline" className="rounded-full px-3 py-0.5 bg-muted/30 border-border/20 text-[10px]">
                        {searchResults?.results?.length || 0} Itens Encontrados
                    </Badge>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                    {sources.map((src) => {
                        const isActive = sourceFilter === src.id;
                        return (
                            <button
                                key={src.id}
                                onClick={() => setSourceFilter(src.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl border transition-all duration-300 group relative overflow-hidden w-full h-full min-h-[58px]",
                                    isActive 
                                        ? `${src.activeClass} border-transparent scale-[1.02] z-10 shadow-md` 
                                        : "bg-card/50 backdrop-blur-sm border-border/40 text-muted-foreground hover:border-primary/40 hover:bg-primary/5"
                                )}
                            >
                                {/* Badge de Contagem - Presente em TODOS os botões */}
                                <span className={cn(
                                    "absolute top-1 right-1.5 text-[7px] font-bold px-1 rounded-full z-20 transition-colors",
                                    isActive 
                                        ? "bg-foreground/20 text-primary-foreground" 
                                        : "bg-muted text-foreground/60 dark:text-white/60"
                                )}>
                                    {src.count}
                                </span>

                                <div className={cn(
                                    "p-1 rounded-lg transition-all duration-300 flex-shrink-0",
                                    isActive ? "bg-foreground/10 text-primary-foreground" : `${src.colorClass} group-hover:scale-110`
                                )}>
                                    {src.icon}
                                </div>
                                <span className={cn(
                                    "text-[10px] uppercase tracking-tighter text-center transition-all leading-[1.1] flex items-center justify-center min-h-[20px]",
                                    isActive ? "text-primary-foreground font-medium" : "group-hover:text-foreground font-normal"
                                )}>
                                    {src.label}
                                </span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-pill"
                                        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col gap-4 min-h-[400px]">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center p-32 gap-6 bg-card/10 rounded-[3rem] border border-border/5">
                        <div className="relative">
                            <Utensils className="w-16 h-16 text-primary animate-pulse opacity-20" />
                            <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs uppercase tracking-[0.4em] text-primary/60 font-medium animate-pulse">
                                Sincronizando Base
                            </span>
                            <span className="text-[10px] text-muted-foreground/40 italic">Acessando Tabelas de Suplementos...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <SupplementManagementTable
                            supplements={searchResults?.results || []}
                            onEdit={handleEdit}
                            onCopy={handleCopy}
                            sourceFilter={sourceFilter}
                        />

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between p-4 bg-card border border-border/10 rounded-2xl shadow-sm mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || isSearching}
                                className="text-xs uppercase font-medium tracking-wider rounded-xl border-primary/20 text-primary hover:bg-primary/10 hover:text-primary disabled:opacity-50 h-8 w-24"
                            >
                                Anterior
                            </Button>
                            <div className="flex items-center justify-center h-8 w-24 bg-primary/10 rounded-xl border border-primary/20">
                                <span className="text-[10px] uppercase font-bold text-primary tracking-[0.1em]">
                                    Página {page}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={!searchResults?.next || isSearching}
                                className="text-xs uppercase font-medium tracking-wider rounded-xl border-primary/20 text-primary hover:bg-primary/10 hover:text-primary disabled:opacity-50 h-8 w-24"
                            >
                                Próxima
                            </Button>
                        </div>
                    </>
                )}
            </div>

            <SupplementFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                supplement={editingSupplement}
            />
        </div>
    )
}