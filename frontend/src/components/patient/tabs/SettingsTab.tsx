"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    User,
    Bell,
    Shield,
    Palette,
    Smartphone,
    HelpCircle,
    LogOut,
    ChevronRight,
    Edit3,
    Camera,
    CreditCard,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { AppearanceSettings } from "../AppearanceSettings"
import { cn } from "@/lib/utils"
import { usePatient } from "@/contexts/patient-context"

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
}

export function SettingsTab() {
    const { patient } = usePatient()

    const name = patient?.name || "Paciente"
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col min-h-screen pt-4 pb-28 relative"
        >
            {/* Profile Header */}
            <div className="pt-4 pb-8 px-6 flex flex-col items-center text-center space-y-4 relative">
                <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative h-28 w-28 rounded-full border-2 border-primary/20 p-1">
                        {patient?.avatar ? (
                            <img src={patient.avatar} alt={name} className="h-full w-full rounded-full object-cover shadow-xl" />
                        ) : (
                            <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-3xl font-black text-muted-foreground shadow-xl">
                                {initials}
                            </div>
                        )}
                        <button className="absolute bottom-0 right-0 h-9 w-9 bg-background border border-border rounded-full flex items-center justify-center text-primary shadow-lg hover:scale-110 active:scale-95 transition-all">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
                        {patient?.service_type === 'ONLINE' ? 'Plano Online' : patient?.service_type === 'PRESENCIAL' ? 'Plano Presencial' : 'Membro'} • {patient?.nutritionist_name ? `${patient.nutritionist_name.split(' ').slice(0, 2).join(' ')}` : 'NutriXpertPro'}
                    </div>
                </div>

                <Button variant="outline" className="rounded-full px-6 h-10 border-border/40 font-bold uppercase text-[10px] tracking-widest bg-muted/20 hover:bg-muted/40">
                    <Edit3 className="h-3.5 w-3.5 mr-2" /> Editar Perfil
                </Button>
            </div>

            {/* Menu Sections */}
            <div className="px-5 space-y-8">
                {/* Conta */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-4">Conta</h3>
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-sm divide-y divide-white/[0.03]">
                        <MenuItem icon={<User className="text-blue-500" />} label="Dados Pessoais" />
                        <MenuItem icon={<CreditCard className="text-purple-500" />} label="Plano & Assinatura" />
                        <MenuItem icon={<Shield className="text-orange-500" />} label="Privacidade & Segurança" />
                    </div>
                </div>

                {/* Preferências */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-4">Personalização</h3>
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-sm divide-y divide-white/[0.03]">
                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-muted/40 flex items-center justify-center text-primary">
                                    <Bell className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold">Notificações Push</span>
                            </div>
                            <Switch checked className="data-[state=checked]:bg-primary" />
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="h-10 w-10 rounded-2xl bg-muted/40 flex items-center justify-center text-pink-500">
                                    <Palette className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold">Aparência do App</span>
                            </div>
                            <AppearanceSettings />
                        </div>

                        <MenuItem
                            icon={<Smartphone className="text-blue-400" />}
                            label="Apps Conectados"
                            badge="Apple Health"
                        />
                    </div>
                </div>

                {/* Suporte */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-4">Suporte</h3>
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border-none shadow-sm divide-y divide-white/[0.03]">
                        <MenuItem icon={<HelpCircle className="text-muted-foreground" />} label="Central de Ajuda" />
                        <MenuItem icon={<Zap className="text-amber-500" />} label="Explorar NutriXpertPro" />
                    </div>
                </div>

                {/* Logout */}
                <Button variant="ghost" className="w-full h-16 rounded-3xl text-orange-500 font-bold uppercase tracking-[0.3em] text-xs hover:bg-orange-500/5 hover:text-orange-600 transition-all border border-transparent hover:border-orange-500/10">
                    <LogOut className="h-5 w-5 mr-3" /> Sair do Aplicativo
                </Button>

                <div className="text-center pt-4 pb-12 opacity-20">
                    <p className="text-[9px] font-black tracking-[0.3em] uppercase">NutriXpertPro v1.0.0 (Beta)</p>
                </div>
            </div>
        </motion.div>
    )
}

function MenuItem({ icon, label, badge }: { icon: React.ReactNode, label: string, badge?: string }) {
    return (
        <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all group active:scale-[0.98]">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-muted/40 flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-sm font-bold">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {badge && <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-full">{badge}</span>}
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
        </button>
    )
}
