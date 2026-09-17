import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../common/Button';

export const CTASection: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-slate-900 text-white border border-slate-800 shadow-xl overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Background Decorative Emerald Glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#00D285]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-[#00D285]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-[#00D285] border border-emerald-500/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready to start exchanging?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Unlock Your Potential with Skill Binimoy Today
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Create your profile in 60 seconds, list what you love doing, and connect with people eager to teach you the skills you need.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto relative z-10">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-base shadow-lg shadow-[#00D285]/35 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              <span>Join Community</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
