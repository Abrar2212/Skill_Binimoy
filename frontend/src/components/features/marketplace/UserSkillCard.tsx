import React from 'react';
import { MarketplaceUser } from '../../../types/skill';
import { Avatar } from '../../common/Avatar';
import { Badge } from '../../common/Badge';

interface UserSkillCardProps {
  user: MarketplaceUser;
  onExchangeClick: (user: MarketplaceUser) => void;
}

export const UserSkillCard: React.FC<UserSkillCardProps> = ({ user, onExchangeClick }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-[#00D285]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header: User Info & Rating */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={user.full_name} src={user.profile_image} size="lg" isOnline />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#00D285] transition-colors">
                {user.full_name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[170px]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200/80 dark:border-amber-800/50 px-2.5 py-1 rounded-xl text-xs font-bold shrink-0">
            <i className="fa-solid fa-star text-amber-400 text-xs" />
            <span>{typeof user.rating === 'number' ? user.rating.toFixed(1) : '5.0'}</span>
            <span className="text-[10px] text-slate-400 font-normal">({user.review_count ?? 0})</span>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {user.bio}
          </p>
        )}

        {/* Skills Offered (skills_teach) */}
        <div className="space-y-2 mb-3">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#00D285] flex items-center gap-1.5">
            <i className="fa-solid fa-graduation-cap text-xs" /> Can Teach (Offered):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {user.skills_teach?.map((name, idx) => (
              <Badge key={idx} label={name} type="offered" size="sm" />
            ))}
            {(!user.skills_teach || user.skills_teach.length === 0) && (
              <span className="text-xs text-slate-400 italic">No skills listed yet</span>
            )}
          </div>
        </div>

        {/* Skills Wanted (skills_learn) */}
        <div className="space-y-2 mb-5">
          <span className="text-[11px] uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <i className="fa-solid fa-arrows-rotate text-xs" /> Wants to Learn:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {user.skills_learn?.map((name, idx) => (
              <Badge key={idx} label={name} type="wanted" size="sm" />
            ))}
            {(!user.skills_learn || user.skills_learn.length === 0) && (
              <span className="text-xs text-slate-400 italic">Open to all skills</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onExchangeClick(user)}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-xs shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <span>Propose Skill Trade</span>
          <i className="fa-solid fa-arrow-right text-xs" />
        </button>
      </div>
    </div>
  );
};
