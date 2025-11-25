import React from 'react';
import { ScreenName } from '../types';
import { Input } from '../components/Input';

interface MarketplaceScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ onNavigate }) => {
  const categories = ['Featured', 'Fiction', 'Fantasy', 'Biography', 'Sci-Fi', 'History'];
  const books = [
    { title: 'The Midnight Library', author: 'Matt Haig', price: '$15.99', img: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=2606&auto=format&fit=crop' },
    { title: 'Project Hail Mary', author: 'Andy Weir', price: '$18.50', img: 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?q=80&w=2544&auto=format&fit=crop' },
    { title: 'Dune', author: 'Frank Herbert', price: '$12.00', img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2588&auto=format&fit=crop' },
    { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', price: '$14.75', img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=2574&auto=format&fit=crop' },
    { title: 'The Four Winds', author: 'Kristin Hannah', price: '$16.20', img: 'https://images.unsplash.com/photo-1641154748135-8032a61a3f80?q=80&w=1587&auto=format&fit=crop' },
    { title: 'Crying in H Mart', author: 'Michelle Zauner', price: '$17.99', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto animate-in fade-in duration-500">
       <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
         <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">import_contacts</span>
            <h1 className="text-xl font-bold text-primary dark:text-white">BookHaven</h1>
         </div>
         <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined text-slate-800 dark:text-white">shopping_cart</span>
         </button>
       </header>

       <div className="px-4 py-2">
         <Input icon="search" placeholder="Search books, authors, or ISBN..." className="bg-slate-200 border-transparent dark:bg-slate-800 dark:border-transparent rounded-full pl-4" />
       </div>

       <div className="flex gap-2 px-4 py-4 overflow-x-auto scrollbar-hide">
         {categories.map((cat, i) => (
            <button key={i} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>
                {cat}
            </button>
         ))}
       </div>

       <div className="grid grid-cols-2 gap-4 px-4 pb-4">
         {books.map((book, i) => (
            <div 
                key={i} 
                onClick={() => onNavigate(ScreenName.BOOK_DETAILS)}
                className="group cursor-pointer flex flex-col gap-2 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
                <div 
                    className="w-full aspect-[3/4] bg-cover bg-center rounded-lg shadow-sm group-hover:shadow-lg transition-shadow"
                    style={{ backgroundImage: `url("${book.img}")` }}
                />
                <div className="px-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{book.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{book.author}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{book.price}</p>
                </div>
            </div>
         ))}
       </div>
    </div>
  );
};