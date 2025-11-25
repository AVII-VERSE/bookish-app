import React from 'react';
import { ScreenName } from '../types';
import { Button } from '../components/Button';

interface BookDetailScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const BookDetailScreen: React.FC<BookDetailScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-8 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <button onClick={() => onNavigate(ScreenName.MARKETPLACE)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Book Details</h1>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-slate-900 dark:text-white">bookmark_border</span>
          </button>
          <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-slate-900 dark:text-white">share</span>
          </button>
        </div>
      </header>

      {/* Cover Image */}
      <div className="px-6 py-4 flex justify-center">
        <div 
          className="w-full max-w-xs aspect-[3/4] bg-cover bg-center rounded-xl shadow-2xl relative overflow-hidden group"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=2606&auto=format&fit=crop")' }}
        >
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Info */}
      <div className="text-center px-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif mb-2">The Midnight Library</h1>
        <p className="text-primary font-medium underline cursor-pointer">by Matt Haig</p>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-slate-700 dark:text-slate-300">
             <div className="flex text-amber-500">
                <span className="material-symbols-filled text-lg">star</span>
                <span className="material-symbols-filled text-lg">star</span>
                <span className="material-symbols-filled text-lg">star</span>
                <span className="material-symbols-filled text-lg">star</span>
                <span className="material-symbols-outlined text-lg">star_half</span>
             </div>
             <span className="font-bold">4.5</span>
             <span className="text-slate-500 text-sm">(1,280 reviews)</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 px-6 mt-6 mb-6">
        <Button variant="primary" className="bg-primary/10 !text-primary hover:!bg-primary/20">Read Sample</Button>
        <Button variant="primary">Buy for $14.99</Button>
      </div>

      {/* Tabs */}
      <div className="px-4 border-b border-slate-200 dark:border-slate-800 flex gap-6 mb-4">
         <button className="py-3 px-2 border-b-2 border-primary text-primary font-semibold text-sm">About</button>
         <button className="py-3 px-2 border-b-2 border-transparent text-slate-500 font-semibold text-sm">Details</button>
         <button className="py-3 px-2 border-b-2 border-transparent text-slate-500 font-semibold text-sm">Reviews</button>
      </div>

      {/* Description */}
      <div className="px-6">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
            Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be different if you had made other choices...
            <button className="text-primary font-semibold ml-1 hover:underline">Read More</button>
        </p>
      </div>

      {/* More by Author */}
      <div className="mt-8">
        <div className="flex justify-between items-center px-6 mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">More by Matt Haig</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide snap-x">
             {[
                'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop'
             ].map((url, i) => (
                <div key={i} className="flex-shrink-0 w-32 snap-start">
                    <img src={url} className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300" alt="Book cover" />
                    <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">The Humans</p>
                </div>
             ))}
        </div>
      </div>
    </div>
  );
};