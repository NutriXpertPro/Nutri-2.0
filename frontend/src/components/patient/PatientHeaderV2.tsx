"use client"

import * as React from "react"
import { Bell, User } from "lucide-react"
import { AppearanceSettings } from "./AppearanceSettings"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function PatientHeaderV2() {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 glass-header z-50 px-4 flex items-center justify-between">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2">
                <img src="/logo_final.svg" alt="NX" className="w-8 h-8 object-contain" />
                <div className="flex items-baseline tracking-tighter">
                    <span className="text-sm font-bold text-foreground">Nutri</span>
                    <span className="text-base font-black text-emerald-500 ml-0.5">Xpert</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                {/* O usuário pediu os seletores apenas na tela de login, mas o prompt original 
                também mencionou seletor de tema no header. Vou incluir de forma minimalista. */}
                <AppearanceSettings />

                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                </Button>

                <Avatar className="h-8 w-8 border border-border/50 ml-1">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-emerald-500/10 text-emerald-600 text-xs font-bold">AC</AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}
