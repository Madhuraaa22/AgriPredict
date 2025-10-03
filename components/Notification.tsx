import React from 'react';
import { NotificationState } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface NotificationProps {
  notifications: NotificationState[];
}

const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  return (
    <div className="fixed top-5 right-5 z-50 space-y-3">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-white shadow-2xl animate-fade-in-out ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
          role="alert"
        >
          {notification.type === 'success' ? <CheckCircleIcon className="h-6 w-6"/> : <XCircleIcon className="h-6 w-6"/>}
          <span className="font-medium">{notification.message}</span>
        </div>
      ))}
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateX(100%); }
          10% { opacity: 1; transform: translateX(0); }
          90% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(100%); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Notification;