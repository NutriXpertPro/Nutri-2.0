"use client"

import React, { useEffect } from 'react'
import { useDietEditorStore } from '@/stores/diet-editor-store'
import { Star, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { FoodIcon } from '@/components/ui/FoodIcon'

interface DietFavoritesBarProps {
    mealId: number
}

export function DietFavoritesBar({ mealId }: DietFavoritesBarProps) {
    const {
        favorites,
        addFoodToWorkspaceMeal,
        loadFavorites,
        removeFavorite
    } = useDietEditorStore()

    useEffect(() => {
        loadFavorites()
    }, [loadFavorites])

    if (favorites.length === 0) return null

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            <div className="shrink-0 flex items-center justify-center w-7 h-7">
                <Star className="w-4 h-4 fill-amber-500/20 text-amber-500/60" />
            </div>
            {favorites.map((fav) => {
                const sourceColors = {
                    'TACO': 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40',
                    'TBCA': 'text-orange-500 border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500/40',
                    'USDA': 'text-blue-500 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40',
                    'IBGE': 'text-violet-500 border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/40'
                }
                const colorClass = sourceColors[fav.source as keyof typeof sourceColors] || 'text-primary border-primary/20 bg-primary/5'

                return (
                    <div key={fav.id} className="relative group/fav group shrink-0">
                        <button
                            onClick={() => addFoodToWorkspaceMeal(mealId, fav)}
                            className={cn(
                                "w-7 h-7 flex items-center justify-center rounded-lg border transition-all transform hover:scale-110 active:scale-95 shadow-sm",
                                colorClass
                            )}
                            title={`Adicionar ${fav.nome}`}
                        >
                            <span className="text-base leading-none">
                                <FoodIcon name={fav.nome} group={fav.grupo} size="sm" />
                            </span>
                        </button>

                        {/* Remove Favorite Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Deseja mesmo excluir ${fav.nome} dos favoritos?`)) {
                                    removeFavorite(fav.id, fav.source, fav.nome);
                                }
                            }}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-background border border-border shadow-md rounded-full flex items-center justify-center opacity-0 group-hover/fav:opacity-100 hover:bg-destructive hover:text-white transition-all z-10 scale-0 group-hover/fav:scale-100"
                            title="Remover favorito"
                        >
                            <X className="w-3 h-3" />
                        </button>

                        {/* Name Tooltip on Hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-background border border-border shadow-xl rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 transform translate-y-1 group-hover:translate-y-0">
                            <div className="flex flex-col items-center">
                                <span className={cn("text-[11px] font-black uppercase tracking-tight", colorClass.split(' ')[0])}>
                                    {fav.nome}
                                </span>
                                <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">
                                    {fav.source} • {fav.grupo}
                                </span>
                            </div>
                            {/* Tooltip Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border" />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}