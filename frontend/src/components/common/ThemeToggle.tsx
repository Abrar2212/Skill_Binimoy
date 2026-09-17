import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-amber-400 shadow-sm transition-all duration-200 active:scale-90 hover:scale-105 ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <i className="fa-solid fa-sun text-amber-400 text-sm hover:rotate-45 transition-transform duration-300" />
      ) : (
        <i className="fa-solid fa-moon text-slate-700 text-sm hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
};
