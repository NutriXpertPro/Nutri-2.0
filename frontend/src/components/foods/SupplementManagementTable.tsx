'use client';

import React from 'react'
import { Edit2, Trash2, Info, Lock, Copy } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from '@/lib/utils'
import { Supplement } from '@/services/supplement-service'
import { customSupplementService } from '@/services/custom-supplement-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface SupplementManagementTableProps {
    supplements: Supplement[]
    onEdit: (supplement: Supplement) => void
    onCopy: (supplement: Supplement) => void
    sourceFilter: string
}

export function SupplementManagementTable({ supplements, onEdit, onCopy, sourceFilter }: SupplementManagementTableProps) {
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: (id: number) => customSupplementService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supplements-manage'] })
            toast.success("Suplemento removido", { description: "O item foi excluído da sua tabela." })
        }
    })

    const handleDelete = (id: number) => {
        if (confirm("Tem certeza que deseja excluir este suplemento permanentemente?")) {
            deleteMutation.mutate(id)
        }
    }

    if (supplements.length === 0) {
        return (
            <Card className="p-20 flex flex-col items-center justify-center bg-card/20 border-border/10 rounded-3xl">
                <span className="text-muted-foreground text-sm italic">Nenhum suplemento encontrado para esta fonte ou termo de busca.</span>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden bg-card/30 backdrop-blur-xl border-border/30 shadow-xl rounded-3xl animate-in fade-in duration-700">
            <Table>
                <TableHeader className="bg-muted/10">
                    <TableRow className="hover:bg-transparent border-border/5">
                        <TableHead className="w-[10px]"></TableHead>
                        <TableHead className="text-[11px] uppercase font-medium text-muted-foreground">Marca</TableHead>
                        <TableHead className="text-[11px] uppercase font-medium text-muted-foreground">Nome do Suplemento</TableHead>
                        <TableHead className="text-[11px] uppercase font-medium text-muted-foreground w-[80px]">Porção</TableHead>
                        <TableHead className="text-[11px] uppercase font-medium text-muted-foreground text-center">Proteína (g)</TableHead>
                        <TableHead className="text-[11px] uppercase font-medium text-muted-foreground text-center">Carb (g)</TableHead>
                        <TableHead className="text-[11px] uppercase font-medium text-muted-foreground text-center">Gord (g)</TableHead>
                        <TableHead className="text-[11px] uppercase font-medium text-muted-foreground text-center">Kcal</TableHead>
                        <TableHead className="text-[11px] uppercase font-medium text-muted-foreground">Características</TableHead>
                        <TableHead className="text-[11px] uppercase font-medium text-muted-foreground text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {supplements.map((supplement) => {
                        const isEditable = String(supplement.source) === 'Meus Suplementos'
                        const sourceColor = supplement.source === 'Whey Protein' ? 'text-emerald-500 border-emerald-500/20' :
                            supplement.source === 'Barra de Proteína' ? 'text-blue-500 border-blue-500/20' :
                            'text-primary border-primary/20 bg-primary/5';

                        return (
                            <TableRow key={`${supplement.source}-${supplement.id}`} className="hover:bg-primary/[0.03] transition-colors border-border/5 group">
                                <TableCell className="w-[10px] p-0">
                                    <div className={cn("w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity bg-primary", isEditable && "opacity-50")} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">{supplement.marca}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-normal text-foreground">{supplement.nome}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">
                                            {supplement.porcao ? (
                                                <span>{supplement.porcao}</span>
                                            ) : (
                                                <span className="opacity-20">-</span>
                                            )}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-mono text-xs">{supplement.proteina_g}</TableCell>
                                <TableCell className="text-center font-mono text-xs">{supplement.carboidrato_g}</TableCell>
                                <TableCell className="text-center font-mono text-xs">{supplement.lipidios_g}</TableCell>
                                <TableCell className="text-center font-mono text-xs">{supplement.energia_kcal}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">
                                            {supplement.caracteristicas ? (
                                                <span>{supplement.caracteristicas}</span>
                                            ) : (
                                                <span className="opacity-20">-</span>
                                            )}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {isEditable ? (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-all rounded-xl"
                                                    onClick={() => onCopy(supplement)}
                                                    title="Duplicar"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-xl"
                                                    onClick={() => onEdit(supplement)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl"
                                                    onClick={() => handleDelete(Number(supplement.id))}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-all rounded-xl mr-1"
                                                    onClick={() => onCopy(supplement)}
                                                    title="Copiar para Meus Suplementos"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/10 border border-border/5 rounded-lg opacity-30 grayscale cursor-not-allowed">
                                                    <Lock className="w-2.5 h-2.5" />
                                                    <span className="text-[8px] font-medium uppercase tracking-[0.2em]">Protegido</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </Card >
    )
}