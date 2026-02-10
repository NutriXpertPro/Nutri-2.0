"use client"

import { Check, Clock, Camera, X, Flame, Trophy, Loader2, AlertCircle, ArrowRightLeft, ChefHat, Milk, Wheat, Leaf, Zap } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTimeline } from "@/hooks/useTimeline"
import { SubstitutionDrawer } from "@/components/patient-v2/substitution-drawer"

export function TimelineWidget() {
    const [currentTime, setCurrentTime] = useState("")
    const [selectedMeal, setSelectedMeal] = useState<any>(null)
    const { events, loading, error, checkIn, uploadMealPhoto } = useTimeline()
    const [completedMeals, setCompletedMeals] = useState<number[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
            setCurrentTime(timeString)
        }
        updateTime()
        const interval = setInterval(updateTime, 60000)
        return () => clearInterval(interval)
    }, [])

    const getStatus = (event: any, index: number) => {
        if (!currentTime) return 'upcoming'
        const nextEvent = events[index + 1]
        // Manual override check
        if (completedMeals.includes(event.id) || event.status === 'completed') return 'completed'
        if (currentTime >= event.time) {
            if (nextEvent && currentTime >= nextEvent.time) {
                return 'completed'
            }
            return 'current'
        }
        return 'upcoming'
    }

    const handleCheckIn = async (id: number) => {
        if (!completedMeals.includes(id)) {
            try {
                await checkIn(id)
                setCompletedMeals([...completedMeals, id])
            } catch (_err) {
            }
        }
        setSelectedMeal(null)
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !selectedMeal) return
        try {
            setUploadingPhoto(true)
            await uploadMealPhoto(selectedMeal.id, file)
            alert("Foto enviada com sucesso!")
        } catch (err) {
            alert("Erro ao enviar foto.")
        } finally {
            setUploadingPhoto(false)
        }
    }

    // Helper to determine group icon (for visual flare in timeline)
    const getFoodIcon = (name: string = "") => {
        const n = name.toLowerCase()
        if (n.includes('café') || n.includes('leite')) return Milk
        if (n.includes('pão') || n.includes('aveia')) return Wheat
        if (n.includes('salada') || n.includes('fruta')) return Leaf
        if (n.includes('carne') || n.includes('ovo')) return ChefHat
        return Zap
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-2" />
                <p className="text-xs text-red-500">{error}</p>
            </div>
        )
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <Clock className="w-6 h-6 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Hoje está livre.</p>
            </div>
        )
    }

    return (
        <>
            {/* Timeline Main View */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-200 dark:before:bg-zinc-800">
                {events.map((event, index) => {
                    const status = getStatus(event, index)
                    const isManualCompleted = completedMeals.includes(event.id)
                    const isCurrent = status === "current" && !isManualCompleted
                    const isCompleted = status === "completed" || isManualCompleted
                    const isUpcoming = getStatus(event, index) === 'upcoming'
                    const MainIcon = getFoodIcon(event.title)

                    return (
                        <div key={event.id} className={`group relative transition-all duration-300 ${isUpcoming ? 'opacity-50 grayscale' : 'opacity-100'}`}>

                            {/* Dot */}
                            <div className={`absolute -left-[27px] top-3.5 w-4 h-4 rounded-full border-2 
                                flex items-center justify-center z-10 bg-background transition-colors duration-300
                                ${isCompleted
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : isCurrent
                                        ? "border-emerald-500 bg-background"
                                        : "border-zinc-300 dark:border-zinc-700 bg-background"}
                            `}>
                                {isCompleted && <Check className="w-2.5 h-2.5" />}
                                {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            </div>

                            {/* Card */}
                            <div
                                onClick={() => setSelectedMeal(event)}
                                className={`
                                    relative p-4 rounded-xl border cursor-pointer transition-all duration-300
                                    flex items-center gap-4
                                    ${isCurrent
                                        ? "bg-white dark:bg-zinc-900 border-emerald-500/30 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/10"
                                        : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"}
                                `}
                            >
                                <div className={`p-2.5 rounded-full ${isCurrent ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-400'}`}>
                                    <MainIcon className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h3 className={`font-serif text-base font-normal ${isCurrent ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-600 dark:text-zinc-400"}`}>
                                            {event.title}
                                        </h3>
                                        <span className={`text-[10px] uppercase tracking-wider ${isCurrent ? "text-emerald-600" : "text-zinc-400"}`}>
                                            {event.time}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1 font-light opacity-90">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Meal Details Drawer - Unified & Light Design */}
            <AnimatePresence>
                {selectedMeal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMeal(null)}
                            className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                        >
                            <motion.div
                                initial={{ y: "100%", scale: 1 }}
                                animate={{ y: 0, scale: 1 }}
                                exit={{ y: "100%", scale: 1 }}
                                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative"
                            >
                                {/* Unified Content Flow (No separate header block) */}
                                <div className="flex-1 overflow-y-auto scrollbar-hide">

                                    {/* Top Controls */}
                                    <div className="absolute top-0 right-0 p-6 z-20">
                                        <button
                                            onClick={() => setSelectedMeal(null)}
                                            className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="p-8 pb-4">
                                        <div className="flex flex-col items-center text-center mb-8">
                                            <span className="text-xs font-medium text-emerald-600 uppercase tracking-widest mb-2">
                                                {selectedMeal.time}
                                            </span>
                                            <h2 className="text-3xl font-serif text-zinc-900 dark:text-zinc-50 font-normal leading-tight">
                                                {selectedMeal.title}
                                            </h2>

                                            {/* Minimal Macros - Light */}
                                            {(selectedMeal.kcal > 0) && (
                                                <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400 font-light">
                                                    <span className="flex items-center gap-1 text-emerald-600 font-medium"><Flame className="w-3 h-3" /> {selectedMeal.kcal} kcal</span>
                                                    <span>|</span>
                                                    <span>P: {selectedMeal.protein}</span>
                                                    <span>C: {selectedMeal.carbs}</span>
                                                    <span>G: {selectedMeal.fat}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-8">
                                            {selectedMeal.items?.map((item: any, idx: number) => {
                                                const hasSubstitutions = item.substitutions && item.substitutions.length > 0

                                                return (
                                                    <div key={idx} className="relative">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="text-xl font-light text-zinc-900 dark:text-zinc-100 leading-snug">
                                                                    {item.name}
                                                                </h3>
                                                                <p className="text-sm text-zinc-500 font-serif italic mt-1">
                                                                    {item.quantity}{item.unit}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Integrated Substitutions - Explicitly Listed */}
                                                        {hasSubstitutions && (
                                                            <div className="mt-3">
                                                                <SubstitutionDrawer
                                                                    originalFood={{
                                                                        name: item.name,
                                                                        quantity: parseFloat(item.quantity) || 0,
                                                                        unit: item.unit,
                                                                        kcal: item.kcal || 0
                                                                    }}
                                                                    substitutions={item.substitutions}
                                                                    trigger={
                                                                        <button className="w-full text-left bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800 hover:border-emerald-200 transition-colors group">
                                                                            <div className="flex items-center justify-between mb-1">
                                                                                <span className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                                                                                    Opções de Substituição
                                                                                </span>
                                                                                <ArrowRightLeft className="w-3 h-3 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                                            </div>
                                                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light truncate">
                                                                                {item.substitutions.map((s: any) => s.name).slice(0, 3).join(", ")}
                                                                                {item.substitutions.length > 3 && ", ..."}
                                                                            </p>
                                                                            <div className="mt-2 text-xs text-emerald-600 font-medium underline decoration-emerald-200 underline-offset-2">
                                                                                Ver todas as {item.substitutions.length} opções
                                                                            </div>
                                                                        </button>
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}

                                            {(!selectedMeal.items || selectedMeal.items.length === 0) && (
                                                <div className="text-center py-8">
                                                    <p className="text-sm text-zinc-400 font-light italic">
                                                        {selectedMeal.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Clean Footer */}
                                <div className="p-6 pt-2 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 z-20">
                                    <div className="grid grid-cols-[auto_1fr] gap-3">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingPhoto}
                                            className="h-14 w-14 p-0 rounded-2xl border-zinc-100 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-900"
                                        >
                                            {uploadingPhoto ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-6 h-6 stroke-1" />}
                                        </Button>

                                        <Button
                                            onClick={() => handleCheckIn(selectedMeal.id)}
                                            className={`
                                                h-14 rounded-2xl text-sm font-medium uppercase tracking-widest transition-all
                                                ${completedMeals.includes(selectedMeal.id)
                                                    ? 'bg-zinc-100 text-zinc-400 hover:bg-zinc-100 border border-zinc-100 cursor-default'
                                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200 dark:shadow-none'}
                                            `}
                                            disabled={completedMeals.includes(selectedMeal.id)}
                                        >
                                            {completedMeals.includes(selectedMeal.id) ? "Registrado" : "Check-in Refeição"}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
