"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRightLeft, Scale, Flame, Zap, ChefHat, Milk, Wheat, Leaf, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import api from "@/services/api"

export interface Substitution {
    id?: string
    name: string
    quantity: number
    unit: string
    kcal: number
    protein: number
    carbs: number
    fats: number
    group?: string
    obs?: string
    source?: string
    is_vegan?: boolean
    is_vegetarian?: boolean
    is_gluten_free?: boolean
    similarity_score?: number
}

interface SubstitutionDrawerProps {
    originalFood: {
        id?: string
        name: string
        quantity: number
        unit: string
        kcal: number
        protein?: number
        carbs?: number
        fat?: number
    }
    substitutions?: Substitution[]
    trigger?: React.ReactNode
    onApplySubstitution?: (substitute: Substitution) => Promise<void>
    mealId?: string
    foodItemId?: string
}

// Helper para selecionar ícone baseado no grupo
const getGroupIcon = (group: string = "") => {
    const g = group.toLowerCase()
    if (g.includes("carbo") || g.includes("cereal") || g.includes("pão")) return <Wheat className="w-4 h-4" />
    if (g.includes("leite") || g.includes("laticínio") || g.includes("queijo")) return <Milk className="w-4 h-4" />
    if (g.includes("verdura") || g.includes("legume") || g.includes("fruta")) return <Leaf className="w-4 h-4" />
    if (g.includes("proteína") || g.includes("carne") || g.includes("ovo")) return <ChefHat className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
}

// Badge de restrição alimentar
const DietaryBadge = ({ is_vegan, is_vegetarian, is_gluten_free }: { 
    is_vegan?: boolean
    is_vegetarian?: boolean
    is_gluten_free?: boolean 
}) => {
    if (is_vegan) {
        return (
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-[9px] px-1.5 h-5">
                Vegano
            </Badge>
        )
    }
    if (is_vegetarian) {
        return (
            <Badge variant="outline" className="bg-lime-50 text-lime-600 border-lime-200 text-[9px] px-1.5 h-5">
                Vegetariano
            </Badge>
        )
    }
    if (is_gluten_free) {
        return (
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-[9px] px-1.5 h-5">
                Sem Glúten
            </Badge>
        )
    }
    return null
}

export function SubstitutionDrawer({ 
    originalFood, 
    substitutions: initialSubstitutions, 
    trigger,
    onApplySubstitution,
    mealId,
    foodItemId
}: SubstitutionDrawerProps) {
    const [open, setOpen] = useState(false)
    const [selectedSub, setSelectedSub] = useState<Substitution | null>(null)
    const [isApplying, setIsApplying] = useState(false)
    const [substitutions, setSubstitutions] = useState<Substitution[]>(initialSubstitutions || [])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Buscar substituições da API quando o drawer abrir
    useEffect(() => {
        if (open && originalFood.id && !initialSubstitutions) {
            fetchSubstitutions()
        }
    }, [open, originalFood.id])

    const fetchSubstitutions = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            // Extrair ID do alimento (remover prefixo TACO_, etc)
            const foodId = originalFood.id?.replace(/^(TACO_|TBCA_|USDA_|Sua Tabela_)/, '')
            
            // Construir URL com parâmetros
            const params = new URLSearchParams({
                food_id: originalFood.id || '',
                food_name: originalFood.name,
                food_source: 'TACO',
                quantity: originalFood.quantity.toString(),
                diet_type: 'normocalorica',
            })

            // Adicionar macros se disponíveis
            if (originalFood.protein !== undefined) {
                params.append('orig_ptn', (originalFood.protein * originalFood.quantity / 100).toFixed(2))
            }
            if (originalFood.carbs !== undefined) {
                params.append('orig_cho', (originalFood.carbs * originalFood.quantity / 100).toFixed(2))
            }
            if (originalFood.fat !== undefined) {
                params.append('orig_fat', (originalFood.fat * originalFood.quantity / 100).toFixed(2))
            }

            const response = await api.get(`/diets/substitutions/suggest/?${params.toString()}`)
            
            if (response.data && response.data.substitutions) {
                // Mapear resposta da API para o formato Substitution
                const mappedSubs: Substitution[] = response.data.substitutions.map((sub: any) => ({
                    id: sub.id,
                    name: sub.food?.nome || sub.name || 'Alimento',
                    quantity: sub.suggested_quantity || sub.quantity || 100,
                    unit: 'g',
                    kcal: sub.food?.energia_kcal || sub.kcal || 0,
                    protein: sub.food?.proteina_g || sub.protein || 0,
                    carbs: sub.food?.carboidrato_g || sub.carbs || 0,
                    fats: sub.food?.lipidios_g || sub.fats || 0,
                    group: sub.food?.grupo || sub.group || '',
                    similarity_score: sub.similarity_score ? Math.round(sub.similarity_score * 100) : 0,
                    is_vegan: sub.is_vegan,
                    is_vegetarian: sub.is_vegetarian,
                    is_gluten_free: sub.is_gluten_free,
                    source: sub.food?.source || sub.source || 'AUTO',
                }))
                
                setSubstitutions(mappedSubs)
            } else {
                setSubstitutions([])
            }
        } catch (err: any) {
            setError('Erro ao carregar substituições. Tente novamente.')
            toast.error('Erro ao buscar substituições')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelect = (sub: Substitution) => {
        setSelectedSub(sub)
    }

    const handleApply = async () => {
        if (!selectedSub) {
            toast.error("Selecione uma substituição primeiro")
            return
        }

        if (!onApplySubstitution) {
            toast.error("Função de aplicação não configurada")
            return
        }

        setIsApplying(true)
        try {
            await onApplySubstitution(selectedSub)
            toast.success(`Substituição aplicada: ${selectedSub.name}`)
            setOpen(false)
            setSelectedSub(null)
        } catch (_error) {
            toast.error("Erro ao aplicar substituição. Tente novamente.")
        } finally {
            setIsApplying(false)
        }
    }

    // Se não temos substituições e não estamos carregando, não mostrar o drawer
    if (!isLoading && substitutions.length === 0 && !initialSubstitutions) {
        return trigger || null
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {trigger || (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 px-3 text-[11px] uppercase font-bold text-emerald-600 bg-emerald-50/80 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-200/50 rounded-full transition-all shadow-sm backdrop-blur-sm"
                    >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Substituir
                    </Button>
                )}
            </DrawerTrigger>
            <DrawerContent className="h-[88vh] flex flex-col rounded-t-[36px] border-none bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-2xl">

                {/* Handle Bar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 backdrop-blur-md z-50" />

                <DrawerHeader className="relative px-6 pt-10 pb-4 flex-shrink-0 text-left">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="w-fit bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50 px-2.5 py-0.5 text-[10px] tracking-wider font-bold uppercase rounded-md shadow-sm">
                                Opções Disponíveis
                            </Badge>
                        </div>
                        <DrawerTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                            Substituições
                        </DrawerTitle>
                        <DrawerDescription className="text-base text-zinc-500 dark:text-zinc-400 font-medium">
                            Alternativas para <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{originalFood.name}</span>
                        </DrawerDescription>
                    </div>

                    {/* Card do Alimento Original - Destaque */}
                    <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 shadow-inner relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ChefHat className="w-16 h-16 text-emerald-600 dark:text-emerald-400 rotate-12" />
                        </div>

                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block mb-1">
                                    Alimento Original
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 items-center flex gap-1">
                                        {originalFood.quantity}
                                        <span className="text-sm font-semibold text-zinc-500">{originalFood.unit}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100/50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">
                                    <Flame className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-sm">{originalFood.kcal.toFixed(0)} kcal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </DrawerHeader>

                <ScrollArea className="flex-1 px-6 -mx-2">
                    <div className="space-y-3 pb-8 px-2 pt-2">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                                <span className="ml-3 text-zinc-500">Carregando substituições...</span>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="text-red-500 mb-2">⚠️</div>
                                <p className="text-zinc-500 mb-4">{error}</p>
                                <Button onClick={fetchSubstitutions} variant="outline" size="sm">
                                    Tentar novamente
                                </Button>
                            </div>
                        ) : substitutions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-zinc-500">Nenhuma substituição disponível para este alimento.</p>
                            </div>
                        ) : (
                            substitutions.map((sub, idx) => {
                                const isSelected = selectedSub?.name === sub.name
                                
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 + 0.1, duration: 0.3 }}
                                        onClick={() => handleSelect(sub)}
                                        className={`
                                            group relative overflow-hidden rounded-2xl p-4 shadow-sm 
                                            transition-all duration-300 cursor-pointer
                                            ${isSelected 
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 dark:border-emerald-400' 
                                                : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-emerald-200/50 dark:hover:border-emerald-800/30'
                                            }
                                        `}
                                    >
                                        {/* Efeito de hover sutil */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-50/30 to-transparent dark:via-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="flex items-start justify-between relative z-10">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                                                        {getGroupIcon(sub.group)}
                                                    </div>
                                                    <h4 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                                                        {sub.name}
                                                    </h4>
                                                    {isSelected && (
                                                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <div className={`flex items-baseline gap-1 px-2 py-1 rounded-md border ${isSelected ? 'bg-emerald-100/50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' : 'bg-zinc-50 dark:bg-zinc-900/80 border-zinc-100 dark:border-zinc-800/50'}`}>
                                                        <Scale className="w-3 h-3 text-zinc-400" />
                                                        <span className={`font-bold text-lg ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                            {sub.quantity}
                                                        </span>
                                                        <span className="text-xs font-semibold text-zinc-500">
                                                            {sub.unit}
                                                        </span>
                                                    </div>

                                                    {sub.group && (
                                                        <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide truncate max-w-[120px]">
                                                            {sub.group.replace("Indicado pelo Nutri", "Sugestão Nutri")}
                                                        </span>
                                                    )}

                                                    {/* Badges de restrição alimentar */}
                                                    <DietaryBadge 
                                                        is_vegan={sub.is_vegan} 
                                                        is_vegetarian={sub.is_vegetarian}
                                                        is_gluten_free={sub.is_gluten_free}
                                                    />

                                                    {/* Badge de similaridade */}
                                                    {sub.similarity_score && sub.similarity_score > 0 && (
                                                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-[9px] px-1.5 h-5">
                                                            {sub.similarity_score}% similar
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Comparativo Visual */}
                                            <div className="flex flex-col items-end justify-center h-full gap-1 pl-4 border-l border-dashed border-zinc-200 dark:border-zinc-800">
                                                {sub.kcal > 0 && (
                                                    <div className={`flex items-center gap-1 transition-colors ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 group-hover:text-emerald-500'}`}>
                                                        <span className="text-sm font-bold tabular-nums">
                                                            {sub.kcal.toFixed(0)}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase">kcal</span>
                                                    </div>
                                                )}

                                                {sub.source === 'manual' && (
                                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[9px] px-1.5 h-5">
                                                        Recomendado
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })
                        )}
                    </div>
                </ScrollArea>

                <DrawerFooter className="px-6 pb-8 pt-4 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 flex-shrink-0 z-20 gap-3">
                    {/* Botão Aplicar Substituição */}
                    {onApplySubstitution && (
                        <Button
                            onClick={handleApply}
                            disabled={!selectedSub || isApplying || isLoading}
                            className={`
                                w-full rounded-2xl h-14 text-base font-semibold shadow-lg transition-all
                                ${selectedSub 
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-none hover:scale-[1.01] active:scale-[0.99]' 
                                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                                }
                            `}
                        >
                            {isApplying ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Aplicando...
                                </>
                            ) : selectedSub ? (
                                <>
                                    <Check className="w-5 h-5 mr-2" />
                                    Aplicar Substituição
                                </>
                            ) : (
                                "Selecione uma opção"
                            )}
                        </Button>
                    )}
                    
                    <DrawerClose asChild>
                        <Button
                            variant="outline"
                            className="w-full rounded-2xl h-12 text-base font-semibold border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                        >
                            Cancelar
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
