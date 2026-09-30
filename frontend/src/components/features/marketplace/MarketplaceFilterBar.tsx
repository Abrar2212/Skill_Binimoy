import React from 'react';
import { Sparkles, ArrowRightLeft, Users, PlusCircle } from 'lucide-react';

interface MarketplaceFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'trades' | 'peers';
  onViewModeChange: (mode: 'trades' | 'peers') => void;
  onPostTradeClick?: () => void;
  tradesCount?: number;
  peersCount?: number;
}

const CATEGORIES = [
  'All',
  'Web Development',
  'Design',
  'Data Science',
  'App Development',
  'Languages',
  'Marketing',
];

export const MarketplaceFilterBar: React.FC<MarketplaceFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onPostTradeClick,
  tradesCount,
  peersCount,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Row: View Switcher (Trade Offers vs Peers) + Post Trade CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Toggle Pills */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange('trades')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              viewMode === 'trades'
                ? 'bg-white dark:bg-slate-800 text-[#00D285] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Trade Offers</span>
            {tradesCount !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                viewMode === 'trades'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#00D285]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {tradesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('peers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              viewMode === 'peers'
                ? 'bg-white dark:bg-slate-800 text-[#00D285] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Peer Directory</span>
            {peersCount !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                viewMode === 'peers'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#00D285]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {peersCount}
              </span>
            )}
          </button>
        </div>

        {/* Post a Trade Button */}
        {onPostTradeClick && (
          <button
            type="button"
            onClick={onPostTradeClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Post a Trade Offer</span>
          </button>
        )}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              viewMode === 'trades'
                ? 'Search trade offers by skill (e.g. React, Figma, Python) or headline...'
                : 'Search peers by name or skill (e.g. React, Figma, Python)...'
            }
            className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-2 focus:ring-[#00D285]/20 shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <i className="fa-solid fa-arrow-down-wide-short text-slate-400 text-sm hidden sm:block ml-1" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort by criteria"
            className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#00D285] shadow-sm cursor-pointer"
          >
            <option value="ai">✨ AI Match (Profile Synergy)</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="recent">Recently Active</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0 font-semibold mr-1">
          <i className="fa-solid fa-filter text-xs text-[#00D285]" /> Category:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full font-semibold transition-all duration-200 shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#00D285] text-white shadow-md shadow-[#00D285]/25 scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
