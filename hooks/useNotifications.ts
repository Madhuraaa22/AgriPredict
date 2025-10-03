
import { useState, useCallback } from 'react';
import { NotificationState } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  
  const addNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  return { notifications, addNotification };
};
