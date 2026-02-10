"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, Plus, Pill } from 'lucide-react'
import { supplementService, Supplement } from '@/services/supplement-service'
import { useDietEditorStore } from '@/stores/diet-editor-store'
import { Food } from '@/services/food-service'
import { toast } from 'sonner'

interface SupplementsTableModalProps {
    trigger?: React.ReactNode;
    mealId?: number;
}

export function SupplementsTableModal({ trigger, mealId }: SupplementsTableModalProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [supplements, setSupplements] = useState<Supplement[]>([])
    const [loading, setLoading] = useState(false)
    const { workspaceMeals, addFoodToWorkspaceMeal } = useDietEditorStore()

    // Use the provided mealId, or fallback to the first meal
    const targetMealId = mealId ?? (workspaceMeals.length > 0 ? workspaceMeals[0].id : null)

    useEffect(() => {
        if (open) {
            loadSupplements()
        }
    }, [open, search])

    const loadSupplements = async () => {
        setLoading(true)
        try {
            const data = await supplementService.search(search)
            setSupplements(data.results)
        } catch (_error) {

        } finally {
            setLoading(false)
        }
    }

    const handleAdd = (supplement: Supplement) => {
        if (!targetMealId) {
            toast.error("Nenhuma refeição disponível para adicionar.")
            return
        }

        // Parse numeric values from strings like "24g" or "126"
        const parseValue = (val: string) => {
            if (!val) return 0
            return Number(val.replace(/[^\d.]/g, ''))
        }

        const food: Food = {
            id: supplement.id,
            nome: `${supplement.marca} - ${supplement.nome}`,
            grupo: 'Suplementos',
            source: 'CUSTOM', // Treated as custom food
            energia_kcal: parseValue(supplement.energia_kcal),
            proteina_g: parseValue(supplement.proteina_g),
            lipidios_g: parseValue(supplement.lipidios_g),
            carboidrato_g: parseValue(supplement.carboidrato_g),
            fibra_g: 0,
            unidade_caseira: 'Porção',
            peso_unidade_caseira_g: parseValue(supplement.porcao),
            // Mock empty measures if needed
            medidas: []
        }

        addFoodToWorkspaceMeal(targetMealId, food)
        toast.success(`${supplement.nome} adicionado!`)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="text-[10px] px-3 py-1 h-auto rounded-lg border transition-all uppercase tracking-widest text-violet-600/70 border-violet-500/20 hover:bg-violet-500/5 hover:text-violet-600">
                        Suplementos
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pill className="w-5 h-5 text-violet-500" />
                        Tabela de Suplementos
                    </DialogTitle>
                </DialogHeader>
                
                <div className="flex items-center space-x-2 py-4">
                    <Search className="w-4 h-4 opacity-50" />
                    <Input 
                        placeholder="Buscar por marca, nome ou característica..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1"
                    />
                </div>

                <div className="flex-1 overflow-auto border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Marca</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Porção</TableHead>
                                <TableHead>Kcal</TableHead>
                                <TableHead>Prot</TableHead>
                                <TableHead>Carb</TableHead>
                                <TableHead>Gord</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24">Carregando...</TableCell>
                                </TableRow>
                            ) : supplements.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24">Nenhum suplemento encontrado.</TableCell>
                                </TableRow>
                            ) : (
                                supplements.map((sup) => (
                                    <TableRow key={sup.id}>
                                        <TableCell className="font-medium">{sup.marca}</TableCell>
                                        <TableCell>{sup.nome}</TableCell>
                                        <TableCell>{sup.porcao}</TableCell>
                                        <TableCell>{sup.energia_kcal}</TableCell>
                                        <TableCell>{sup.proteina_g}</TableCell>
                                        <TableCell>{sup.carboidrato_g}</TableCell>
                                        <TableCell>{sup.lipidios_g}</TableCell>
                                        <TableCell>
                                            {targetMealId && (
                                                <Button size="sm" variant="ghost" onClick={() => handleAdd(sup)} title="Adicionar à refeição">
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}
