"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft,
    MoreVertical,
    Video,
    Paperclip,
    Send,
    Smile,
    Image as ImageIcon,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react"
import { useTheme } from "next-themes"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useMessages } from "@/hooks/useMessages"
import { usePatient } from "@/contexts/patient-context"

const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
}

export function MessagesTab() {
    const { theme } = useTheme()
    const { patient } = usePatient()
    const [messageText, setMessageText] = React.useState("")
    const [showEmojis, setShowEmojis] = React.useState(false)
    const messagesEndRef = React.useRef<HTMLDivElement>(null)

    const { conversations, messages, selectedConversation, loading, fetchMessages, sendMessage } = useMessages()

    // Auto-select first conversation
    React.useEffect(() => {
        if (conversations.length > 0 && !selectedConversation) {
            fetchMessages(conversations[0].id)
        }
    }, [conversations, selectedConversation])

    // Scroll to bottom on new messages
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const onEmojiClick = (emojiData: any) => {
        setMessageText(prev => prev + emojiData.emoji)
    }

    const handleSend = async () => {
        if (!messageText.trim() || !selectedConversation) return
        try {
            await sendMessage(selectedConversation, messageText.trim())
            setMessageText("")
        } catch {
            // Error handled in hook
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // Get current conversation info
    const currentConv = conversations.find(c => c.id === selectedConversation)
    const otherParticipant = currentConv?.participants?.find(p => p.user_type !== 'paciente')
    const chatName = otherParticipant?.name || patient?.nutritionist_name || currentConv?.name || 'Chat'
    const chatInitials = chatName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

    const formatTime = (timestamp: string) => {
        try {
            const date = new Date(timestamp)
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        } catch {
            return ''
        }
    }

    const formatDateLabel = (timestamp: string) => {
        try {
            const date = new Date(timestamp)
            const today = new Date()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            if (date.toDateString() === today.toDateString()) return 'Hoje'
            if (date.toDateString() === yesterday.toDateString()) return 'Ontem'
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
        } catch {
            return ''
        }
    }

    // Group messages by date
    const groupedMessages = React.useMemo(() => {
        const groups: { label: string; messages: typeof messages }[] = []
        let currentLabel = ''
        messages.forEach(msg => {
            const label = formatDateLabel(msg.timestamp)
            if (label !== currentLabel) {
                currentLabel = label
                groups.push({ label, messages: [msg] })
            } else if (groups.length > 0) {
                groups[groups.length - 1].messages.push(msg)
            }
        })
        return groups
    }, [messages])

    // If no conversations at all
    if (!loading && conversations.length === 0) {
        return (
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col h-screen pt-4 items-center justify-center"
            >
                <span className="material-symbols-outlined text-5xl text-zinc-500 mb-4">chat_bubble_outline</span>
                <p className="text-sm font-bold text-zinc-400">Nenhuma conversa</p>
                <p className="text-xs text-zinc-500 mt-1">Aguarde o nutricionista iniciar uma conversa.</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col h-screen pt-4"
        >
            {/* Chat Header */}
            <div className="fixed top-16 left-0 right-0 z-40 glass-header px-4 py-3 flex items-center justify-between border-b border-border/10">
                <div className="flex items-center gap-3">
                    <button className="text-muted-foreground hover:text-foreground transition-colors md:hidden">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div className="relative">
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/20 shadow-sm bg-muted flex items-center justify-center">
                            {otherParticipant?.avatar ? (
                                <img src={otherParticipant.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs font-bold text-primary">{chatInitials}</span>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-primary rounded-full border-2 border-background shadow-sm" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold leading-none">{chatName}</h2>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1 block">
                            {otherParticipant?.professional_title || 'Online'}
                        </span>
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
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-20 opacity-60">
                        <span className="material-symbols-outlined text-4xl text-zinc-500 mb-3">chat</span>
                        <p className="text-sm text-zinc-400 font-bold">Nenhuma mensagem ainda</p>
                        <p className="text-xs text-zinc-500 mt-1">Envie uma mensagem para começar.</p>
                    </div>
                ) : (
                    groupedMessages.map((group, gIdx) => (
                        <React.Fragment key={gIdx}>
                            <div className="flex justify-center py-2">
                                <span className="bg-muted px-4 py-1 rounded-full text-[9px] font-black text-muted-foreground uppercase tracking-widest">{group.label}</span>
                            </div>

                            {group.messages.map((msg) => (
                                msg.isOwn ? (
                                    <div key={msg.id} className="flex flex-col gap-1 max-w-[85%] self-end items-end">
                                        <div className="bg-primary text-white p-3.5 rounded-2xl rounded-br-none shadow-md">
                                            <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                                        </div>
                                        <span className="text-[9px] font-bold text-muted-foreground mr-1">{formatTime(msg.timestamp)}</span>
                                    </div>
                                ) : (
                                    <div key={msg.id} className="flex gap-3 max-w-[85%]">
                                        <div className="h-8 w-8 rounded-full bg-muted shrink-0 mt-auto shadow-sm flex items-center justify-center">
                                            <span className="text-[8px] font-bold">{chatInitials}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="glass-card p-3.5 rounded-2xl rounded-bl-none border-none shadow-sm">
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                            </div>
                                            <span className="text-[9px] font-bold text-muted-foreground ml-1">{formatTime(msg.timestamp)}</span>
                                        </div>
                                    </div>
                                )
                            ))}
                        </React.Fragment>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="fixed bottom-24 left-0 right-0 z-40 px-4 py-4 bg-gradient-to-t from-background via-background/95 to-transparent">
                <div className="flex items-end gap-2 glass-card p-1.5 pr-2 rounded-[2rem] border-border/10 shadow-2xl ring-1 ring-black/5">

                    <Popover open={showEmojis} onOpenChange={setShowEmojis}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-muted-foreground hover:text-primary transition-colors">
                                <Smile className="h-5 w-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side="top" align="start" className="p-0 border-none shadow-2xl rounded-2xl overflow-hidden mb-2">
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                theme={theme === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT}
                                width={300}
                                height={400}
                                skinTonesDisabled
                                searchPlaceholder="Buscar emoji..."
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="flex-1 py-3 px-2">
                        <textarea
                            className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 resize-none max-h-32 placeholder:text-muted-foreground/50 font-medium"
                            placeholder="Sua mensagem..."
                            rows={1}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <Button
                        className="h-11 w-11 rounded-full bg-primary hover:opacity-90 text-white shadow-lg shadow-primary/20 flex-shrink-0"
                        onClick={handleSend}
                        disabled={!messageText.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
