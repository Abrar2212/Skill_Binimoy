import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Abrar Fahim',
      role: 'Computer Science Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      traded: 'Taught React 19, Learned Figma Design Systems',
      rating: 5,
      content:
        'Skill Binimoy solved my biggest problem: finding someone skilled to practice UI design with without paying thousands for bootcamps. Within 2 days I found a product designer to trade skills with!',
    },
    {
      name: 'Sadia Rahman',
      role: 'Content Specialist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      traded: 'Taught Copywriting, Learned Python Data Basics',
      rating: 5,
      content:
        'The peer accountability on this platform is unmatched. We met twice a week for live sessions and I successfully automated my weekly content scraping scripts with Python!',
    },
    {
      name: 'Mahmudul Hasan',
      role: 'Junior Mobile Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      traded: 'Taught Flutter, Learned Docker & Backend API',
      rating: 5,
      content:
        'Teaching Flutter actually deepened my own understanding while learning Docker containerization from a senior DevOps engineer. Pure win-win collaboration.',
    },
  ];

  return (
    <section className="py-20 bg-[#F8F9FA] dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#00D285]">
            Real Community Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            Loved by Learners & Builders
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            See how real peers are upgrading their careers together without spending money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-[#00D285]/50 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00D285]/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-[11px] text-[#00D285] font-semibold">{t.traded}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
