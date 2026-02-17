import { useState, useEffect, useCallback, useRef } from 'react'
import { settingsAPI } from '@/services/api'

export interface Notification {
  id: number
  type: 'message' | 'appointment' | 'diet' | 'evaluation' | 'lab_exam' | 'system' | 'payment'
  title: string
  message: string
  is_read: boolean
  created_at: string
  data?: any
}

const POLLING_INTERVAL = 15000 // 15 segundos
const NOTIFICATION_SOUND = '/notification.mp3'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const previousNotificationsRef = useRef<Notification[]>([])

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return
    
    try {
      // Play notification sound from public folder
      const audio = new Audio('/notification.mp3')
      audio.volume = 0.7
      audio.play().catch(() => {
        // Fallback: try system beep via Web Audio API
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.value = 800
          oscillator.type = 'sine'
          gainNode.gain.value = 0.3
          
          oscillator.start()
          setTimeout(() => {
            oscillator.stop()
            audioContext.close()
          }, 200)
        } catch (e) {
          // Silent fail if no audio available
        }
      })
    } catch (e) {
      // Silent fail
    }
  }, [soundEnabled])

  // Vibrate device
  const vibrateDevice = useCallback(() => {
    if (!vibrationEnabled) return
    
    try {
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
    } catch (e) {
      // Silent fail
    }
  }, [vibrationEnabled])

  // Show browser notification (if permitted)
  const showBrowserNotification = useCallback((notification: Notification) => {
    if (typeof window === 'undefined') return
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: `notification-${notification.id}`,
        requireInteraction: false
      })
    }
  }, [])

  // Request browser notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === 'undefined') return false
    
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }, [])

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await settingsAPI.getNotifications()
      const data = response.data
      
      setNotifications(data)
      
      const unread = data.filter((n: Notification) => !n.is_read).length
      const previousUnread = previousNotificationsRef.current.filter((n: Notification) => !n.is_read).length
      
      // Check for new unread notifications
      if (unread > previousUnread && previousNotificationsRef.current.length > 0) {
        // Find the new notification
        const newNotifications = data.filter((n: Notification) => {
          const previous = previousNotificationsRef.current.find((p: Notification) => p.id === n.id)
          return !previous?.is_read && n.is_read === false
        })
        
        if (newNotifications.length > 0) {
          const latestNew = newNotifications[0]
          playNotificationSound()
          vibrateDevice()
          showBrowserNotification(latestNew)
        }
      }
      
      setUnreadCount(unread)
      previousNotificationsRef.current = data
    } catch (err) {
      console.error('Erro ao buscar notificações:', err)
    } finally {
      setLoading(false)
    }
  }, [playNotificationSound, vibrateDevice, showBrowserNotification])

  // Mark as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await fetch(`/api/v1/notifications/${notificationId}/mark_as_read/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err)
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await fetch(`/api/v1/notifications/mark_all_as_read/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err)
    }
  }, [])

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev)
  }, [])

  // Toggle vibration
  const toggleVibration = useCallback(() => {
    setVibrationEnabled(prev => !prev)
  }, [])

  // Initial fetch and polling
  useEffect(() => {
    fetchNotifications()
    
    const interval = setInterval(fetchNotifications, POLLING_INTERVAL)
    
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        requestNotificationPermission()
      }
    }
  }, [requestNotificationPermission])

  return {
    notifications,
    unreadCount,
    loading,
    soundEnabled,
    vibrationEnabled,
    markAsRead,
    markAllAsRead,
    toggleSound,
    toggleVibration,
    refresh: fetchNotifications
  }
}