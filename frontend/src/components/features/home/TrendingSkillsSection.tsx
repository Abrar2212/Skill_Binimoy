import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, ArrowUpRight, BookOpen } from 'lucide-react';
import { TrendingSkill } from '../../../types/skill';
import { userService } from '../../../services/userService';

export const TrendingSkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<TrendingSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getTrendingSkills()
      .then((data) => setSkills(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#00D285] mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>High Demand Topics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular Skills Exchanged
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Connect with peers who are ready to teach and learn these in-demand skills today.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00D285] hover:text-[#00ba76] transition-colors"
          >
            <span>View all skills</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((skill, idx) => (
            <Link
              key={idx}
              to={`/marketplace?search=${encodeURIComponent(skill.skill_name || skill.name || '')}`}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-[#00D285]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md group shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[#00D285] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                  Trending Skill
                </span>
                <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#00D285] transition-colors" />
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 group-hover:text-[#00D285] transition-colors">
                {skill.skill_name}
              </h4>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {skill.learn_count} Learners
                </span>
                <span className="text-[#00D285] font-semibold">
                  {skill.teach_count} Mentors
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
