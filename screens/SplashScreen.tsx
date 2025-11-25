import React, { useEffect } from 'react';
import { ScreenName } from '../types';

interface SplashScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  useEffect(() => {
    // Simulate loading time then navigate to Landing
    const timer = setTimeout(() => {
      onNavigate(ScreenName.LANDING);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-dark text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary via-background-dark to-background-dark" />
      
      <div className="z-10 flex flex-col items-center animate-in zoom-in-95 duration-1000 fade-in">
        <span className="material-symbols-outlined text-8xl text-primary mb-4 animate-bounce">auto_stories</span>
        <h1 className="text-5xl font-bold tracking-tighter mb-2">Bookish</h1>
        <p className="text-slate-400 font-serif italic tracking-widest text-lg">Your Next Chapter.</p>
      </div>

      <div className="absolute bottom-10 z-10">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};