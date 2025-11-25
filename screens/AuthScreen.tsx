import React, { useState } from 'react';
import { ScreenName } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface AuthScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate }) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login success
    onNavigate(ScreenName.DASHBOARD);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center pt-10 pb-8">
        <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-4xl text-primary">auto_stories</span>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bookish</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-serif italic">Your Next Chapter Awaits.</p>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-800 p-1 rounded-lg flex mb-6">
        <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'signup' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
            onClick={() => setMode('signup')}
        >
            Sign Up
        </button>
        <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'login' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
            onClick={() => setMode('login')}
        >
            Log In
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {mode === 'signup' && (
            <Input label="Full Name" placeholder="Enter your full name" type="text" />
        )}
        <Input label="Email" placeholder="Enter your email address" type="email" />
        <Input label="Password" placeholder="Enter your password" type="password" icon="visibility" />
        
        {mode === 'login' && (
            <div className="flex justify-end">
                <a href="#" className="text-sm text-primary font-medium hover:underline">Forgot password?</a>
            </div>
        )}

        <Button type="submit" fullWidth className="mt-4">
            {mode === 'signup' ? 'Create Account' : 'Log In'}
        </Button>
      </form>

      <div className="relative w-full my-8 text-center">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
        </div>
        <span className="relative px-2 bg-background-light dark:bg-background-dark text-xs text-slate-500 dark:text-slate-400">or continue with</span>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button className="flex items-center justify-center gap-3 h-12 w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium">Continue with Google</span>
        </button>
        <button className="flex items-center justify-center gap-3 h-12 w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">apple</span>
            <span className="text-sm font-medium">Continue with Apple</span>
        </button>
      </div>

      <p className="mt-8 text-xs text-center text-slate-500 dark:text-slate-400">
        By continuing, you agree to our <a href="#" className="text-primary hover:underline">Terms</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </div>
  );
};