"use client"

import * as React from "react"
import { Bell, User } from "lucide-react"
import { AppearanceSettings } from "./AppearanceSettings"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"

export function PatientHeaderV2() {
    const { user } = useAuth()

    return (
        <header className="fixed top-0 left-0 right-0 h-16 glass-header z-50 px-4 flex items-center justify-between">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-1">
                <img src="/logo_final.svg" alt="NutriXpertPro" className="w-14 h-14 object-contain" />
                <div className="flex items-baseline tracking-tighter">
                    <span className="text-lg font-bold text-foreground">Nutri</span>
                    <span className="text-xl font-black text-emerald-500">Xpert</span>
                    <span className="text-lg font-bold text-foreground">Pro</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                <AppearanceSettings />

                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                </Button>

                <Avatar className="h-8 w-8 border border-border/50 ml-1">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}
