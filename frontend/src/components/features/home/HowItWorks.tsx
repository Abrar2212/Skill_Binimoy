import React from 'react';
import { UserCheck, Search, MessageSquareCode, Video } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'List Your Skills',
      description: 'Add skills you can teach (e.g. React, English, Graphic Design) and what you desire to learn.',
      icon: UserCheck,
      color: 'from-brand to-purple-600',
    },
    {
      step: '02',
      title: 'Discover Matches',
      description: 'Search the marketplace by skill categories, review peer profiles, ratings, and past feedback.',
      icon: Search,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      step: '03',
      title: 'Send Exchange Request',
      description: 'Propose a mutual skill trade. Agree on learning topics and timelines with simple 1-click approvals.',
      icon: MessageSquareCode,
      color: 'from-pink-500 to-rose-600',
    },
    {
      step: '04',
      title: 'Learn 1-on-1 Live',
      description: 'Join integrated video calls or exchange direct messages. Rate your partner upon completing sessions.',
      icon: Video,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F8F9FA] dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#00D285]">
            Effortless Knowledge Swap
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Skill <span className="text-[#00D285]">Binimoy</span> Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Exchanging skills is simple, structured, and free. Here is your 4-step path to peer growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-[#00D285]/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-sm hover:shadow-md"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-700 group-hover:text-[#00D285]/50 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#00D285] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
