"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Heart, Users, MessageCircle } from 'lucide-react';

type NotificationType = 'match' | 'like' | 'message';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  createdAt: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep only 50 most recent

    // Show toast notification
    const icon = notification.type === 'match' ? Heart : 
                 notification.type === 'like' ? Users : MessageCircle;
    
    toast.success(notification.title, {
      description: notification.message,
      duration: 5000,
      action: notification.type === 'match' ? {
        label: 'View Matches',
        onClick: () => window.location.href = '/founder-matching/matches'
      } : undefined
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Set up Server-Sent Events connection
  useEffect(() => {
    if (!session?.user?.email) return;

    const es = new EventSource(`/api/notifications/stream?email=${encodeURIComponent(session.user.email)}`);
    
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'match') {
          addNotification({
            type: 'match',
            title: '🎉 New Match!',
            message: `You and ${data.user.name} liked each other!`,
            data: data.user
          });
        } else if (data.type === 'like') {
          addNotification({
            type: 'like',
            title: '❤️ Someone liked you!',
            message: 'Check your discover page to see who it was',
            data: data
          });
        }
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    es.onerror = (error) => {
      console.error('EventSource failed:', error);
    };

    setEventSource(es);

    return () => {
      es.close();
    };
  }, [session?.user?.email]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}