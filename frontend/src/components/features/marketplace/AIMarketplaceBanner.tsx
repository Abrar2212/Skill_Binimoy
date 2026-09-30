import React from 'react';
import { Link } from 'react-router-dom';
import { TradePost } from '../../../types/skill';
import { Sparkles, ArrowRightLeft, UserCheck, AlertCircle, PlusCircle, ArrowRight } from 'lucide-react';
import { Avatar } from '../../common/Avatar';

interface AIMarketplaceBannerProps {
  isLoggedIn: boolean;
  isProfileReady: boolean;
  bestMatchPost?: TradePost | null;
  totalMatches: number;
  onProposeTrade: (post: TradePost) => void;
  onPostTradeClick: () => void;
}

export const AIMarketplaceBanner: React.FC<AIMarketplaceBannerProps> = ({
  isLoggedIn,
  isProfileReady,
  bestMatchPost,
  totalMatches,
  onProposeTrade,
  onPostTradeClick,
}) => {
  // Scenario 1: Not logged in
  if (!isLoggedIn) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#00D285]/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D285]/15 border border-[#00D285]/30 text-[#00D285] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Skill Barter Engine</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Log in to unlock AI-powered reciprocal trade matching
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Skill Binimoy analyzes what you teach and what you want to learn to instantly match you with ideal barter partners.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-2xl bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/20 transition-all hover:scale-105 active:scale-95"
            >
              Sign In to Match
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Scenario 2: Profile not ready (missing teach or learn skills)
  if (!isProfileReady) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40 dark:border-amber-700/40 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 text-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                <span>Action Recommended</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Set up your skill profile to enable AI Smart Match
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Add at least one skill you can teach and one skill you want to learn. Our AI will automatically rank and suggest reciprocal trades tailored to your goals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:self-center">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              <span>Configure Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Scenario 3: Profile is ready, display AI Match suggestion
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/40 p-6 text-white shadow-xl shadow-emerald-950/20">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#00D285]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top bar with tag & actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D285] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D285]" />
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D285]/20 border border-[#00D285]/40 text-[#00D285] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Profile Synergy Active</span>
            </div>
            <span className="text-xs text-slate-300 font-medium hidden md:inline">
              Sorted by your profile compatibility
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPostTradeClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Trade</span>
            </button>
          </div>
        </div>

        {/* Suggestion Highlights */}
        {bestMatchPost ? (
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <Avatar
                src={bestMatchPost.user_image || undefined}
                name={bestMatchPost.user_name}
                size="md"
                className="border-2 border-[#00D285] shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white truncate">{bestMatchPost.user_name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00D285] text-[10px] font-bold border border-emerald-500/30">
                    {bestMatchPost.ai_match?.score ? `${bestMatchPost.ai_match.score}% Match` : 'Top Match'}
                  </span>
                  {bestMatchPost.ai_match?.is_reciprocal && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                      🔥 Mutual Barter
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 line-clamp-1">
                  {bestMatchPost.title}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-300 flex-wrap pt-0.5">
                  <span className="font-semibold text-emerald-400">Offers: {bestMatchPost.offered_skill}</span>
                  <ArrowRightLeft className="w-3 h-3 text-[#00D285]" />
                  <span className="font-semibold text-blue-400">Wants: {bestMatchPost.requested_skill}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/60 justify-end">
              <button
                onClick={() => onProposeTrade(bestMatchPost)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#00D285]" />
                <span>Trade Now</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2 text-xs text-slate-300 flex items-center justify-between">
            <span>
              Your profile is ready! Showing all available community trade offers sorted by skill synergy.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
