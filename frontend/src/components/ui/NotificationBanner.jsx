import React, { useEffect, useState, useCallback } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

const NotificationBanner = ({ 
  type = 'info', 
  message, 
  onDismiss, 
  autoHide = true, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, handleDismiss]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300); // Wait for animation to complete
  }, [onDismiss]);

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: AlertTriangle,
          iconColor: 'text-yellow-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: AlertCircle,
          iconColor: 'text-red-500'
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: Info,
          iconColor: 'text-blue-500'
        };
    }
  };

  const styles = getNotificationStyles();
  const Icon = styles.icon;

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className={`${styles.bg} border ${styles.text} px-4 py-3 rounded-lg shadow-lg max-w-md mx-auto`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className={`h-5 w-5 ${styles.iconColor} flex-shrink-0`} />
            <p className="text-sm font-medium">{message}</p>
          </div>
          
          <button
            onClick={handleDismiss}
            className={`ml-4 ${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {autoHide && duration > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all ease-linear ${
                  type === 'success' ? 'bg-green-500' :
                  type === 'warning' ? 'bg-yellow-500' :
                  type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{
                  width: '100%',
                  animation: `shrink ${duration}ms linear forwards`
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationBanner;