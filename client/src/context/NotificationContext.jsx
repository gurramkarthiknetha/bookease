import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { reservationAPI } from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Check for due date reminders
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const checkDueDates = async () => {
      try {
        const res = await reservationAPI.getUserReservations();
        const reservations = res.data.reservations;
        
        // Filter active reservations
        const activeReservations = reservations.filter(
          res => res.status === 'active' || res.status === 'pending'
        );
        
        // Check for upcoming due dates (within 3 days)
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);
        
        const upcomingDueDates = activeReservations.filter(res => {
          const dueDate = new Date(res.dueDate);
          return dueDate <= threeDaysFromNow && dueDate > today;
        });
        
        // Check for overdue books
        const overdueBooks = activeReservations.filter(res => {
          const dueDate = new Date(res.dueDate);
          return dueDate < today;
        });
        
        // Create notifications
        const newNotifications = [
          ...upcomingDueDates.map(res => ({
            id: `due-${res._id}`,
            type: 'due-soon',
            message: `"${res.book.title}" is due in ${Math.ceil((new Date(res.dueDate) - today) / (1000 * 60 * 60 * 24))} days.`,
            bookId: res.book._id,
            reservationId: res._id,
            createdAt: new Date().toISOString(),
            read: false
          })),
          ...overdueBooks.map(res => ({
            id: `overdue-${res._id}`,
            type: 'overdue',
            message: `"${res.book.title}" is overdue! Please return it as soon as possible.`,
            bookId: res.book._id,
            reservationId: res._id,
            createdAt: new Date().toISOString(),
            read: false
          }))
        ];
        
        // Add new notifications
        if (newNotifications.length > 0) {
          setNotifications(prev => {
            // Filter out duplicates
            const existingIds = prev.map(n => n.id);
            const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
            
            return [...uniqueNew, ...prev];
          });
        }
      } catch (err) {
        console.error('Error checking due dates:', err);
      }
    };
    
    // Check immediately and then every hour
    checkDueDates();
    const interval = setInterval(checkDueDates, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);
  
  // Update unread count
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);
  
  // Add a new notification
  const addNotification = (notification) => {
    setNotifications(prev => [
      {
        id: `manual-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
        ...notification
      },
      ...prev
    ]);
  };
  
  // Mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };
  
  // Remove a notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
  };
  
  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };
  
  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
