"use client"

import * as React from "react"
import { AnimatePresence } from "framer-motion"
import { PatientHeaderV2 } from "@/components/patient/PatientHeaderV2"
import { PatientBottomNav, TabId } from "@/components/patient/PatientBottomNav"
import {
    HomeTab,
    DietTab,
    AgendaTab,
    EvolutionTab,
    MessagesTab,
    ExamsTab,
    SettingsTab
} from "@/components/patient/tabs"

export default function PatientDashboardV2Page() {
    const [activeTab, setActiveTab] = React.useState<TabId>("home")

    const renderTab = () => {
        switch (activeTab) {
            case "home": return <HomeTab />
            case "diet": return <DietTab />
            case "agenda": return <AgendaTab />
            case "evolution": return <EvolutionTab />
            case "messages": return <MessagesTab />
            case "exams": return <ExamsTab />
            case "menu": return <SettingsTab />
            default: return <HomeTab />
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
            {/* Header Fixo */}
            <PatientHeaderV2 />

            {/* Conteúdo Central (Scrollável) */}
            <main className="relative z-0 pt-16">
                <AnimatePresence mode="wait">
                    {renderTab()}
                </AnimatePresence>
            </main>

            {/* Navegação Inferior Fixa */}
            <PatientBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    )
}
