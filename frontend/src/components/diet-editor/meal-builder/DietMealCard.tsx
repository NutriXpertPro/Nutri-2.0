"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Food, foodService } from '@/services/food-service'
import { WorkspaceMeal, useDietEditorStore, MealPreset, WorkspaceMealFood } from '@/stores/diet-editor-store'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { } from "@/components/ui/badge"
import { Trash2, Plus, GripVertical, Check, ChevronsUpDown, Search, Loader2, Utensils, RefreshCw, X, ChevronDown, ChevronUp, Copy, Maximize2, Minimize2, Flame, Folder, ArrowRight, Star, Clock, Coffee, Salad, Apple, Soup, Moon, PieChart, FileText, Eye, Settings, Edit2, Menu } from 'lucide-react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useDebounce } from '@/hooks/use-debounce'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { cn } from "@/lib/utils"
import { getFoodIcon } from './DietTopBar'
import { FoodIcon } from '@/components/ui/FoodIcon'
import { ExpressSelectorModal } from './ExpressSelectorModal'
import { SubstitutionModal } from './SubstitutionModal'
import { SmartQuantitySelector } from './SmartQuantitySelector'
import { SubstitutionDrawer } from '../SubstitutionDrawer'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { IconWrapper } from "@/components/ui/IconWrapper"

// Diet Types Options
const DIET_TYPES = [
    'Normocalórica', 'Low Carb', 'High Carb', 'Cetogênica',
    'Vegetariana', 'Vegana', 'Hiperproteica'
]
import { SupplementsTableModal } from '../SupplementsTableModal'
import { DietFavoritesBar } from './DietFavoritesBar'

interface DietMealCardProps {
    meal: WorkspaceMeal
    index: number
    onUpdate: (updates: Partial<WorkspaceMeal>) => void
    onDelete: () => void
    onCopy: () => void
    onAddFood: (mealId: number, food: Food) => void
    onRemoveFood: (mealId: number, foodId: number) => void
    compact?: boolean
    dietType?: any
}

// Helper Component for Subtotal Metrics
function SubtotalMetric({ label, value, color, bgColor, dotColor }: { label: string, value: number, color: string, bgColor: string, dotColor: string }) {
    return (
        <div className="flex items-center gap-2.5 px-2 py-1 transition-all">
            <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", dotColor)} />
            <div className="flex flex-col">
                <span className={cn("text-[8px] uppercase tracking-[0.15em] leading-none mb-1", color)}>{label}</span>
                <span className="text-xs tabular-nums leading-none text-foreground">{Math.round(value)}<span className="text-[8px] ml-0.5 opacity-40">g</span></span>
            </div>
        </div>
    )
}

export function DietMealCard({
    meal, index, onUpdate, onDelete, onCopy, onAddFood, onRemoveFood, compact = false, dietType
}: DietMealCardProps) {
    const queryClient = useQueryClient()
    const { addFavorite, removeFavorite, favorites } = useDietEditorStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [sourceFilter, setSourceFilter] = useState<string | null>(null)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [expanded, setExpanded] = useState(true)
    const [lastAddedFoodId, setLastAddedFoodId] = useState<number | null>(null)

    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
    const [isSubstitutionDrawerOpen, setIsSubstitutionDrawerOpen] = useState(false)
    const [selectedFoodForSub, setSelectedFoodForSub] = useState<WorkspaceMealFood | null>(null)

    // States for inline editing
    const [editingFoodId, setEditingFoodId] = useState<number | null>(null)
    const [editingName, setEditingName] = useState('')
    const editInputRef = useRef<HTMLInputElement>(null)

    const startEditing = (food: WorkspaceMealFood) => {
        setEditingFoodId(food.id)
        setEditingName(food.name)
        setTimeout(() => editInputRef.current?.focus(), 0)
    }

    const saveEditing = () => {
        if (editingFoodId === null) return
        onUpdate({
            foods: meal.foods.map(f => f.id === editingFoodId ? { ...f, name: editingName } : f)
        })
        setEditingFoodId(null)
    }

    const debouncedEditingName = useDebounce(editingName, 300)
    const { data: inlineSearchResults, isLoading: isInlineSearching } = useQuery({
        queryKey: ['food-search-inline', debouncedEditingName],
        queryFn: () => foodService.search(debouncedEditingName, { limit: 5 }),
        enabled: !!editingFoodId && debouncedEditingName.length >= 2,
    })

    const handleReplaceFood = (oldFoodId: number, newFood: Food) => {
        const updatedFoods: WorkspaceMealFood[] = meal.foods.map(f => {
            if (f.id === oldFoodId) {
                // 🔒 Correção: preservar qty ou calcular com base na unidade caseira
                let newQty: number;
                if (typeof f.qty === 'number') {
                    newQty = f.qty;
                } else if (newFood.peso_unidade_caseira_g) {
                    newQty = (newFood.peso_unidade_caseira_g / 100) * 100; // escala para 100g padrão
                } else {
                    newQty = 1; // fallback seguro: 1 unidade
                }
                return {
                    ...f,
                    id: Date.now(),
                    name: newFood.nome,
                    qty: newQty, // ✅ número garantido
                    ptn: newFood.proteina_g,
                    cho: newFood.carboidrato_g,
                    fat: newFood.lipidios_g,
                    fib: newFood.fibra_g || 0,
                    unidade_caseira: newFood.unidade_caseira ?? undefined,
                    peso_unidade_caseira_g: newFood.peso_unidade_caseira_g ?? undefined,
                    medidas: newFood.medidas,
                    originalId: newFood.id,
                    source: newFood.source,
                    prep: '',
                    measure: newFood.unidade_caseira ?? 'g', // ✅ respeita unidade original
                    unit: newFood.unidade_caseira ?? 'g',   // ✅
                    preferred: false
                }
            }
            return f
        })
        onUpdate({ foods: updatedFoods })
        setEditingFoodId(null)
    }

    const handleSubstituteFood = (food: Food, quantity: number) => {
        if (!selectedFoodForSub) return

        const newFood: WorkspaceMealFood = {
            id: Date.now(),
            name: food.nome,
            qty: quantity,
            unit: 'g',
            measure: 'g',
            prep: '',
            ptn: food.proteina_g,
            cho: food.carboidrato_g,
            fat: food.lipidios_g,
            fib: food.fibra_g || 0,
            preferred: false,
            unidade_caseira: food.unidade_caseira ?? undefined,
            peso_unidade_caseira_g: food.peso_unidade_caseira_g ?? undefined,
            medidas: food.medidas,
            originalId: food.id,
            source: food.source
        }

        // Substituir o alimento selecionado
        const updatedFoods = meal.foods.map(f =>
            f.id === selectedFoodForSub.id ? newFood : f
        )

        onUpdate({ foods: updatedFoods })
        setIsSubstitutionDrawerOpen(false)
        setSelectedFoodForSub(null)
    }

    // Função para o botão "Preview"
    const handlePreview = () => {

        // Disparar evento para o EcoHeader abrir o modal
        window.dispatchEvent(new CustomEvent('open-pdf-preview'));
    }

    // Função para determinar o tipo de refeição com base no título
    const getMealTypeFromTitle = (title: string): string => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('café') || lowerTitle.includes('manhã')) return 'cafe_da_manha';
        if (lowerTitle.includes('almoço') || lowerTitle.includes('almoco')) return 'almoco';
        if (lowerTitle.includes('jantar')) return 'jantar';
        if (lowerTitle.includes('lanche') && lowerTitle.includes('manhã')) return 'lanche_manha';
        if (lowerTitle.includes('lanche') && lowerTitle.includes('tarde')) return 'lanche_tarde';
        if (lowerTitle.includes('lanche')) return 'lanche_tarde'; // padrão para lanche da tarde
        if (lowerTitle.includes('pré') || lowerTitle.includes('pre') || lowerTitle.includes('treino')) return 'pre_treino';
        if (lowerTitle.includes('pós') || lowerTitle.includes('pos')) return 'pos_treino';
        if (lowerTitle.includes('ceia')) return 'ceia';
        if (lowerTitle.includes('suplemento')) return 'suplemento';
        return 'cafe_da_manha'; // padrão
    };

    // Função para obter o tipo de dieta do contexto real
    const getDietTypeFromContext = (): string => {
        return useDietEditorStore.getState().dietType;
    };

    // Função para aplicar um preset de refeição
    const handleApplyPreset = (preset: MealPreset) => {
        // Substitui os alimentos existentes com os do preset
        const updatedFoods: WorkspaceMealFood[] = preset.foods.map((food) => ({
            id: Date.now() + Math.random() + food.id,
            name: food.food_name,
            qty: food.quantity,
            unit: food.unit,
            measure: food.unit,
            ptn: food.protein,
            cho: food.carbs,
            fat: food.fats,
            fib: food.fiber || 0,
            source: 'CUSTOM',
            originalId: undefined,
            unidade_caseira: food.unit,
            peso_unidade_caseira_g: undefined,
            medidas: [],
            prep: '',
            preferred: false
        }));

        // Atualiza a refeição com os alimentos do preset
        onUpdate({
            type: preset.meal_type === 'cafe_da_manha' ? 'Café da Manhã' :
                preset.meal_type === 'almoco' ? 'Almoço' :
                    preset.meal_type === 'jantar' ? 'Jantar' :
                        preset.meal_type === 'lanche_manha' ? 'Lanche da Manhã' :
                            preset.meal_type === 'lanche_tarde' ? 'Lanche da Tarde' :
                                preset.meal_type === 'ceia' ? 'Ceia' : preset.name,
            foods: updatedFoods
        });

        // Fecha o modal
        setIsTemplateModalOpen(false);
    };

    // Função para buscar e aplicar o preset padrão (CONEXÃO SOLICITADA)
    const handleQuickPreset = (mealLabel: string, dietLabel: string) => {
        // Mapeamento de Meal Label -> ID (Sincronizado com DefaultPresetsManager)
        const mealMap: Record<string, string> = {
            'Café da Manhã': 'cafe_da_manha',
            'Almoço': 'almoco',
            'Lanche': 'lanche_tarde',
            'Jantar': 'jantar',
            'Ceia': 'ceia'
        };

        // Mapeamento de Diet Label -> ID (Sincronizado com DefaultPresetsManager)
        const dietMap: Record<string, string> = {
            'Normocalórica': 'normocalorica',
            'Low Carb': 'low_carb',
            'High Carb': 'high_carb',
            'Cetogênica': 'cetogenica',
            'Vegetariana': 'vegetariana',
            'Vegana': 'vegana',
            'Hiperproteica': 'hiperproteica'
        };

        const mealTypeId = mealMap[mealLabel];
        const dietTypeId = dietMap[dietLabel];

        if (mealTypeId && dietTypeId) {
            const defaultPreset = useDietEditorStore.getState().getDefaultPreset(mealTypeId, dietTypeId);
            if (defaultPreset) {
                const preset = useDietEditorStore.getState().mealPresets.find(p => p.id === defaultPreset.preset);
                if (preset) {
                    handleApplyPreset(preset);
                } else {

                }
            } else {
                alert(`Nenhum preset padrão configurado para: ${mealLabel} - ${dietLabel}. Defina um padrão na aba "Presets Padrão" primeiro.`);
            }
        }
    };

    const searchInputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const toggleFavorite = async (food: Food) => {
        try {
            // Atualização Otimista no Cache do React Query de busca
            queryClient.setQueryData(['food-search', debouncedQuery, sourceFilter], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    results: oldData.results.map((f: Food) =>
                        f.id === food.id && f.source === food.source
                            ? { ...f, is_favorite: !f.is_favorite }
                            : f
                    )
                };
            });

            if (food.is_favorite) {
                await removeFavorite(food.id, food.source, food.nome)
            } else {
                await addFavorite(food)
            }

            // Invalidar para garantir sincronia total com o servidor em ambas as partes
            queryClient.invalidateQueries({ queryKey: ['food-search'] })
        } catch (_error) {

            queryClient.invalidateQueries({ queryKey: ['food-search'] })
        }
    }

    // Map para armazenar refs
    const quantityInputRefs = useRef<Map<number, React.RefObject<HTMLInputElement>>>(new Map())

    // Garante que todo alimento tenha seu ref criado
    useEffect(() => {
        const map = quantityInputRefs.current
        meal.foods.forEach(food => {
            if (!map.has(food.id)) {
                // @ts-ignore - React refs are nullable by design but we strictly type them as InputElement for the prop
                map.set(food.id, React.createRef<HTMLInputElement>())
            }
        })
    }, [meal.foods])

    // CORRIGIDO: Função helper para obter ou criar ref
    const getOrCreateRef = (foodId: number) => {
        if (!quantityInputRefs.current.has(foodId)) {
            // eslint-disable-next-line
            // @ts-ignore
            quantityInputRefs.current.set(foodId, React.createRef<HTMLInputElement>())
        }
         
        return quantityInputRefs.current.get(foodId)!
    }

    const debouncedQuery = useDebounce(searchQuery, 150)

    // Cálculo dos totais com precisão decimal
    const totals = meal.foods.reduce((acc, f) => {
        const qty = typeof f.qty === 'number' ? f.qty : 0
        const ratio = qty / 100

        // Calculamos os valores reais de cada item com precisão
        const itemPtn = f.ptn * ratio
        const itemCho = f.cho * ratio
        const itemFat = f.fat * ratio
        const itemFib = (f.fib || 0) * ratio

        // As calorias do item DEVEM ser calculadas a partir dos macros do item para manter a integridade
        const itemKcal = (itemPtn * 4) + (itemCho * 4) + (itemFat * 9)

        return {
            kcal: acc.kcal + itemKcal,
            ptn: acc.ptn + itemPtn,
            cho: acc.cho + itemCho,
            fat: acc.fat + itemFat,
            fib: acc.fib + itemFib,
        }
    }, { kcal: 0, ptn: 0, cho: 0, fat: 0, fib: 0 })

    const { data: searchResults, isLoading: isSearching } = useQuery({
        queryKey: ['food-search', debouncedQuery, sourceFilter],
        queryFn: () => foodService.search(debouncedQuery, {
            source: sourceFilter || undefined,
            limit: 100,
            page_size: 100
        }),
        enabled: debouncedQuery.length >= 2,
    })

    const handleSelectFood = (food: Food) => {
        onAddFood(meal.id, food)
        setSearchQuery('')
        setIsSearchFocused(false)
    }

    // Foco automático no input de quantidade do último alimento adicionado
    useEffect(() => {
        if (lastAddedFoodId !== null) {
            const timer = setTimeout(() => {
                const ref = quantityInputRefs.current.get(lastAddedFoodId)
                ref?.current?.focus()
                ref?.current?.select()
                setLastAddedFoodId(null)
            }, 0)
            return () => clearTimeout(timer)
        }
    }, [lastAddedFoodId])

    useEffect(() => {
        if (meal.foods.length > 0) {
            setLastAddedFoodId(meal.foods[meal.foods.length - 1].id)
        }
    }, [meal.foods.length])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsSearchFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!expanded) {
        return (
            <Card variant="glass" className="p-3 flex flex-col gap-2 hover:border-primary/50 transition-all cursor-pointer group" onClick={() => setExpanded(true)}>
                <div className="flex items-center justify-between">
                    <span className="text-sm truncate text-foreground">{meal.type || `Refeição ${index + 1} `}</span>
                    <div className="flex items-center gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 bg-secondary/20 text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground transition-all shadow-sm border border-border/20" 
                            title="Presets"
                            onClick={(e) => { e.stopPropagation(); setIsTemplateModalOpen(true); }}
                        >
                            <Menu className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm border border-destructive/20" onClick={(e) => { e.stopPropagation(); if (confirm('Excluir esta refeição?')) onDelete(); }}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                    <Clock className="w-3.5 h-3.5 text-primary/60" />
                    <span>{meal.time}</span>
                </div>
                <div className="mt-1 pt-2 border-t border-border/10 flex justify-between items-end">
                    <div className="space-y-0.5">
                        <div className="text-sm text-foreground tabular-nums">{Math.round(totals.kcal)} <span className="text-[10px] text-muted-foreground">kcal</span></div>
                        <div className="text-[9px] text-muted-foreground flex gap-2 uppercase tracking-tight">
                            <span>P:{Math.round(totals.ptn)}g</span>
                            <span>C:{Math.round(totals.cho)}g</span>
                            <span>F:{Math.round(totals.fat)}g</span>
                        </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                </div>
            </Card>
        )
    }

    return (
        <>
            <Card variant="default" className="shadow-xl flex flex-col transition-all min-h-[300px] border-border/40 w-full relative">
                {/* Cabeçalho de Identificação da Refeição - Alinhamento Perfeito */}
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-border/10 bg-background/50 relative z-30">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-muted/20 px-2 py-1 rounded-xl border border-border/10 h-8 min-w-[80px]">
                            <Input
                                type="time"
                                value={meal.time}
                                onChange={(e) => onUpdate({ time: e.target.value })}
                                className="h-6 w-full text-[10px] bg-transparent border-0 p-0 rounded-none text-center text-foreground font-normal focus-visible:ring-0 shadow-none"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-muted/20 px-2 py-1 rounded-xl border border-border/10 h-8 min-w-[80px]">
                                <Input
                                    type="time"
                                    value={meal.time}
                                    onChange={(e) => onUpdate({ time: e.target.value })}
                                    className="h-6 w-full text-[10px] bg-transparent border-0 p-0 rounded-none text-center text-foreground font-normal focus-visible:ring-0 shadow-none"
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="relative group cursor-pointer h-8">
                                        <Input
                                            value={meal.type}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 40) {
                                                    onUpdate({ type: e.target.value });
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="h-8 w-44 bg-background border-border/20 px-3 rounded-xl transition-all focus:border-primary focus:bg-background text-[10px] text-foreground truncate shadow-sm"
                                            placeholder="Nome da Refeição"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none">
                                            <ChevronDown className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56 p-1 rounded-2xl border-border/40 shadow-2xl bg-card/95 backdrop-blur-xl">
                                    <div className="px-3 py-2 text-[8px] uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border/5 mb-1 text-center font-normal">Sugestões</div>
                                    {['Desjejum', 'Café da manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia', 'Pré-Treino', 'Pós-Treino'].map((option) => (
                                        <DropdownMenuItem
                                            key={option}
                                            className="text-[11px] font-medium py-2 px-4 cursor-pointer focus:bg-primary/10 focus:text-primary rounded-xl transition-colors uppercase tracking-tight"
                                            onClick={() => onUpdate({ type: option })}
                                        >
                                            {option}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Placeholder for Meal Icons Column */}
                        <div className="flex-1 flex items-center justify-start px-0 gap-2 overflow-hidden">
                            <DietFavoritesBar mealId={meal.id} />
                        </div>
                    </div>
                </div>

                {/* TABELA DE ALIMENTOS E BUSCA */}
                <div className="flex-1 flex flex-col bg-background">
                    {/* Barra de busca e filtros */}
                    <div className="p-4 border-b border-border/10 bg-background relative z-10" ref={containerRef}>
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSourceFilter(null)}
                                        className={cn("text-[10px] px-3 py-1 rounded-lg border transition-all uppercase tracking-widest",
                                            !sourceFilter ? "bg-yellow-500 text-white border-yellow-600 shadow-sm shadow-yellow-500/20" :
                                                "text-yellow-600/70 border-yellow-500/20 hover:bg-yellow-500/5 hover:text-yellow-600")}
                                    >
                                        Todas
                                    </button>
                                    {['TACO', 'TBCA', 'USDA', 'Sua Tabela'].map(src => {
                                        const isActive = sourceFilter === src
                                        let activeClass = "bg-primary text-primary-foreground border-primary"
                                        let inactiveClass = "text-muted-foreground hover:text-foreground border-border/30 hover:border-primary/40 bg-muted/20"

                                        switch (src) {
                                            case 'TACO': activeClass = "bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/20"; inactiveClass = "text-emerald-600/70 border-emerald-500/20 hover:bg-emerald-500/5 hover:text-emerald-600"; break;
                                            case 'TBCA': activeClass = "bg-orange-500 text-white border-orange-600 shadow-sm shadow-orange-500/20"; inactiveClass = "text-orange-600/70 border-orange-500/20 hover:bg-orange-500/5 hover:text-orange-600"; break;
                                            case 'USDA': activeClass = "bg-blue-500 text-white border-blue-600 shadow-sm shadow-blue-500/20"; inactiveClass = "text-blue-600/70 border-blue-500/20 hover:bg-blue-500/5 hover:text-blue-600"; break;
                                            case 'Sua Tabela': activeClass = "bg-violet-500 text-white border-violet-600 shadow-sm shadow-violet-500/20"; inactiveClass = "text-violet-600/70 border-violet-500/20 hover:bg-violet-500/5 hover:text-violet-600"; break;
                                        }

                                        return (
                                            <button
                                                key={src}
                                                onClick={() => setSourceFilter(isActive ? null : (src === 'Sua Tabela' ? 'Sua Tabela' : src))}
                                                className={cn("text-[10px] px-3 py-1 rounded-lg border transition-all uppercase tracking-widest", isActive ? activeClass : inactiveClass)}
                                            >
                                                {src === 'Sua Tabela' ? 'Suplementos' : src}
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="flex items-center gap-2 flex-wrap pb-1 lg:pb-0">
                                    {['Café da Manhã', 'Almoço', 'Lanche', 'Jantar', 'Ceia'].map(label => {
                                        let Icon = Utensils
                                        let colorClass = "text-muted-foreground"
                                        switch (label) {
                                            case 'Café da Manhã': Icon = Coffee; colorClass = "text-orange-500"; break;
                                            case 'Almoço': Icon = Salad; colorClass = "text-emerald-500"; break;
                                            case 'Lanche': Icon = Apple; colorClass = "text-orange-400"; break;
                                            case 'Jantar': Icon = Soup; colorClass = "text-blue-500"; break;
                                            case 'Ceia': Icon = Moon; colorClass = "text-sky-500"; break;
                                        }

                                        return (
                                            <DropdownMenu key={label}>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/20 hover:border-primary/30 transition-all group whitespace-nowrap min-w-fit shadow-sm">
                                                        <Icon className={cn("h-3.5 w-3.5 transition-transform group-hover:scale-110", colorClass)} />
                                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-tight">{label}</span>
                                                        <ChevronDown className="h-3 w-3 opacity-30" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 p-1">
                                                    <div className="px-3 py-2 text-[10px] text-muted-foreground uppercase tracking-widest bg-muted/30 rounded-t-lg mb-1">Padrão Dietético</div>
                                                    {DIET_TYPES.map(type => (
                                                        <DropdownMenuItem
                                                            key={type}
                                                            className="text-xs py-2 px-3 cursor-pointer focus:bg-primary/10 focus:text-primary rounded-lg"
                                                            onClick={() => handleQuickPreset(label, type)}
                                                        >
                                                            {type}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )
                                    })}

                                    <Button variant="outline" size="sm" className="h-8 rounded-xl px-3 gap-2 text-[10px] uppercase tracking-widest text-muted-foreground border-border/40 hover:border-primary/40 whitespace-nowrap" onClick={onCopy}>
                                        <Copy className="w-3.5 h-3.5 text-primary" />
                                        <span className="hidden sm:inline">Copiar</span>
                                    </Button>

                                    <Button variant="outline" size="sm" className="h-8 rounded-xl px-3 gap-2 text-[10px] uppercase tracking-widest text-muted-foreground border-border/40 hover:border-primary/40 whitespace-nowrap" onClick={handlePreview}>
                                        <Eye className="w-3.5 h-3.5 text-primary" />
                                        <span className="hidden sm:inline">Preview</span>
                                    </Button>
                                    
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="h-8 px-3 bg-secondary/30 hover:bg-secondary/80 text-secondary-foreground transition-all border border-border/10 rounded-xl flex items-center justify-center shadow-sm text-[10px] uppercase tracking-wider"
                                        title="Presets"
                                        onClick={() => setIsTemplateModalOpen(true)}
                                    >
                                        <Menu className="w-3.5 h-3.5 mr-1.5 opacity-50 text-primary" />
                                        Presets
                                    </Button>
                                    
                                    <Button variant="ghost" size="sm" className="h-8 w-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all border border-destructive/30 shadow-lg shadow-destructive/10" onClick={() => { if (confirm('Excluir esta refeição inteira?')) onDelete(); }} title="Excluir Refeição">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground flex items-center justify-center pointer-events-none group-focus-within:text-primary transition-colors">
                                <Search className="w-4 h-4" />
                            </div>
                            <Input
                                ref={searchInputRef}
                                className="pl-10 h-10 text-sm bg-muted/30 border-border/20 focus:bg-background focus:border-primary/40 rounded-xl transition-all shadow-inner"
                                placeholder="Buscar alimento por nome... (ex: frango, arroz, ovo)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                            />
                            {isSearchFocused && searchQuery.length > 1 && (
                                <Card className="absolute top-full left-0 right-0 mt-3 p-2 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.7)] max-h-[450px] overflow-y-auto z-[100] border-primary/20 bg-card/98 backdrop-blur-3xl rounded-[2rem] ring-2 ring-primary/20 animate-in fade-in slide-in-from-top-3 duration-300">
                                    {isSearching ? (
                                        <div className="flex flex-col items-center justify-center p-12 gap-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Buscando no banco de dados...</span>
                                        </div>
                                    ) : searchResults?.results?.length ? (
                                        <div className="space-y-1 max-h-[450px] overflow-y-auto pb-20 custom-scrollbar relative z-10">
                                            <div className="px-4 py-2 text-[9px] text-muted-foreground uppercase tracking-[0.2em] opacity-50 border-b border-border/5 mb-2">Resultados Encontrados</div>
                                            {[...searchResults.results]
                                                .sort((a, b) => (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0))
                                                .map((food: Food) => {
                                                    const isFavorite = food.is_favorite;
                                                    const sourceColor = food.source === 'TACO' ? 'text-emerald-500 border-emerald-500/20' :
                                                        food.source === 'TBCA' ? 'text-orange-500 border-orange-500/20' :
                                                            food.source === 'USDA' ? 'text-blue-500 border-blue-500/20' :
                                                                'text-violet-500 border-violet-500/20';

                                                    return (
                                                        <div
                                                            key={`${food.source}-${food.id}`}
                                                            className="w-full px-4 py-3.5 text-left hover:bg-white/[0.03] flex items-center justify-between text-sm group transition-all rounded-2xl border border-transparent hover:border-white/5 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                                                            onClick={() => handleSelectFood(food)}
                                                        >
                                                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                                                <div className="relative shrink-0">
                                                                    <FoodIcon name={food.nome} group={food.grupo} size="lg" />
                                                                    <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center text-[7px] font-normal border shadow-sm bg-background", sourceColor)}>
                                                                        {food.source}
                                                                    </div>
                                                                </div>
                                                                <div className="min-w-0 pr-4 flex-1">
                                                                    <div className="flex items-center gap-2 relative z-20">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleFavorite(food);
                                                                            }}
                                                                            className="shrink-0 hover:scale-125 transition-all focus:outline-none relative z-30 p-1 -m-1"
                                                                            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                                                        >
                                                                            <Star className={cn("w-3.5 h-3.5 transition-colors", isFavorite ? "fill-amber-400 text-amber-400" : "text-amber-400 hover:text-amber-300")} />
                                                                        </button>
                                                                        <div className="text-foreground transition-colors truncate text-sm tracking-tight">{food.nome}</div>
                                                                    </div>
                                                                    <div className="text-[10px] text-muted-foreground uppercase tracking-tight flex items-center gap-3 mt-1 opacity-70">
                                                                        <div className="flex items-center gap-1">
                                                                            <Folder className="w-3 h-3 text-muted-foreground/60" />
                                                                            <span className="truncate max-w-[120px]">{food.grupo}</span>
                                                                        </div>
                                                                        <span className="w-1 h-1 rounded-full bg-border" />
                                                                        <div className="flex items-center gap-1 text-foreground/80">
                                                                            <Flame className="w-3 h-3 text-orange-500/70" />
                                                                            <span className="tabular-nums">{Math.round(food.energia_kcal)} kcal</span>
                                                                            <span className="text-[8px]">/100g</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    ) : (
                                        <div className="p-16 text-center flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                                                <Search className="w-8 h-8 text-muted-foreground/20" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-foreground uppercase tracking-widest">Nenhum alimento encontrado</p>
                                                <p className="text-[10px] text-muted-foreground max-w-[200px] text-center">Tente buscar por termos mais genéricos ou verifique a ortografia.</p>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* TABELA OTIMIZADA - OPÇÃO 1 */}
                    <div className="flex-1 overflow-auto min-h-[250px] relative">
                        <table className="w-full border-collapse">
                            <thead className="bg-muted/20 sticky top-0 z-20 shadow-sm">
                                <tr className="text-[10px] font-normal text-muted-foreground uppercase tracking-widest border-b border-border/10">
                                    <th className="p-3 w-10 text-center font-normal"><GripVertical className="w-4 h-4 mx-auto opacity-20" /></th>
                                    <th className="p-3 text-left font-normal w-[45%]">Alimento</th>
                                    <th className="p-3 text-center w-[180px] font-normal">Quantidade</th>
                                    <th className="p-3 text-center w-14 text-emerald-600/70 font-normal">PTN</th>
                                    <th className="p-3 text-center w-14 text-blue-600/70 font-normal">CHO</th>
                                    <th className="p-3 text-center w-14 text-amber-600/70 font-normal">FAT</th>
                                    <th className="p-3 text-center w-14 text-purple-600/70 font-normal">FIB</th>
                                    <th className="p-3 text-center w-16 text-foreground font-normal">kcal</th>
                                    <th className="p-3 text-center w-12 text-muted-foreground/30 font-normal">...</th>
                                </tr>
                            </thead>
                            {meal.foods.length > 0 ? (
                                <Reorder.Group
                                    axis="y"
                                    values={meal.foods}
                                    onReorder={(newFoods) => onUpdate({ foods: newFoods })}
                                    as="tbody"
                                    className={cn("divide-y divide-border/5 transition-all duration-500", (isSearchFocused && searchQuery.length > 1) ? "blur-[2px] opacity-30 grayscale pointer-events-none" : "")}
                                >
                                    {meal.foods.map((food) => {
                                        const inputRef = getOrCreateRef(food.id)
                                        const ratio = (typeof food.qty === 'number' ? food.qty : 0) / 100
                                        return (
                                            <Reorder.Item
                                                key={food.id}
                                                value={food}
                                                as="tr"
                                                className="group hover:bg-white/[0.03] transition-colors relative"
                                            >
                                                <td className="p-3 text-center">
                                                    <GripVertical className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-colors cursor-grab mx-auto focus:outline-none touch-none" />
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        {/* Botão de Favorito */}
                                                        <button
                                                            className="p-1.5 rounded-lg hover:bg-amber-100/10 text-muted-foreground hover:text-amber-500 transition-colors shrink-0"
                                                            title={favorites.some(fav => (food.originalId && String(fav.id) === String(food.originalId) && fav.source === food.source) || (fav.nome.trim().toLowerCase() === food.name.trim().toLowerCase())) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                                            onClick={async (e) => {
                                                                e.stopPropagation();

                                                                // Helper to normalize strings
                                                                const normalize = (s: string) => s.trim().toLowerCase();
                                                                const foodName = normalize(food.name);

                                                                // Check if already favorite
                                                                const match = favorites.find(fav =>
                                                                    (food.originalId && String(fav.id) === String(food.originalId) && fav.source === food.source) ||
                                                                    (normalize(fav.nome) === foodName)
                                                                );

                                                                if (match) {
                                                                    await removeFavorite(match.id, match.source, match.nome);
                                                                    return;
                                                                }

                                                                // Attempt to add favorite
                                                                if (food.originalId && food.source && food.source !== 'CUSTOM') {
                                                                    const foodToFav: Food = {
                                                                        id: food.originalId as any,
                                                                        source: food.source as any,
                                                                        nome: food.name,
                                                                        grupo: food.prep || '',
                                                                        proteina_g: food.ptn,
                                                                        carboidrato_g: food.cho,
                                                                        lipidios_g: food.fat,
                                                                        fibra_g: food.fib,
                                                                        energia_kcal: (food.ptn * 4 + food.cho * 4 + food.fat * 9),
                                                                        unidade_caseira: food.unidade_caseira,
                                                                        peso_unidade_caseira_g: food.peso_unidade_caseira_g,
                                                                        medidas: food.medidas || [],
                                                                        is_favorite: false
                                                                    };
                                                                    await addFavorite(foodToFav);
                                                                } else {
                                                                    try {
                                                                        // Fallback: Search by name if no original ID
                                                                        const searchRes = await foodService.search(food.name, { limit: 10 });

                                                                        // Strategy 1: Exact Match
                                                                        let bestMatch = searchRes.results.find((f: any) => normalize(f.nome) === foodName);

                                                                        // Strategy 2: First result
                                                                        if (!bestMatch && searchRes.results.length > 0) {
                                                                            bestMatch = searchRes.results[0];
                                                                        }

                                                                        if (bestMatch) {
                                                                            await addFavorite(bestMatch);
                                                                        } else {
                                                                            // Strategy 3: Retry with simplified name (remove parens)
                                                                            const simpleName = food.name.split('(')[0].trim();
                                                                            if (simpleName !== food.name && simpleName.length > 2) {
                                                                                const retryRes = await foodService.search(simpleName, { limit: 5 });
                                                                                if (retryRes.results.length > 0) {
                                                                                    await addFavorite(retryRes.results[0]);
                                                                                } else {
                                                                                    alert("Não foi possível localizar este alimento no banco de dados para criar o atalho.");
                                                                                }
                                                                            } else {
                                                                                alert("Não foi possível localizar este alimento no banco de dados para criar o atalho.");
                                                                            }
                                                                        }
                                                                    } catch (err) {

                                                                    }
                                                                }

                                                            }}
                                                        >
                                                            <Star className={cn("w-4 h-4 transition-colors", favorites.some(fav => (food.originalId && String(fav.id) === String(food.originalId) && fav.source === food.source) || (fav.nome.trim().toLowerCase() === food.name.trim().toLowerCase())) ? "fill-amber-400 text-amber-400" : "")} />
                                                        </button>

                                                        <FoodIcon name={food.name} group={food.prep || ''} size="md" />

                                                        {/* Editable Food Name */}
                                                        <div className="min-w-0 flex-1 group/name relative">
                                                            {editingFoodId === food.id ? (
                                                                <div className="flex flex-col gap-1 relative">
                                                                    <div className="flex items-center gap-2">
                                                                        <Input
                                                                            ref={editInputRef}
                                                                            value={editingName}
                                                                            onChange={(e) => setEditingName(e.target.value)}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') saveEditing()
                                                                                if (e.key === 'Escape') setEditingFoodId(null)
                                                                            }}
                                                                            className="h-8 text-sm bg-muted/30 border-primary/30 focus:border-primary px-2 rounded-lg w-full"
                                                                            placeholder="Digite para buscar ou renomear..."
                                                                        />
                                                                        <button onClick={saveEditing} className="p-1 hover:bg-primary/10 rounded text-primary shrink-0" title="Salvar nome atual">
                                                                            <Check className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => setEditingFoodId(null)} className="p-1 hover:bg-destructive/10 rounded text-destructive shrink-0" title="Cancelar">
                                                                            <X className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>

                                                                    {/* Inline Search Results Dropdown */}
                                                                    {inlineSearchResults?.results && inlineSearchResults.results.length > 0 && (
                                                                        <div className="absolute top-full left-0 right-0 mt-1 z-[110] bg-card border border-border/40 shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                                                            <div className="px-2 py-1.5 text-[8px] uppercase tracking-widest text-muted-foreground bg-muted/20 border-b border-border/5">Sugestões de Substituição</div>
                                                                            {inlineSearchResults.results.map((res: Food) => (
                                                                                <button
                                                                                    key={`${res.source}-${res.id}`}
                                                                                    className="w-full text-left px-3 py-2 hover:bg-primary/5 flex flex-col gap-0.5 transition-colors border-b border-border/5 last:border-0"
                                                                                    onClick={() => handleReplaceFood(food.id, res)}
                                                                                >
                                                                                    <div className="text-[11px] font-medium text-foreground truncate">{res.nome}</div>
                                                                                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                                                                                        <span className="text-primary/70 font-normal">{res.source}</span>
                                                                                        <span>•</span>
                                                                                        <span>{Math.round(res.energia_kcal)} kcal/100g</span>
                                                                                    </div>
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {isInlineSearching && (
                                                                        <div className="absolute top-full left-0 right-0 mt-1 z-[110] bg-card/80 backdrop-blur-sm border border-border/40 p-2 flex items-center justify-center gap-2 rounded-xl">
                                                                            <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                                                            <span className="text-[10px] text-muted-foreground">Buscando...</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="text-sm text-foreground truncate max-w-[280px] transition-colors cursor-pointer hover:text-primary"
                                                                        onClick={() => startEditing(food)}
                                                                    >
                                                                        {food.name}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => startEditing(food)}
                                                                        className="opacity-0 group-hover/name:opacity-50 hover:opacity-100 transition-opacity p-1"
                                                                    >
                                                                        <Edit2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <div className="text-[10px] text-muted-foreground uppercase tracking-tight flex items-center gap-1.5 mt-0.5">
                                                                <Utensils className="w-3 h-3 opacity-30" />
                                                                {food.prep || 'Natural'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* UNIFIED QUANTITY SELECTOR COLUMN */}
                                                <td className="p-3">
                                                    <div className="w-full max-w-[200px] mx-auto">
                                                        <SmartQuantitySelector
                                                            food={food}
                                                            onChange={(grams, measure) => {
                                                                onUpdate({
                                                                    foods: meal.foods.map(f =>
                                                                        f.id === food.id ? { ...f, qty: grams, measure: measure } : f
                                                                    )
                                                                });
                                                            }}
                                                            inputRef={inputRef}
                                                            onEnter={() => {
                                                                searchInputRef.current?.focus()
                                                            }}
                                                        />
                                                        {/* Optional: Show calculated grams subtly below if using a measure */}
                                                        {food.measure && food.measure !== 'g' && typeof food.qty === 'number' && (
                                                            <div className="text-[9px] text-muted-foreground/40 text-center mt-1 font-mono tracking-tight">
                                                                ≈ {Math.round(food.qty)}g calculados
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="p-3 text-center text-foreground font-normal">{food.qty === '' ? '-' : ((food.ptn || 0) * ratio).toFixed(1)}</td>
                                                <td className="p-3 text-center text-foreground font-normal">{food.qty === '' ? '-' : ((food.cho || 0) * ratio).toFixed(1)}</td>
                                                <td className="p-3 text-center text-foreground font-normal">{food.qty === '' ? '-' : ((food.fat || 0) * ratio).toFixed(1)}</td>
                                                <td className="p-3 text-center text-foreground font-normal">{food.qty === '' ? '-' : ((food.fib || 0) * ratio).toFixed(1)}</td>
                                                <td className="p-3 text-center text-foreground font-normal">
                                                    {food.qty === '' ? '-' : (((food.ptn || 0) * 4 + (food.cho || 0) * 4 + (food.fat || 0) * 9) * ratio).toFixed(0)}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <div className="flex justify-center transition-all gap-1 transform">
                                                        {/* Botão de Substituição */}
                                                        <button
                                                            className="p-1.5 rounded-lg hover:bg-blue-100/10 text-muted-foreground hover:text-blue-500 transition-colors"
                                                            title="Substituir alimento"
                                                            onClick={() => {
                                                                setSelectedFoodForSub(food)
                                                                setIsSubstitutionDrawerOpen(true)
                                                            }}
                                                        >
                                                            <RefreshCw className="w-3.5 h-3.5" />
                                                        </button>

                                                        {/* Botão de Excluir */}
                                                        <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Remover" onClick={() => onRemoveFood(meal.id, food.id)}>
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </Reorder.Item>
                                        )
                                    })}
                                </Reorder.Group>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan={9} className="p-12 text-center text-muted-foreground/30 font-light italic">
                                            <Utensils className="w-10 h-10 mb-2 mx-auto opacity-20" />
                                            <span>Nenhum alimento na lista.</span>
                                        </td>
                                    </tr>
                                </tbody>
                            )}


                            <tfoot className={cn(
                                "bg-muted/20 border-t border-border/10 sticky bottom-0 z-20 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] transition-all duration-300",
                                (isSearchFocused && searchQuery.length > 0) ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible"
                            )}>
                                <tr>
                                    <td className="p-3"></td>
                                    <td className="p-3" colSpan={2}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <PieChart className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-foreground uppercase tracking-[0.2em] leading-none">Subtotal</span>
                                            </div>
                                        </div>
                                    </td>
                                    {/* PTN Column */}
                                    <td className="p-1 align-middle">
                                        <SubtotalMetric label="PTN" value={totals.ptn} color="text-emerald-500" bgColor="bg-emerald-500/10" dotColor="bg-emerald-500" />
                                    </td>
                                    {/* CHO Column */}
                                    <td className="p-1 align-middle">
                                        <SubtotalMetric label="CHO" value={totals.cho} color="text-blue-500" bgColor="bg-blue-500/10" dotColor="bg-blue-500" />
                                    </td>
                                    {/* FAT Column */}
                                    <td className="p-1 align-middle">
                                        <SubtotalMetric label="FAT" value={totals.fat} color="text-orange-500" bgColor="bg-orange-500/10" dotColor="bg-orange-500" />
                                    </td>
                                    {/* FIB Column */}
                                    <td className="p-1 align-middle">
                                        <SubtotalMetric label="FIB" value={totals.fib} color="text-purple-500" bgColor="bg-purple-500/10" dotColor="bg-purple-500" />
                                    </td>
                                    {/* Kcal Column */}
                                    <td className="p-3 text-center align-middle">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xl text-foreground tabular-nums font-normal leading-none">{Math.round(totals.kcal)}</span>
                                            <span className="text-[8px] text-muted-foreground uppercase leading-none mt-0.5">kcal</span>
                                        </div>
                                    </td>
                                    <td className="p-3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Removendo a div fixa duplicada se houver, o tfoot acima substitui ela */}

                    <div className="p-3 border-t border-border/10 flex justify-end items-center bg-muted/10">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors gap-2" onClick={() => setExpanded(false)}>
                            <ChevronUp className="w-3.5 h-3.5" /> Recolher Refeição
                        </Button>
                    </div>
                </div>
            </Card>
            <ExpressSelectorModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                mealTitle={meal.type}
                mealType={getMealTypeFromTitle(meal.type)}
                dietType={getDietTypeFromContext()}
                onApplyTemplate={() => setIsTemplateModalOpen(false)}
                onApplyPreset={handleApplyPreset}
                mealId={meal.id.toString()}
            />

            {/* Drawer de Substituição */}
            {
                selectedFoodForSub && (
                    <SubstitutionDrawer
                        isOpen={isSubstitutionDrawerOpen}
                        onClose={() => {
                            setIsSubstitutionDrawerOpen(false)
                            setSelectedFoodForSub(null)
                        }}
                        originalFood={{
                            id: selectedFoodForSub.originalId as any,
                            source: selectedFoodForSub.source as any,
                            nome: selectedFoodForSub.name,
                            proteina_g: selectedFoodForSub.ptn,
                            carboidrato_g: selectedFoodForSub.cho,
                            lipidios_g: selectedFoodForSub.fat,
                            fibra_g: selectedFoodForSub.fib,
                            energia_kcal: (selectedFoodForSub.ptn * 4 + selectedFoodForSub.cho * 4 + selectedFoodForSub.fat * 9),
                            grupo: selectedFoodForSub.prep || '',
                            unidade_caseira: selectedFoodForSub.unidade_caseira,
                            peso_unidade_caseira_g: selectedFoodForSub.peso_unidade_caseira_g,
                            medidas: selectedFoodForSub.medidas || []
                        }}
                        originalQuantity={typeof selectedFoodForSub.qty === 'number' ? selectedFoodForSub.qty : 100}
                        dietType={dietType || 'normocalorica'}
                        onSubstitute={handleSubstituteFood}
                    />
                )
            }
        </>
    )
}
