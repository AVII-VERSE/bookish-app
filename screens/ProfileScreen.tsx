import React from 'react';
import { ScreenName } from '../types';
import { Button } from '../components/Button';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const menuItems = [
    { icon: 'person', label: 'Account Settings' },
    { icon: 'notifications', label: 'Notifications' },
    { icon: 'lock', label: 'Privacy & Security' },
    { icon: 'help', label: 'Help & Support' },
    { icon: 'palette', label: 'Appearance' },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-background-light dark:bg-background-dark animate-in slide-in-from-right duration-300">
      <div className="relative h-48 bg-gradient-to-br from-primary to-primary-dark">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-background-dark overflow-hidden bg-white">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-14 px-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alex Johnson</h1>
        <p className="text-slate-500 dark:text-slate-400">alex.johnson@example.com</p>
        <div className="flex gap-4 mt-4">
          <div className="text-center p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 flex-1">
            <span className="block text-xl font-bold text-slate-900 dark:text-white">12</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Books Read</span>
          </div>
          <div className="text-center p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 flex-1">
            <span className="block text-xl font-bold text-slate-900 dark:text-white">4.8</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg Rating</span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-2">
        {menuItems.map((item, i) => (
          <button 
            key={i}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
        ))}
        
        <button 
          onClick={() => onNavigate(ScreenName.AUTH)}
          className="w-full flex items-center gap-3 p-4 mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium"
        >
          <span className="material-symbols-outlined">logout</span>
          Log Out
        </button>
      </div>
    </div>
  );
};