import React from 'react';
import NotificationBanner from './NotificationBanner';

const NotificationList = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {notifications.map(notification => (
        <NotificationBanner
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onDismiss={() => onDismiss(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationList;