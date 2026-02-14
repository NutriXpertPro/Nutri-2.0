"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    MoreVertical,
    Video,
    Paperclip,
    Send,
    Smile,
    Image as ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
}

export function MessagesTab() {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col h-screen pt-16"
        >
            {/* Chat Header */}
            <div className="fixed top-16 left-0 right-0 z-40 glass-header px-4 py-3 flex items-center justify-between border-b border-border/10">
                <div className="flex items-center gap-3">
                    <button className="text-muted-foreground hover:text-foreground transition-colors md:hidden">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-emerald-500/20 shadow-sm bg-muted animate-pulse">
                            {/* Nutri Avatar Placeholder */}
                        </div>
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-background shadow-sm" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold leading-none">Dra. Sarah Fit</h2>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1 block">Online</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-muted/30">
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-muted/30">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40 no-scrollbar">
                <div className="flex justify-center py-2">
                    <span className="bg-muted px-4 py-1 rounded-full text-[9px] font-black text-muted-foreground uppercase tracking-widest">Ontem</span>
                </div>

                {/* Received Bubble */}
                <div className="flex gap-3 max-w-[85%]">
                    <div className="h-8 w-8 rounded-full bg-muted shrink-0 mt-auto shadow-sm" />
                    <div className="space-y-1">
                        <div className="glass-card p-3.5 rounded-2xl rounded-bl-none border-none shadow-sm">
                            <p className="text-sm leading-relaxed">Olá! Vi que você conseguiu bater sua meta de água hoje. Parabéns pelo foco! 💧</p>
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground ml-1">09:41 AM</span>
                    </div>
                </div>

                {/* Sent Bubble */}
                <div className="flex flex-col gap-1 max-w-[85%] self-end items-end">
                    <div className="bg-emerald-500 text-white p-3.5 rounded-2xl rounded-br-none shadow-md">
                        <p className="text-sm leading-relaxed font-medium">Obrigado, Dra! Estou me sentindo bem mais disposto.</p>
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground mr-1">10:15 AM</span>
                </div>

                <div className="flex justify-center py-4">
                    <span className="bg-muted px-4 py-1 rounded-full text-[9px] font-black text-muted-foreground uppercase tracking-widest">Hoje</span>
                </div>

                {/* Sent with Image */}
                <div className="flex flex-col gap-1 max-w-[85%] self-end items-end">
                    <div className="bg-emerald-500/10 p-1.5 rounded-3xl rounded-br-none border border-emerald-500/20 shadow-sm relative group overflow-hidden">
                        <div className="aspect-square w-48 bg-muted rounded-2xl overflow-hidden mb-1">
                            {/* Image Placeholder */}
                            <div className="w-full h-full flex items-center justify-center text-emerald-600/30">
                                <ImageIcon className="h-12 w-12" />
                            </div>
                        </div>
                        <p className="text-sm px-3 py-1 font-medium text-emerald-600">Almoço de hoje!</p>
                    </div>
                    <div className="flex items-center gap-1 mr-1">
                        <span className="text-[9px] font-bold text-muted-foreground">Visto 12:02</span>
                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                    </div>
                </div>

                {/* Typing Indicator */}
                <div className="flex gap-3 self-start items-center">
                    <div className="h-8 w-8 rounded-full bg-muted shrink-0 shadow-sm" />
                    <div className="bg-muted/30 px-4 py-3 rounded-full flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="h-1 w-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>
            </div>

            {/* Chat Input */}
            <div className="fixed bottom-24 left-0 right-0 z-40 px-4 py-4 bg-gradient-to-t from-background via-background/95 to-transparent">
                <div className="flex items-end gap-2 glass-card p-1.5 pr-2 rounded-[2rem] border-border/10 shadow-2xl ring-1 ring-black/5">
                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-muted-foreground hover:text-foreground">
                        <Paperclip className="h-5 w-5 rotate-45" />
                    </Button>
                    <div className="flex-1 py-3 px-2">
                        <textarea
                            className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 resize-none max-h-32 placeholder:text-muted-foreground/50 font-medium"
                            placeholder="Sua mensagem..."
                            rows={1}
                        />
                    </div>
                    <Button className="h-11 w-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 flex-shrink-0">
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
