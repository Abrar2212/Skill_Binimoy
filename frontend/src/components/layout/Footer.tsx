import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Globe, Share2, Code2, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 backdrop-blur-md pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#00D285] flex items-center justify-center shadow-md shadow-[#00D285]/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Skill Binimoy<span className="text-[#00D285]">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              Teach what you know, learn what you need. Empowering peers to swap knowledge and build meaningful professional relationships without money barriers.
            </p>
            <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-[#00D285] transition-colors shadow-sm">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-[#00D285] transition-colors shadow-sm">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-[#00D285] transition-colors shadow-sm">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/marketplace" className="hover:text-[#00D285] transition-colors">Skill Marketplace</Link></li>
              <li><Link to="/requests" className="hover:text-[#00D285] transition-colors">Exchange Requests</Link></li>
              <li><Link to="/sessions" className="hover:text-[#00D285] transition-colors">Learning Sessions</Link></li>
              <li><Link to="/chat" className="hover:text-[#00D285] transition-colors">Direct Messaging</Link></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Stay Updated</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Get trending skill exchanges & community updates directly in your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@gmail.com"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285]"
              />
              <button className="px-3.5 py-2 bg-[#00D285] hover:bg-[#00ba76] text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Skill Binimoy. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for community learning
          </p>
        </div>
      </div>
    </footer>
  );
};
