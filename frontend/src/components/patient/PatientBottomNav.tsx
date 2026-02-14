"use client"

import * as React from "react"
import { Home, UtensilsCrossed, Calendar, LineChart, MessageSquare, FileText, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export type TabId = "home" | "diet" | "agenda" | "evolution" | "messages" | "exams" | "menu"

interface PatientBottomNavProps {
    activeTab: TabId
    onTabChange: (tab: TabId) => void
}

export function PatientBottomNav({ activeTab, onTabChange }: PatientBottomNavProps) {
    const navItems: { id: TabId; icon: React.ElementType; label: string }[] = [
        { id: "home", icon: Home, label: "Início" },
        { id: "diet", icon: UtensilsCrossed, label: "Dieta" },
        { id: "agenda", icon: Calendar, label: "Agenda" },
        { id: "evolution", icon: LineChart, label: "Evolução" },
        { id: "messages", icon: MessageSquare, label: "Chat" },
        { id: "exams", icon: FileText, label: "Exames" },
        { id: "menu", icon: Menu, label: "Menu" },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-t border-border/10 z-50 px-2 pb-safe">
            <div className="flex items-center justify-between h-full max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id
                    const Icon = item.icon

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="relative">
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute -inset-2 bg-primary/10 blur-md rounded-full"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon className={cn("h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
                            </div>
                            <span className="text-[10px] font-medium leading-none tracking-tight">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute top-0 w-8 h-0.5 bg-primary rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
