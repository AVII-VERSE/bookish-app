import React from 'react';
import { ScreenName } from '../types';

interface NotificationScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({ onNavigate }) => {
  const notifications = [
    { icon: 'sell', color: 'text-green-500', title: 'New Sale!', message: 'You sold a copy of "The Silent Observer"', time: '2 mins ago' },
    { icon: 'star', color: 'text-yellow-500', title: 'New Review', message: 'Sarah left a 5-star review on your book.', time: '1 hour ago' },
    { icon: 'celebration', color: 'text-purple-500', title: 'Milestone Reached', message: 'You crossed 1,000 total reads!', time: '1 day ago' },
    { icon: 'info', color: 'text-blue-500', title: 'System Update', message: 'Dashboard analytics have been updated.', time: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => onNavigate(ScreenName.DASHBOARD)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h1>
        <div className="ml-auto">
          <button className="text-xs font-bold text-primary hover:underline">Mark all read</button>
        </div>
      </header>

      <div className="p-4 space-y-3">
        {notifications.map((notif, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className={`p-2 h-fit rounded-full bg-slate-50 dark:bg-slate-800 ${notif.color}`}>
              <span className="material-symbols-outlined text-xl">{notif.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{notif.title}</h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
            </div>
            {i < 2 && <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};