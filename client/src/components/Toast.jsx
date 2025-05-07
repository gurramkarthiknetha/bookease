import { useState, useEffect, createContext, useContext } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Create context
const ToastContext = createContext();

// Toast types
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Toast component
const Toast = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(toast.id), 300); // Wait for animation to complete
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  // Get icon based on type
  const getIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case TOAST_TYPES.ERROR:
        return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
      case TOAST_TYPES.WARNING:
        return <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />;
      case TOAST_TYPES.INFO:
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  // Get background color based on type
  const getBgColor = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return 'bg-green-50 border-green-200';
      case TOAST_TYPES.ERROR:
        return 'bg-red-50 border-red-200';
      case TOAST_TYPES.WARNING:
        return 'bg-yellow-50 border-yellow-200';
      case TOAST_TYPES.INFO:
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={`${getBgColor()} border rounded-lg shadow-lg p-4 mb-3 flex items-start transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="ml-3 flex-1">
        {toast.title && <h3 className="text-sm font-medium text-gray-900">{toast.title}</h3>}
        <div className="text-sm text-gray-700 mt-1">{toast.message}</div>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(toast.id), 300);
        }}
        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

// Toast container
const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

// Toast provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, ...toast }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message, title = 'Success', duration = 5000) => {
    return addToast({ type: TOAST_TYPES.SUCCESS, message, title, duration });
  };

  const showError = (message, title = 'Error', duration = 5000) => {
    return addToast({ type: TOAST_TYPES.ERROR, message, title, duration });
  };

  const showInfo = (message, title = 'Info', duration = 5000) => {
    return addToast({ type: TOAST_TYPES.INFO, message, title, duration });
  };

  const showWarning = (message, title = 'Warning', duration = 5000) => {
    return addToast({ type: TOAST_TYPES.WARNING, message, title, duration });
  };

  return (
    <ToastContext.Provider
      value={{ showSuccess, showError, showInfo, showWarning, removeToast }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
