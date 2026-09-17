import React, { useState } from 'react';
import { Skill, ProficiencyLevel, SkillType } from '../../../types/skill';
import { Button } from '../../common/Button';

interface SkillManagerProps {
  skills: Skill[];
  onAddSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
  onDeleteSkill: (id: string | number) => Promise<void>;
}

export const SkillManager: React.FC<SkillManagerProps> = ({
  skills,
  onAddSkill,
  onDeleteSkill,
}) => {
  const [skillName, setSkillName] = useState('');
  const [skillType, setSkillType] = useState<SkillType>('teach');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setLoading(true);
    try {
      await onAddSkill({
        skill_name: skillName.trim(),
        skill_type: skillType,
        proficiency_level: proficiency,
        category,
      });
      setSkillName('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const offeredSkills = skills.filter((s) => s.skill_type === 'teach');
  const wantedSkills = skills.filter((s) => s.skill_type === 'learn');

  return (
    <div className="space-y-6">
      {/* Add New Skill Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors border-t-4 border-t-[#00D285]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00D285]/15 text-[#00D285] flex items-center justify-center text-base font-bold shadow-inner">
              <i className="fa-solid fa-wand-magic-sparkles" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Add a Skill
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                List skills you can mentor others in, or target skills you are looking to learn.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-[#00D285]" />
            <span>Instant Portfolio Sync</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Skill Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <i className="fa-solid fa-graduation-cap absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="e.g. React.js, Python, UI/UX Design, Spanish..."
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-2 focus:ring-[#00D285]/20 focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Category / Type
            </label>
            <div className="relative">
              <select
                value={skillType}
                onChange={(e) => setSkillType(e.target.value as SkillType)}
                aria-label="Skill type"
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D285] focus:ring-2 focus:ring-[#00D285]/20 cursor-pointer appearance-none font-medium"
              >
                <option value="teach" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  I Can Teach (Offered)
                </option>
                <option value="learn" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  I Want to Learn (Goal)
                </option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Proficiency Level
            </label>
            <div className="relative">
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as ProficiencyLevel)}
                aria-label="Proficiency level"
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D285] focus:ring-2 focus:ring-[#00D285]/20 cursor-pointer appearance-none font-medium"
              >
                <option value="Beginner" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Beginner</option>
                <option value="Intermediate" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Intermediate</option>
                <option value="Advanced" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Advanced</option>
                <option value="Expert" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Expert</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={loading}
            className="w-full h-10 !bg-[#00D285] hover:!bg-[#00BA76] !text-white font-bold !rounded-xl transition-all duration-200 shadow-md shadow-[#00D285]/30 hover:shadow-lg hover:shadow-[#00D285]/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <i className="fa-solid fa-plus mr-2 text-xs" />
            Add Skill
          </Button>
        </form>
      </div>

      {/* Skills Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Offered Skills List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-[#00D285] flex items-center justify-center text-sm font-bold">
                <i className="fa-solid fa-chalkboard-user" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Skills You Teach
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Offered to peers for exchange</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00D285]/15 text-[#00D285] border border-[#00D285]/30">
              {offeredSkills.length} listed
            </span>
          </div>

          <div className="space-y-2.5">
            {offeredSkills.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 hover:border-[#00D285]/40 transition-all group"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-[#00D285]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{s.skill_name}</span>
                  <span className="text-[10px] font-extrabold text-[#00D285] bg-[#00D285]/10 px-2.5 py-0.5 rounded-full border border-[#00D285]/20">
                    {s.proficiency_level || 'Expert'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteSkill(s.id)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100"
                  title="Remove Skill"
                >
                  <i className="fa-solid fa-trash-can text-xs" />
                </button>
              </div>
            ))}
            {offeredSkills.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                <i className="fa-solid fa-graduation-cap text-2xl text-slate-300 dark:text-slate-700 mb-2 block" />
                No teaching skills listed yet. Add what you're great at above!
              </div>
            )}
          </div>
        </div>

        {/* Wanted Skills List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center text-sm font-bold">
                <i className="fa-solid fa-book-open-reader" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Skills You Want to Learn
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Goals you're actively exploring</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              {wantedSkills.length} goals
            </span>
          </div>

          <div className="space-y-2.5">
            {wantedSkills.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 transition-all group"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{s.skill_name}</span>
                  <span className="text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    Goal
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteSkill(s.id)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100"
                  title="Remove Skill"
                >
                  <i className="fa-solid fa-trash-can text-xs" />
                </button>
              </div>
            ))}
            {wantedSkills.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                <i className="fa-solid fa-bullseye text-2xl text-slate-300 dark:text-slate-700 mb-2 block" />
                No learning goals added yet. What new skill would you like to master?
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
