import React from 'react';
import { Link } from 'react-router-dom';
import { Skill } from '../../../types/skill';
import { Badge } from '../../common/Badge';

interface SkillsOverviewCardProps {
  skills: Skill[];
}

export const SkillsOverviewCard: React.FC<SkillsOverviewCardProps> = ({ skills }) => {
  const offered = skills.filter((s) => s.skill_type === 'teach' || (s.skill_type as any) === 'offered');
  const wanted = skills.filter((s) => s.skill_type === 'learn' || (s.skill_type as any) === 'wanted');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-sm">
            <i className="fa-solid fa-layer-group" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Your Skill Matrix</h3>
        </div>
        <Link
          to="/profile"
          className="text-xs font-bold text-[#00D285] hover:text-[#00ba76] transition-colors flex items-center gap-1.5"
        >
          <i className="fa-solid fa-plus text-[10px]" />
          <span>Manage Skills</span>
        </Link>
      </div>

      <div className="space-y-5 text-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00D285] flex items-center gap-1.5 mb-2.5">
            <i className="fa-solid fa-chalkboard-user text-xs" />
            <span>Skills You Offer:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {offered.map((s, idx) => (
              <Badge
                key={`offered-${s.id ?? 'sk'}-${s.skill_name}-${idx}`}
                label={s.skill_name}
                type="offered"
                level={s.proficiency_level}
                size="sm"
              />
            ))}
            {offered.length === 0 && (
              <p className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                No offered skills added yet.
              </p>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 mb-2.5">
            <i className="fa-solid fa-graduation-cap text-xs" />
            <span>Skills You Want to Learn:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {wanted.map((s, idx) => (
              <Badge
                key={`wanted-${s.id ?? 'sk'}-${s.skill_name}-${idx}`}
                label={s.skill_name}
                type="wanted"
                size="sm"
              />
            ))}
            {wanted.length === 0 && (
              <p className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                No wanted skills added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
