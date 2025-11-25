import React from 'react';
import { ScreenName } from '../types';
import { AreaChart, Area, Tooltip, ResponsiveContainer, Stop, LinearGradient } from 'recharts';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const data = [
  { name: 'Week 1', value: 2000 },
  { name: 'Week 1.5', value: 3500 },
  { name: 'Week 2', value: 2100 },
  { name: 'Week 2.5', value: 4800 },
  { name: 'Week 3', value: 2400 },
  { name: 'Week 3.5', value: 1800 },
  { name: 'Week 4', value: 4120 },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pb-24 animate-in fade-in duration-500 max-w-lg mx-auto">
      {/* Header */}
      <div className="p-4 bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <div 
                    onClick={() => onNavigate(ScreenName.PROFILE)}
                    className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-700 cursor-pointer"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop")' }}
                />
            </div>
            <button 
              onClick={() => onNavigate(ScreenName.NOTIFICATIONS)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors relative"
            >
                <span className="material-symbols-outlined text-slate-800 dark:text-white">notifications</span>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
            </button>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, Alex</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-6">
        {[
            { label: 'Total Revenue', value: '$12,482', change: '+5.2%', positive: true },
            { label: 'Units Sold', value: '856', change: '+12.1%', positive: true },
            { label: 'Avg. Rating', value: '4.8', change: '-0.1', positive: false },
            { label: 'New Reviews', value: '23', change: '+8', positive: true },
        ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col gap-1">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-500' : 'text-amber-500'}`}>{stat.change}</span>
            </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="px-4 mb-8">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-slate-900 dark:text-white">Sales Performance</h3>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    {['7D', '30D', '90D'].map(period => (
                        <button key={period} className={`px-2 py-1 text-xs rounded-md font-medium ${period === '30D' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                            {period}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <span className="text-3xl font-bold text-slate-900 dark:text-white block">$4,120</span>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Last 30 Days</span>
                    <span className="text-sm font-medium text-green-500">+12.1%</span>
                </div>
            </div>
            
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1754cf" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#1754cf" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ display: 'none' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#1754cf" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2 px-2">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
            </div>
        </div>
      </div>

      {/* My Books */}
      <div className="px-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">My Books</h2>
        <div className="flex flex-col gap-4">
            {[
                { title: 'The Silent Observer', rating: '4.9', count: '2,184', img: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=3786&auto=format&fit=crop' },
                { title: 'Echoes of the Void', rating: '4.7', count: '1,530', img: 'https://images.unsplash.com/photo-1620052581237-5d36667be337?q=80&w=2574&auto=format&fit=crop' }
            ].map((book, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <img src={book.img} alt={book.title} className="w-16 h-24 object-cover rounded-md shadow-sm" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{book.title}</h3>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="material-symbols-filled text-yellow-500 text-sm">star</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{book.rating} ({book.count} ratings)</span>
                        </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            ))}
        </div>
      </div>
      
      {/* FAB */}
      <button 
        onClick={() => onNavigate(ScreenName.SUBMIT_BOOK)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

    </div>
  );
};