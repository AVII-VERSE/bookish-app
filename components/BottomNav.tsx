import React from 'react';
import { ScreenName } from '../types';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  // Define nav items with their target screens
  const items = [
    { label: 'Home', icon: 'home', screen: ScreenName.MARKETPLACE },
    { label: 'Library', icon: 'collections_bookmark', screen: ScreenName.LIBRARY },
    { label: 'Submit', icon: 'add_circle', screen: ScreenName.SUBMIT_BOOK },
    { label: 'Dashboard', icon: 'dashboard', screen: ScreenName.DASHBOARD },
    { label: 'Profile', icon: 'person', screen: ScreenName.PROFILE },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/95">
      <div className="flex h-16 items-center justify-around max-w-lg mx-auto px-2">
        {items.map((item) => {
          const isActive = currentScreen === item.screen;
          
          // Special styling for the center 'Submit' button if desired, or keep uniform
          const isCenter = item.screen === ScreenName.SUBMIT_BOOK;
          
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive 
                  ? 'text-primary dark:text-white' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${isActive ? 'material-symbols-filled scale-110' : ''} transition-transform`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};