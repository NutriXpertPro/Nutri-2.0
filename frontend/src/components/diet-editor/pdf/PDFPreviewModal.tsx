"use client"

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
    X,
    Printer,
    FileText,
    Check,
    Loader2,
    Smartphone,
    Calendar,
    Utensils,
    MapPin,
    Phone,
    Flame,
    Zap,
    Target,
    Activity,
    ShieldCheck
} from 'lucide-react'
import {
    useDietEditorStore,
    useDietEditorMeals,
    useDietEditorPatient,
    DIET_TYPE_MACROS
} from '@/stores/diet-editor-store'
import { Button } from '@/components/ui/button'
import { settingsService } from '@/services/settings-service'
import { Separator } from '@/components/ui/separator'
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import api from '@/services/api'
import dietService from '@/services/diet-service'
import { cn } from '@/lib/utils'

interface PDFPreviewModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PDFPreviewModal({ open, onOpenChange }: PDFPreviewModalProps) {
    const [isSending, setIsSending] = useState(false)
    const [sendSuccess, setSendSuccess] = useState(false)
    const [nutritionist, setNutritionist] = useState<any>(null)
    const [mounted, setMounted] = useState(false)

    const {
        dietId,
        dietName,
        dietType,
        targetCalories,
        targetMacros,
        activeTab,
        workspaceMeals,
        goalAdjustment,
        tmb,
        get,
        setDietId
    } = useDietEditorStore()
    
    const patient = useDietEditorPatient()
    const weekPlanMeals = useDietEditorMeals()
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
        if (open) {
            settingsService.getCombinedSettings().then((settings: any) => {
                if (settings && settings.profile) {
                    setNutritionist({
                        name: settings.profile.name,
                        title: settings.profile.title,
                        crn: settings.profile.crn,
                        address: settings.branding?.address,
                        phone: settings.branding?.phone,
                        logo: settings.branding?.logo
                    })
                }
            }).catch(() => {
                setNutritionist({ name: 'Nutricionista', title: 'Profissional de Saúde' })
            })
        }
    }, [open])

    // LÓGICA DE CÁLCULO IDÊNTICA À TELA DE CRIAÇÃO
    const mealsToDisplay = React.useMemo(() => {
        if (!activeTab || activeTab === 'diet') {
            return workspaceMeals.map(meal => ({
                id: String(meal.id),
                name: meal.type || 'Refeição',
                time: meal.time,
                items: meal.foods.map(food => {
                    const qty = Number(food.qty) || 0;
                    const ratio = qty / 100;
                    const p = Number(food.ptn) || 0;
                    const c = Number(food.cho) || 0;
                    const f = Number(food.fat) || 0;
                    const fb = Number(food.fib) || 0;

                    return {
                        id: String(food.id),
                        name: food.name,
                        quantity: qty,
                        unit: food.unit,
                        calories: (p * 4 + c * 4 + f * 9) * ratio,
                        protein: p * ratio,
                        carbs: c * ratio,
                        fats: f * ratio,
                        fiber: fb * ratio
                    };
                })
            }));
        }
        return weekPlanMeals.map(meal => ({
            id: meal.id,
            name: meal.name,
            time: meal.time,
            items: meal.items.map(item => ({
                id: item.id,
                name: item.food?.nome || item.customName || 'Alimento',
                quantity: item.quantity,
                unit: item.unit,
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fats: item.fats,
                fiber: item.fiber || 0
            }))
        }));
    }, [activeTab, workspaceMeals, weekPlanMeals]);

    const totals = mealsToDisplay.reduce((acc, meal) => {
        meal.items.forEach(item => {
            acc.calories += item.calories
            acc.protein += item.protein
            acc.carbs += item.carbs
            acc.fats += item.fats
            acc.fiber += item.fiber
        })
        return acc
    }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 })

    const handleSendToPatient = async () => {
        setIsSending(true)
        try {
            let activeDietId = dietId;
            if (!activeDietId && patient) {
                const dietData = {
                    patient: patient.id,
                    name: dietName || `Dieta ${new Date().toLocaleDateString()}`,
                    goal: patient.goal,
                    diet_type: dietType,
                    is_active: true,
                    target_calories: 2000, // Valor padrão
                    target_protein: 100, // Valor padrão
                    target_carbs: 250, // Valor padrão
                    target_fats: 80, // Valor padrão
                    meals_rel: [], // Valor padrão
                    meals_data: mealsToDisplay.map(m => ({
                        name: m.name,
                        time: m.time,
                        items: m.items.map(i => ({
                            food_name: i.name,
                            quantity: i.quantity,
                            unit: i.unit,
                            calories: Math.round(i.calories),
                            protein: Number(i.protein.toFixed(1)),
                            carbs: Number(i.carbs.toFixed(1)),
                            fats: Number(i.fats.toFixed(1))
                        }))
                    })),
                    meals: []
                };
                const savedDiet = await dietService.create(dietData);
                activeDietId = savedDiet.id;
                setDietId(savedDiet.id);
            }
            const html2pdf = (await import('html2pdf.js')).default;
            const element = contentRef.current;
            const opt = {
                margin: 0,
                filename: `Plano_Alimentar_${patient?.name}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
            const formData = new FormData();
            formData.append('file', pdfBlob, `diet_${activeDietId}.pdf`);
            await api.post(`/diets/${activeDietId}/upload_pdf/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSendSuccess(true)
            setTimeout(() => setSendSuccess(false), 3000)
        } catch (_err) {

        } finally {
            setIsSending(false)
        }
    }

    const totalTargetKcal = Math.round(targetCalories + (goalAdjustment || 0));

    if (!open || !mounted) return null;

    const dietTypeLabel = DIET_TYPE_MACROS[dietType as keyof typeof DIET_TYPE_MACROS]?.label || 'Personalizada'
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

    const modalContent = (
        <div className="fixed inset-0 w-screen h-screen bg-background z-[999999] flex flex-col overflow-hidden animate-in fade-in duration-300">
            {/* BARRA DE AÇÕES SUPERIOR */}
            <div className="flex items-center justify-between p-4 bg-background border-b border-border/10 shrink-0 px-8 shadow-sm print:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-bold uppercase tracking-widest text-foreground">Relatório Nutricional</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight opacity-60">Visualização de Impressão</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => window.print()} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11 px-6 font-bold uppercase text-[11px] tracking-widest">
                        <Printer className="h-4 w-4 mr-2" /> IMPRIMIR
                    </Button>
                    <Button onClick={handleSendToPatient} disabled={isSending || !patient} variant="outline" className={cn("rounded-xl h-11 px-6 font-bold uppercase text-[11px] tracking-widest", sendSuccess && "bg-emerald-500/10 text-emerald-500")}>
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : sendSuccess ? <Check className="h-4 w-4 mr-2" /> : <Smartphone className="h-4 w-4 mr-2" />}
                        {sendSuccess ? 'ENVIADO' : 'ENVIAR PARA APP'}
                    </Button>
                    <Separator orientation="vertical" className="h-8 mx-2" />
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full hover:bg-red-500/10 hover:text-red-500">
                        <X className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* ÁREA DO DOCUMENTO */}
            <div className="flex-1 overflow-y-auto p-8 bg-zinc-800/50 flex justify-center custom-scrollbar print:p-0 print:bg-white">
                <div ref={contentRef} className="bg-white text-slate-900 shadow-2xl relative w-[210mm] min-h-[297mm] h-fit font-sans my-4 print:my-0 print:shadow-none print:w-full overflow-visible">
                    {/* TOPO DECORATIVO */}
                    <div className="h-3 w-full bg-emerald-500 print:h-2" />

                    {/* CONTEÚDO DO PDF */}
                    <div className="p-12 pb-8 flex justify-between items-start print:p-8">
                        <div className="space-y-6 max-w-[60%]">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl overflow-hidden">
                                    {nutritionist?.logo ? <img src={nutritionist.logo} alt="Logo" className="w-full h-full object-cover" /> : <Utensils className="h-7 w-7" />}
                                </div>
                                <h1 className="text-3xl font-normal text-slate-900 tracking-tighter uppercase leading-none">Plano<br /><span className="text-emerald-500">Alimentar</span></h1>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-normal uppercase tracking-[0.2em] text-emerald-500 opacity-80">Prescrição Nutricional</p>
                                <h2 className="text-2xl font-normal text-slate-800 tracking-tight">{patient?.name}</h2>
                                <div className="flex items-center gap-2 text-xs font-normal text-slate-400">
                                    <Calendar className="h-3.5 w-3.5" /> <span>Emitido em {today}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-3">
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl min-w-[200px]">
                                <p className="text-[9px] font-normal uppercase tracking-widest text-emerald-500 mb-1">Especialista</p>
                                <p className="text-sm font-normal text-slate-800 leading-tight">{nutritionist?.name || 'Seu Nome'}</p>
                                <p className="text-[10px] font-normal text-slate-400 mt-1">{nutritionist?.title || 'Nutricionista'} | CRN {nutritionist?.crn || '---'}</p>
                            </div>
                        </div>
                    </div>

                    {/* METRICAS */}
                    <div className="px-12 grid grid-cols-4 gap-4 print:px-8">
                        <MetricCard icon={Target} label="Meta" value={`${totalTargetKcal} kcal`} color="text-emerald-500" />
                        <MetricCard icon={Flame} label="TMB" value={`${Math.round(tmb)} kcal`} color="text-orange-500" />
                        <MetricCard icon={Activity} label="Gasto" value={`${Math.round(get)} kcal`} color="text-blue-500" />
                        <MetricCard icon={ShieldCheck} label="Objetivo" value={(patient?.goal || 'Bem-estar').replace(/_/g, ' ').toLowerCase()} color="text-violet-500" isText />
                    </div>

                    {/* DISTRIBUIÇÃO */}
                    <div className="px-12 mt-6 print:px-8">
                        <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[9px] uppercase tracking-widest text-slate-400">Estratégia</span>
                                    <span className="text-xs font-normal text-slate-700 capitalize">{dietTypeLabel.toLowerCase()}</span>
                                </div>
                                <Separator orientation="vertical" className="h-8 bg-slate-200" />
                                <div className="flex items-center gap-10">
                                    <MacroItem label="Proteína" value={`${totals.protein.toFixed(1)}g`} target={`${targetMacros.protein}g`} color="bg-emerald-500" />
                                    <MacroItem label="Carbo" value={`${totals.carbs.toFixed(1)}g`} target={`${targetMacros.carbs}g`} color="bg-blue-500" />
                                    <MacroItem label="Gordura" value={`${totals.fats.toFixed(1)}g`} target={`${targetMacros.fats}g`} color="bg-orange-500" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-emerald-500/5 px-6 py-3 rounded-2xl border border-emerald-500/10">
                                <Zap className="h-5 w-5 text-emerald-500" />
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] uppercase text-emerald-500/60 tracking-widest">Total Prescrito</span>
                                    <span className="text-lg font-normal tabular-nums text-emerald-600">{Math.round(totals.calories)} kcal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE REFEIÇÕES */}
                    <div className="px-12 py-12 space-y-12 print:px-8 print:py-8">
                        {mealsToDisplay.map((meal, index) => (
                            <div key={meal.id} className="print:break-inside-avoid relative">
                                <div className="flex items-start gap-6">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-900 font-normal text-lg">{index + 1}</div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-end justify-between border-b border-slate-100 pb-2">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-normal uppercase text-emerald-500 tracking-widest">{meal.time}</span>
                                                <h3 className="text-lg font-normal text-slate-800 tracking-tight uppercase">{meal.name}</h3>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 overflow-hidden">
                                            <Table>
                                                <TableBody>
                                                    {meal.items.map((item) => (
                                                        <TableRow key={item.id} className="border-slate-50">
                                                            <TableCell className="py-4 pl-6"><span className="text-sm text-slate-800">{item.name}</span></TableCell>
                                                            <TableCell className="text-right py-4 pr-6">
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-sm text-slate-800">{item.quantity} <span className="text-[10px] text-slate-400">{item.unit}</span></span>
                                                                    <span className="text-[10px] font-normal text-emerald-500 tabular-nums">{Math.round(item.calories)} kcal</span>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* MEAL FOOTER TOTALS */}
                                        {meal.items.length > 0 && (
                                            <div className="flex justify-end gap-6 pt-2 px-6">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-normal">Proteína</span>
                                                    <span className="text-xs font-normal text-slate-600">{meal.items.reduce((a, b) => a + b.protein, 0).toFixed(1)}g</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-normal">Carbo</span>
                                                    <span className="text-xs font-normal text-slate-600">{meal.items.reduce((a, b) => a + b.carbs, 0).toFixed(1)}g</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-normal">Gordura</span>
                                                    <span className="text-xs font-normal text-slate-600">{meal.items.reduce((a, b) => a + b.fats, 0).toFixed(1)}g</span>
                                                </div>
                                                <Separator orientation="vertical" className="h-8 bg-slate-100" />
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[8px] uppercase tracking-widest text-emerald-500/60 font-normal">Total</span>
                                                    <span className="text-xs font-normal text-emerald-600 uppercase">{Math.round(meal.items.reduce((a, b) => a + b.calories, 0))} kcal</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RODAPÉ PROFISSIONAL */}
                    <div className="px-12 pb-12 print:px-8 print:pb-8 flex flex-col gap-8">
                        <div className="flex justify-between items-end border-t-2 border-slate-50 pt-8 text-[10px] font-normal text-slate-400 uppercase tracking-widest">
                            <div className="text-left"><p className="text-slate-800 text-xs font-normal">{nutritionist?.name}</p><p>Prescrito via NutriXpert Pro</p></div>
                            <div className="text-right"><p>{nutritionist?.address}</p><p>{nutritionist?.phone}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body);
    }
    return null;
}

function MetricCard({ icon: Icon, label, value, color, isText }: any) {
    return (
        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/60 flex flex-col gap-3 group">
            <div className="flex items-center gap-2"><Icon className={cn("h-4 w-4 opacity-70", color)} /><span className="text-[9px] uppercase text-slate-400 tracking-widest">{label}</span></div>
            <span className={cn("font-normal text-slate-700 leading-none", isText ? "text-sm capitalize" : "text-base")}>{value}</span>
        </div>
    )
}

function MacroItem({ label, value, target, color }: any) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2"><div className={cn("w-1.5 h-1.5 rounded-full", color)} /><span className="text-[10px] uppercase text-slate-400 tracking-widest">{label}</span></div>
            <div className="flex items-baseline gap-1.5"><span className="text-sm text-slate-700">{value}</span><span className="text-[9px] text-slate-300">/ {target}</span></div>
        </div>
    )
}
