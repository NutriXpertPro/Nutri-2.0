"use client"

import React, { useEffect } from 'react'
import { useDietEditorStore } from '@/stores/diet-editor-store'
import { Button } from "@/components/ui/button"
import { Settings, Star, X } from 'lucide-react'
import { cn } from "@/lib/utils"

const DAYS = [
    { id: 'Seg', label: 'Seg' },
    { id: 'Ter', label: 'Ter' },
    { id: 'Qua', label: 'Qua' },
    { id: 'Qui', label: 'Qui' },
    { id: 'Sex', label: 'Sex' },
    { id: 'Sab', label: 'Sáb' },
    { id: 'Dom', label: 'Dom' },
]

export function DietTopBar() {
    const {
        activeWorkspaceDay,
        setActiveWorkspaceDay,
        favorites,
        workspaceMeals,
        addFoodToWorkspaceMeal,
        loadFavorites,
        removeFavorite
    } = useDietEditorStore()

    useEffect(() => {
        loadFavorites()
    }, [loadFavorites])

    // Find the currently active meal in the workspace (first one not collapsed or just use a default)
    // For simplicity, we'll try to find an active one or use the first one if only one exists
    const activeMealId = workspaceMeals.length > 0 ? workspaceMeals[0].id : null

    return (
        <div className="sticky top-0 z-30 bg-transparent">
            <div className="px-6 py-2 flex flex-col gap-3">

                {/* Unified Toolbar */}
                <div className="flex items-center justify-between gap-4">
                    {/* Placeholder for future day selectors or other tools */}
                </div>

            </div>
        </div>
    )
}


import { FoodIcon } from '@/components/ui/FoodIcon'

export function getFoodIcon(name: string, group: string): React.ReactNode {
    return <FoodIcon name={name} group={group} size="md" />
}