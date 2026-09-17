import React from 'react';
import { ProficiencyLevel, SkillType } from '../../types/skill';

export interface BadgeProps {
  label: string;
  type?: SkillType | 'neutral';
  level?: ProficiencyLevel;
  size?: 'sm' | 'md';
  onRemove?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  type = 'neutral',
  level,
  size = 'md',
  onRemove,
  className = '',
}) => {
  const typeStyles = {
    offered: 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00D285] border border-emerald-200/80 dark:border-emerald-800/50',
    teach: 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00D285] border border-emerald-200/80 dark:border-emerald-800/50',
    wanted: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200/80 dark:border-cyan-800/50',
    learn: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200/80 dark:border-cyan-800/50',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
  }[type] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-xs px-3 py-1 rounded-full font-medium',
  }[size];

  const levelBadges: Record<ProficiencyLevel, string> = {
    Beginner: 'bg-blue-500/20 text-blue-400',
    Intermediate: 'bg-amber-500/20 text-amber-400',
    Advanced: 'bg-indigo-500/20 text-indigo-400',
    Expert: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium transition-all duration-200 ${typeStyles} ${sizeStyles} ${className}`}
    >
      <span>{label}</span>
      {level && (
        <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded ${levelBadges[level]}`}>
          {level}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:text-white transition-colors focus:outline-none"
          title="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
};
