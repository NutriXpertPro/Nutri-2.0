"use client"

import * as React from "react"
import { Moon, Sun, Palette, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useColor, ThemeColor } from "@/components/color-provider"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function AppearanceSettings() {
    const { theme, setTheme } = useTheme()
    const { color, setColor } = useColor()

    const colors: { name: ThemeColor; class: string; label: string }[] = [
        { name: "monochrome", class: "bg-slate-500", label: "Monocromático" },
        { name: "blue", class: "bg-blue-500", label: "Azul" },
        { name: "teal", class: "bg-teal-500", label: "Teal" },
        { name: "emerald", class: "bg-emerald-500", label: "Esmeralda" },
        { name: "amber", class: "bg-amber-500", label: "Âmbar" },
        { name: "violet", class: "bg-violet-500", label: "Violeta" },
        { name: "pink", class: "bg-pink-500", label: "Rosa" },
    ]

    return (
        <div className="flex gap-2">
            {/* Mode Toggle */}
            <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 glass-card"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Alternar tema</span>
            </Button>

            {/* Color Selector */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full w-10 h-10 glass-card">
                        <Palette className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Escolher cor</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass-card">
                    <DropdownMenuLabel>Paleta de Cores</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {colors.map((c) => (
                        <DropdownMenuItem
                            key={c.name}
                            onClick={() => setColor(c.name)}
                            className="flex items-center justify-between cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <div className={cn("w-4 h-4 rounded-full", c.class)} />
                                <span>{c.label}</span>
                            </div>
                            {color === c.name && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
