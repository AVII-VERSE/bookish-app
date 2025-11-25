import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  onIconClick?: () => void;
}

export const Input: React.FC<InputProps> = ({ label, icon, onIconClick, className = '', ...props }) => {
  return (
    <label className="flex flex-col gap-2 w-full">
      {label && <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>}
      <div className="relative flex items-center">
        <input
          className={`form-input h-12 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary ${className} ${icon ? 'pr-10' : ''}`}
          {...props}
        />
        {icon && (
          <button 
            type="button"
            onClick={onIconClick}
            className="absolute right-3 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </button>
        )}
      </div>
    </label>
  );
};