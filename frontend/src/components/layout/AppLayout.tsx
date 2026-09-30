import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Bot, X, Sparkles } from 'lucide-react';
import { AIChatbotDrawer } from '../features/chat/AIChatbotDrawer';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  variant?: 'default' | 'landing';
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showSidebar = false,
  variant = 'default',
}) => {
  const [isBotOpen, setIsBotOpen] = useState(() => {
    try {
      return sessionStorage.getItem('skillbinimoy_bot_open') === 'true';
    } catch {
      return false;
    }
  });

  const toggleBot = () => {
    setIsBotOpen((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem('skillbinimoy_bot_open', next ? 'true' : 'false');
      } catch {}
      return next;
    });
  };

  const closeBot = () => {
    setIsBotOpen(false);
    try {
      sessionStorage.setItem('skillbinimoy_bot_open', 'false');
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      <Navbar />

      {variant === 'landing' ? (
        <main className="flex-1 w-full min-w-0 overflow-x-hidden">
          {children}
        </main>
      ) : (
        <div className="flex-1 flex w-full max-w-7xl mx-auto">
          {showSidebar && <Sidebar />}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
            {children}
          </main>
        </div>
      )}

      <Footer />

      {/* Floating AI Chatbot Toggle */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={toggleBot}
          className="relative group w-14 h-14 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white shadow-xl shadow-[#00D285]/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer border-2 border-white/20"
          title="Skill Binimoy AI Advisor"
          aria-label="Skill Binimoy AI Assistant"
        >
          {isBotOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <i className="fa-solid fa-arrow-right-arrow-left text-base text-white" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-2 -right-2 animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* AI Chatbot Drawer Component */}
      <AIChatbotDrawer isOpen={isBotOpen} onClose={closeBot} />
    </div>
  );
};
