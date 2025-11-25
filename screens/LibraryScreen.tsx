import React, { useState } from 'react';
import { ScreenName } from '../types';

interface LibraryScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'wishlist' | 'finished'>('current');

  const books = {
    current: [
      { title: 'Dune', author: 'Frank Herbert', progress: 45, img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2588&auto=format&fit=crop' },
      { title: 'Project Hail Mary', author: 'Andy Weir', progress: 12, img: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?q=80&w=2544&auto=format&fit=crop' },
    ],
    wishlist: [
      { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', progress: 0, img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=2574&auto=format&fit=crop' },
    ],
    finished: [
      { title: 'The Midnight Library', author: 'Matt Haig', progress: 100, img: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=2606&auto=format&fit=crop' },
    ]
  };

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-background-light dark:bg-background-dark animate-in fade-in duration-300">
      <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Library</h1>
        
        <div className="flex mt-4 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
          {(['current', 'wishlist', 'finished'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="p-4 grid gap-4">
        {books[activeTab].map((book, i) => (
          <div key={i} className="flex gap-4 p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <img src={book.img} alt={book.title} className="w-20 h-28 object-cover rounded-lg" />
            <div className="flex flex-col flex-1 justify-between py-1">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{book.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
              </div>
              
              {activeTab !== 'wishlist' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span>{book.progress}% Read</span>
                    {book.progress === 100 && <span className="text-green-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Completed</span>}
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${book.progress}%` }} />
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <button className="self-start text-xs font-bold text-primary dark:text-secondary border border-primary dark:border-secondary px-3 py-1.5 rounded-full hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-slate-900 transition-colors">
                  Buy Now
                </button>
              )}
            </div>
          </div>
        ))}
        
        {books[activeTab].length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">library_books</span>
            <p>No books in this list yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};