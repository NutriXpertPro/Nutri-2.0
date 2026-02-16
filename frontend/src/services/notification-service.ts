import api from './api';
// Standalone functions to avoid object property issues with some bundlers
export const isSoundEnabled = () => {
  if (typeof window === 'undefined') return true;
  const setting = localStorage.getItem('notificationSoundEnabled');
  return setting === null ? true : setting === 'true';
};

export const toggleSound = () => {
  if (typeof window === 'undefined') return;
  const current = isSoundEnabled();
  const newState = !current;
  localStorage.setItem('notificationSoundEnabled', String(newState));
  return newState;
};

export const isNotificationEnabled = () => {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && Notification.permission === 'granted';
};

export const playNotificationSound = () => {
  if (!isSoundEnabled()) return;

  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
      });
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(200);
    }
  } catch (_e) {
  }
};

export const updateNotificationBadge = (count: number) => {
  if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator) {
    // @ts-ignore
    navigator.setAppBadge(count).catch((e) => console.error(e));
  }
};

export const fetchUnreadCount = async (): Promise<number> => {
  try {
    const response = await api.get('notifications/');
    if (Array.isArray(response.data)) {
      const count = response.data.filter((n: any) => !n.is_read).length;
      return count;
    }
    return 0;
  } catch (error) {
    return 0;
  }
};

export const notifyNewMessage = (sender: string, message: string) => {
  if (typeof window === 'undefined') return;

  if (isNotificationEnabled()) {
    try {
      new Notification(`Nova mensagem de ${sender}`, {
        body: message,
        icon: '/logo.png'
      });
    } catch (e) {
    }
  }
};

export const markAsRead = async (id: number) => {
  try {
    await api.patch(`notifications/${id}/`, { is_read: true });
  } catch (error) {
  }
};

export const initializeNotificationService = async () => {
  // NÃO solicita permissão automaticamente - apenas verifica status atual
  // A permissão deve ser solicitada explicitamente via botão de UI
  // quando o usuário clicar em "Ativar Notificações" nas configurações
  if (typeof window === 'undefined') return;
  
  // Apenas log do status atual, sem solicitar permissão
  // console.log('Notification permission status:', Notification.permission);
};

// Solicita permissão de notificação explicitamente (deve ser chamada por botão de UI)
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  if (!('Notification' in window)) {
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (e) {
    return false;
  }
};

// Export the object for backward compatibility
const service = {
  isSoundEnabled,
  toggleSound,
  isNotificationEnabled,
  playNotificationSound,
  updateNotificationBadge,
  fetchUnreadCount,
  notifyNewMessage,
  markAsRead,
  initializeNotificationService,
  requestNotificationPermission
};

export const notificationService = service;

// Default export if anyone uses it
export default service;