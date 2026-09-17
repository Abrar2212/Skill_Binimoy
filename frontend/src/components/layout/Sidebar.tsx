import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Inbox, 
  Calendar, 
  MessageSquare, 
  User, 
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', path: '/marketplace', icon: Layers },
    { name: 'Requests', path: '/requests', icon: Inbox },
    { name: 'Sessions', path: '/sessions', icon: Calendar },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 bg-slate-950/40">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand/15 text-brand-400 border border-brand/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Pro tip card in sidebar */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-brand/15 to-cyan-500/10 border border-brand/20">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Skill Pro-Tip</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Keep your offered skills updated to receive more exchange invitations from the community!
        </p>
      </div>
    </aside>
  );
};
