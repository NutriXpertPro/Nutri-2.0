"use client"

import { Ruler, Weight, Target, Edit2, ArrowLeft, User, BadgeCheck, Phone, Mail } from "lucide-react"
import { usePatient } from "@/contexts/patient-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function ProfileTab({ onBack }: { onBack?: () => void }) {
    const { patient } = usePatient()

    const hasNutritionist = patient?.nutritionist_name

    return (
        <div className="space-y-6 pb-24">
            {/* Header / Avatar */}
            <div className="flex flex-col items-center justify-center pt-6 mb-6">
                <div className="relative mb-4">
                    <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                        <AvatarImage src={patient?.avatar} />
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                            {patient?.name?.[0] || 'P'}
                        </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
                        <Edit2 className="w-4 h-4" />
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-foreground">{patient?.name || "Paciente"}</h2>
                <p className="text-muted-foreground">{patient?.email || "email@exemplo.com"}</p>
            </div>

            {/* Nutritionist Info - Only show if exists */}
            {hasNutritionist && (
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Seu Nutricionista</h3>
                            <p className="text-xs text-muted-foreground">Profissional responsável</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <Avatar className="w-16 h-16 border-2 border-emerald-500/30">
                                <AvatarImage src={patient?.nutritionist_avatar} />
                                <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                                    {patient?.nutritionist_name?.[0] || 'N'}
                                </AvatarFallback>
                            </Avatar>
                            <BadgeCheck className="absolute -bottom-1 -right-1 w-5 h-5 text-emerald-500 bg-background rounded-full" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-foreground">{patient?.nutritionist_name}</h4>
                            <p className="text-sm text-emerald-400">{patient?.nutritionist_title || 'Nutricionista'}</p>
                        </div>
                    </div>

                    {patient?.nutritionist_gender && (
                        <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-emerald-500/10">
                            Gênero do profissional: <span className="text-foreground capitalize">{patient.nutritionist_gender === 'female' ? 'Feminino' : patient.nutritionist_gender === 'male' ? 'Masculino' : 'Outro'}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 px-1">
                <div className="bg-card border border-border/10 p-4 rounded-2xl flex flex-col items-center text-center shadow-sm">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl mb-2">
                        <Ruler className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold text-foreground">{patient?.height ? patient.height : '--'}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Altura (m)</span>
                </div>
                <div className="bg-card border border-border/10 p-4 rounded-2xl flex flex-col items-center text-center shadow-sm">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl mb-2">
                        <Weight className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold text-foreground">{patient?.weight ? patient.weight : '--'}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Peso (kg)</span>
                </div>
            </div>

            {/* Goal Section */}
            <div className="bg-gradient-to-br from-card to-muted border-primary/50 shadow-lg shadow-primary/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/20 text-primary rounded-2xl">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Objetivo Atual</h3>
                        <p className="text-xs text-muted-foreground">Definido pelo paciente</p>
                    </div>
                </div>
                <p className="text-lg font-medium text-foreground leading-relaxed">
                    "{patient?.goal ? patient.goal.replace(/_/g, ' ') : 'Objetivo não definido'}"
                </p>
            </div>

            {/* General Info */}
            <div className="bg-card border border-border/10 rounded-3xl overflow-hidden divide-y divide-border/5">
                <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gênero</span>
                    <span className="font-medium text-foreground capitalize">
                        {patient?.gender === 'female' ? 'Feminino' : patient?.gender === 'male' ? 'Masculino' : '--'}
                    </span>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Idade</span>
                    <span className="font-medium text-foreground">{patient?.age ? `${patient.age} anos` : '--'}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tipo de Acompanhamento</span>
                    <span className="font-medium text-primary bg-primary/10 px-2 py-1 rounded text-xs">
                        {patient?.service_type || 'ONLINE'}
                    </span>
                </div>
            </div>

            {onBack && (
                <Button variant="ghost" onClick={onBack} className="w-full text-muted-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
            )}
        </div>
    )
}
