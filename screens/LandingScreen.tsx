import React, { useState } from 'react';
import { ScreenName } from '../types';
import { Button } from '../components/Button';

interface LandingScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  const [role, setRole] = useState<'reader' | 'publisher'>('reader');

  return (
    <div className="flex flex-col min-h-screen pb-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-center p-6 text-slate-900 dark:text-white">
        <span className="material-symbols-outlined text-4xl text-primary">import_contacts</span>
        <span className="text-2xl font-bold ml-2">Chapter.</span>
      </div>
      
      <div className="px-4 py-3">
        <div 
            className="w-full bg-center bg-no-repeat bg-cover rounded-xl shadow-lg h-64 sm:h-80"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2070&auto=format&fit=crop")' }}
        />
      </div>

      <h1 className="text-slate-900 dark:text-white text-3xl font-bold text-center px-6 pt-4 leading-tight">
        Your Next Chapter Awaits
      </h1>

      <div className="px-6 py-4">
        <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'reader' ? 'bg-white text-slate-900 shadow-sm dark:bg-background-dark dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            onClick={() => setRole('reader')}
          >
            For Readers
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'publisher' ? 'bg-white text-slate-900 shadow-sm dark:bg-background-dark dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            onClick={() => setRole('publisher')}
          >
            For Publishers
          </button>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 text-center px-6 pb-6">
        Discover thousands of books from indie authors tailored just for you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-4 mb-8">
         {[
           { icon: 'spark', title: 'Personalized', desc: 'Books tailored to you.' },
           { icon: 'chat_bubble', title: 'Connect', desc: 'Engage with writers.' },
           { icon: 'bookmarks', title: 'Library', desc: 'Curate your collection.' }
         ].map((item, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
         ))}
      </div>

      <div className="mt-auto px-4 flex flex-col gap-3">
        <Button onClick={() => onNavigate(ScreenName.AUTH)} className="w-full">
            Create Account
        </Button>
        <div className="flex justify-center items-center gap-2 text-sm text-slate-500 dark:text-slate-400 pb-4">
            <span>Already have an account?</span>
            <button onClick={() => onNavigate(ScreenName.AUTH)} className="text-primary font-bold hover:underline">Log In</button>
        </div>
      </div>
    </div>
  );
};