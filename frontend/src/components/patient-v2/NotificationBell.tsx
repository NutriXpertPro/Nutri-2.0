"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, MessageSquare, Calendar, FileText, Activity, TestTube, Info, Settings, Volume2, VolumeX, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications, type Notification } from "@/hooks/useNotifications"
import { motion, AnimatePresence } from "framer-motion"

interface NotificationBellProps {
    onNotificationClick?: (notification: Notification) => void
}

export function NotificationBell({ onNotificationClick }: NotificationBellProps) {
    const { 
        notifications, 
        unreadCount, 
        loading, 
        markAsRead, 
        markAllAsRead,
        soundEnabled,
        vibrationEnabled,
        toggleSound,
        toggleVibration
    } = useNotifications()
    
    const [isOpen, setIsOpen] = useState(false)
    const [hasNew, setHasNew] = useState(false)

    // Check for new notifications to trigger animation
    useEffect(() => {
        if (unreadCount > 0 && !loading) {
            setHasNew(true)
            const timer = setTimeout(() => setHasNew(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [unreadCount, loading])

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id)
        }
        onNotificationClick?.(notification)
        setIsOpen(false)
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />
            case 'appointment': return <Calendar className="w-4 h-4 text-purple-500" />
            case 'diet': return <FileText className="w-4 h-4 text-emerald-500" />
            case 'evaluation': return <Activity className="w-4 h-4 text-orange-500" />
            case 'lab_exam': return <TestTube className="w-4 h-4 text-red-500" />
            default: return <Info className="w-4 h-4 text-gray-500" />
        }
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Agora'
        if (minutes < 60) return `${minutes}m`
        if (hours < 24) return `${hours}h`
        if (days < 7) return `${days}d`
        return date.toLocaleDateString('pt-BR')
    }

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            >
                <Bell className={`w-5 h-5 ${hasNew ? 'text-primary' : 'text-foreground/70'}`} />
                
                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
                
                {/* Pulsing Animation for New Notifications */}
                {hasNew && (
                    <motion.span
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-primary/30"
                    />
                )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-80 max-h-[500px] overflow-hidden bg-card border border-border/20 rounded-2xl shadow-xl z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">Notificações</h3>
                                {unreadCount > 0 && (
                                    <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                                        {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {/* Sound Toggle */}
                                <button
                                    onClick={toggleSound}
                                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                                    title={soundEnabled ? 'Silenciar' : 'Ativar som'}
                                >
                                    {soundEnabled ? (
                                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <VolumeX className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </button>
                                
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAllAsRead()}
                                        className="text-xs text-primary hover:underline ml-2"
                                    >
                                        Marcar tudo
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto max-h-[350px]">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-xs text-muted-foreground mt-2">Carregando...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
                                </div>
                            ) : (
                                notifications.slice(0, 20).map((notification) => (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full p-3 flex gap-3 hover:bg-white/5 transition-colors text-left border-b border-border/5 ${
                                            !notification.is_read ? 'bg-primary/5' : ''
                                        }`}
                                    >
                                        <div className={`p-2 rounded-full ${notification.is_read ? 'bg-muted/30' : 'bg-primary/20'}`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${notification.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">
                                                {formatTime(notification.created_at)}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-border/10">
                                <button className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors">
                                    Ver todas as notificações
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}