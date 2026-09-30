import React from 'react';
import { TradePost, MarketplaceUser } from '../../../types/skill';
import { Avatar } from '../../common/Avatar';
import { Sparkles, ArrowRightLeft, Clock, Trash2, CheckCircle2 } from 'lucide-react';

interface TradePostCardProps {
  post: TradePost;
  onProposeClick: (user: MarketplaceUser, offeredSkill: string, requestedSkill: string) => void;
  onDeleteClick?: (id: number) => void;
}

export const TradePostCard: React.FC<TradePostCardProps> = ({
  post,
  onProposeClick,
  onDeleteClick,
}) => {
  const isReciprocal = post.ai_match?.is_reciprocal;
  const isWishlist = post.ai_match?.match_type === 'wishlist';
  const isOffer = post.ai_match?.match_type === 'offer';

  const handlePropose = () => {
    const targetUser: MarketplaceUser = {
      id: post.user_id,
      full_name: post.user_name,
      email: '',
      profile_image: post.user_image,
      rating: post.user_rating,
      review_count: post.user_review_count,
      skills_teach: [post.offered_skill],
      skills_learn: [post.requested_skill],
    };
    onProposeClick(targetUser, post.requested_skill, post.offered_skill);
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl ${
        isReciprocal
          ? 'border-[#00D285]/70 dark:border-[#00D285]/60 ring-2 ring-[#00D285]/15'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {/* Header: User Info & AI Match Tag */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.user_image || undefined}
              name={post.user_name}
              size="md"
              className="border-2 border-slate-100 dark:border-slate-800 shadow-sm"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#00D285] transition-colors">
                {post.user_name}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-amber-500">
                  <i className="fa-solid fa-star text-xs" />
                  <span>{post.user_rating ? post.user_rating.toFixed(1) : '5.0'}</span>
                </span>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* AI Match Badge */}
          {isReciprocal ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/80 text-[#00D285] text-[11px] font-bold shadow-xs animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Reciprocal Match</span>
            </span>
          ) : isWishlist ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[#00D285] text-[10px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Teaches Your Wishlist</span>
            </span>
          ) : isOffer ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
              <span>Wants What You Teach</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-semibold">
              Open Trade
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug">
          {post.title}
        </h3>

        {/* AI Synergy Reason Banner (if reciprocal) */}
        {post.ai_match?.reason && (
          <div className="mb-4 p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00D285]" />
            <span>{post.ai_match.reason}</span>
          </div>
        )}

        {/* Skill Exchange Visual Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Offers (Teaches):
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              {post.offered_skill}
            </span>
          </div>

          <div className="flex items-center justify-center my-1 text-slate-300 dark:text-slate-600">
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#00D285]" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Seeks (Learns):
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              {post.requested_skill}
            </span>
          </div>
        </div>

        {/* Description */}
        {post.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
            {post.description}
          </p>
        )}
      </div>

      {/* Card Footer: Availability & Action Button */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[130px]">{post.availability || 'Flexible schedule'}</span>
        </div>

        {post.is_own_post ? (
          <button
            onClick={() => onDeleteClick && onDeleteClick(post.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        ) : (
          <button
            onClick={handlePropose}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer ${
              isReciprocal
                ? 'bg-[#00D285] hover:bg-[#00ba76] text-white shadow-[#00D285]/20'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[#00D285] dark:hover:bg-[#00D285] dark:hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{isReciprocal ? 'Instant Reciprocal Trade' : 'Propose Trade'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
