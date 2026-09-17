import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', iconClass: 'fa-solid fa-house' },
    { name: 'Dashboard', path: '/dashboard', iconClass: 'fa-solid fa-gauge-high', authOnly: true },
    { name: 'Marketplace', path: '/marketplace', iconClass: 'fa-solid fa-store' },
    { name: 'Requests', path: '/requests', iconClass: 'fa-solid fa-handshake', authOnly: true },
    { name: 'Sessions', path: '/sessions', iconClass: 'fa-solid fa-video', authOnly: true },
    { name: 'Chat', path: '/chat', iconClass: 'fa-solid fa-comments', authOnly: true },
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-[#00D285] flex items-center justify-center shadow-md shadow-[#00D285]/25 group-hover:scale-105 transition-transform duration-200 text-white">
              <i className="fa-solid fa-arrow-right-arrow-left text-sm" />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Skill Binimoy<span className="text-[#00D285]">.</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Animated Underline Effect */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
            {navLinks.map((link) => {
              if (link.authOnly && !isAuthenticated) return null;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-2 px-2 text-sm font-semibold transition-colors duration-200 group flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#00D285]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <i className={`${link.iconClass} text-xs transition-transform duration-200 group-hover:-translate-y-0.5`} />
                  <span>{link.name}</span>
                  {/* Underline Indicator Effect */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2.5px] bg-[#00D285] rounded-full transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls: Theme Toggle & Profile Icon */}
          <div className="hidden md:flex items-center space-x-3.5">
            {/* Font Awesome Theme Toggle Icon */}
            <ThemeToggle />

            {/* Profile Icon / Authenticated User Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/80 focus:outline-none"
                  aria-expanded={userDropdownOpen}
                >
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00D285]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-[#00D285] flex items-center justify-center text-sm ring-2 ring-[#00D285]/40">
                      <i className="fa-solid fa-user" />
                    </div>
                  )}
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate hidden sm:inline">
                    {user.full_name?.split(' ')[0] || 'Profile'}
                  </span>
                  <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 dark:text-slate-500 transition-transform duration-200 mr-1 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu with Font Awesome Theme */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <i className="fa-solid fa-gauge text-[#00D285] w-4" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <i className="fa-solid fa-circle-user text-cyan-500 w-4" />
                      <span>My Profile</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left font-medium"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket text-red-500 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Profile / Log In icon link */}
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#00D285] dark:hover:text-[#00D285] px-2.5 py-1.5 transition-colors group"
                  title="Profile Login"
                >
                  <i className="fa-regular fa-circle-user text-lg text-slate-500 group-hover:text-[#00D285] transition-colors" />
                  <span>Log In</span>
                </Link>

                {/* Join Now Pill Button */}
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 dark:hover:bg-white dark:hover:text-slate-900 transition-all duration-200 shadow-sm flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-user-plus text-xs" />
                  <span>Join Now</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <i className="fa-solid fa-xmark text-xl" />
              ) : (
                <i className="fa-solid fa-bars text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => {
            if (link.authOnly && !isAuthenticated) return null;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00D285] font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <i className={`${link.iconClass} text-[#00D285] w-5`} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <i className="fa-solid fa-gauge text-[#00D285] w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <i className="fa-solid fa-circle-user text-cyan-500 w-5" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-left"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket text-red-500 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <i className="fa-regular fa-circle-user" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-sm shadow-md shadow-[#00D285]/20"
                >
                  <i className="fa-solid fa-user-plus text-xs" />
                  <span>Join Now</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
