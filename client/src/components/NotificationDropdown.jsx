import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, BellAlertIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../context/NotificationContext';

const NotificationDropdown = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'due-soon':
        return <BellAlertIcon className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <BellAlertIcon className="h-5 w-5 text-red-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get notification background color based on type and read status
  const getNotificationBg = (notification) => {
    if (notification.read) return 'bg-white';
    
    switch (notification.type) {
      case 'due-soon':
        return 'bg-yellow-50';
      case 'overdue':
        return 'bg-red-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="relative inline-flex items-center p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
          <span className="sr-only">Notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              {notifications.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Mark all as read
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-gray-100 ${getNotificationBg(notification)}`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 pt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm text-gray-900">
                          {notification.message}
                        </p>
                        <div className="mt-1 flex justify-between items-center">
                          <p className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </p>
                          <div className="flex space-x-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="text-xs text-gray-600 hover:text-gray-800"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                        {notification.bookId && (
                          <div className="mt-1">
                            <Link
                              to={`/books/${notification.bookId}`}
                              className="text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => markAsRead(notification.id)}
                            >
                              View Book
                            </Link>
                          </div>
                        )}
                        {notification.reservationId && (
                          <div className="mt-1">
                            <Link
                              to="/my-reservations"
                              className="text-xs text-blue-600 hover:text-blue-800"
                              onClick={() => markAsRead(notification.id)}
                            >
                              View Reservation
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationDropdown;
