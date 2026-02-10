'use client';

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Plus, X } from 'lucide-react'
import { customSupplementService, CustomSupplement } from '@/services/custom-supplement-service'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface SupplementFormModalProps {
    isOpen: boolean
    onClose: () => void
    supplement?: CustomSupplement | null
}

export function SupplementFormModal({ isOpen, onClose, supplement }: SupplementFormModalProps) {
    const [formData, setFormData] = useState<Partial<CustomSupplement>>({
        marca: '',
        nome: '',
        porcao: '',
        proteina_g: '',
        carboidrato_g: '',
        lipidios_g: '',
        energia_kcal: '',
        caracteristicas: '',
        source: 'Meus Suplementos'
    });
    
    const queryClient = useQueryClient();

    React.useEffect(() => {
        if (supplement) {
            setFormData({
                marca: supplement.marca || '',
                nome: supplement.nome || '',
                porcao: supplement.porcao || '',
                proteina_g: supplement.proteina_g || '',
                carboidrato_g: supplement.carboidrato_g || '',
                lipidios_g: supplement.lipidios_g || '',
                energia_kcal: supplement.energia_kcal || '',
                caracteristicas: supplement.caracteristicas || '',
                source: supplement.source || 'Meus Suplementos'
            });
        } else {
            setFormData({
                marca: '',
                nome: '',
                porcao: '',
                proteina_g: '',
                carboidrato_g: '',
                lipidios_g: '',
                energia_kcal: '',
                caracteristicas: '',
                source: 'Meus Suplementos'
            });
        }
    }, [supplement]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (supplement?.id) {
                // Atualizar suplemento existente
                await customSupplementService.update(supplement.id, formData);
                toast.success("Suplemento atualizado", { description: "As alterações foram salvas com sucesso." });
            } else {
                // Criar novo suplemento
                await customSupplementService.create(formData as Omit<CustomSupplement, 'id'>);
                toast.success("Suplemento adicionado", { description: "O novo suplemento foi adicionado à sua tabela." });
            }
            
            queryClient.invalidateQueries({ queryKey: ['supplements-manage'] });
            onClose();
        } catch (_error) {
            toast.error("Erro", { description: "Ocorreu um erro ao salvar o suplemento." });
        }
    };

    const handleChange = (field: keyof CustomSupplement, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-2xl">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-2xl">
                        {supplement?.id ? 'Editar Suplemento' : 'Novo Suplemento'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="marca">Marca *</Label>
                            <Input
                                id="marca"
                                value={formData.marca || ''}
                                onChange={(e) => handleChange('marca', e.target.value)}
                                placeholder="Ex: Optimum Nutrition"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome do Suplemento *</Label>
                            <Input
                                id="nome"
                                value={formData.nome || ''}
                                onChange={(e) => handleChange('nome', e.target.value)}
                                placeholder="Ex: Gold Standard 100% Whey"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="porcao">Porção</Label>
                            <Input
                                id="porcao"
                                value={formData.porcao || ''}
                                onChange={(e) => handleChange('porcao', e.target.value)}
                                placeholder="Ex: 30g"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="proteina_g">Proteína (g)</Label>
                            <Input
                                id="proteina_g"
                                value={formData.proteina_g || ''}
                                onChange={(e) => handleChange('proteina_g', e.target.value)}
                                placeholder="Ex: 24g"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="carboidrato_g">Carboidrato (g)</Label>
                            <Input
                                id="carboidrato_g"
                                value={formData.carboidrato_g || ''}
                                onChange={(e) => handleChange('carboidrato_g', e.target.value)}
                                placeholder="Ex: 3g"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="lipidios_g">Gorduras (g)</Label>
                            <Input
                                id="lipidios_g"
                                value={formData.lipidios_g || ''}
                                onChange={(e) => handleChange('lipidios_g', e.target.value)}
                                placeholder="Ex: 1.5g"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="energia_kcal">Calorias (kcal)</Label>
                            <Input
                                id="energia_kcal"
                                value={formData.energia_kcal || ''}
                                onChange={(e) => handleChange('energia_kcal', e.target.value)}
                                placeholder="Ex: 120"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="caracteristicas">Características</Label>
                            <Input
                                id="caracteristicas"
                                value={formData.caracteristicas || ''}
                                onChange={(e) => handleChange('caracteristicas', e.target.value)}
                                placeholder="Ex: Importado, BCAA, etc"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="h-9 px-4 rounded-xl font-medium border-border/50"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="h-9 px-6 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {supplement?.id ? 'Atualizar' : 'Adicionar'} Suplemento
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}