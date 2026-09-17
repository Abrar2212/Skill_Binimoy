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
  const [isBotOpen, setIsBotOpen] = useState(false);

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
          onClick={() => setIsBotOpen(!isBotOpen)}
          className="relative group p-4 rounded-2xl bg-gradient-to-r from-brand to-cyan-500 text-white shadow-xl shadow-brand/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none flex items-center justify-center"
          title="Skill Binimoy AI Advisor"
        >
          {isBotOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
          </span>
        </button>
      </div>

      {/* AI Chatbot Drawer Component */}
      <AIChatbotDrawer isOpen={isBotOpen} onClose={() => setIsBotOpen(false)} />
    </div>
  );
};
