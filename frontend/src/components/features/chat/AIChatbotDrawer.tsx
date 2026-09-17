import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { chatService } from '../../../services/chatService';

interface AIChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export const AIChatbotDrawer: React.FC<AIChatbotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your Skill Binimoy AI Advisor. Need guidance on what skill to learn next or how to find the best peer exchange partner?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (isOpen) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.2)' }
        );
      }
    },
    { dependencies: [isOpen] }
  );

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const reply = await chatService.chatWithBot(userText);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I ran into an issue answering that. Please try again!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-24 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden h-[540px] transition-colors"
    >
      {/* Drawer Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#00D285] flex items-center justify-center text-white shadow-md shadow-[#00D285]/20 text-sm">
            <i className="fa-solid fa-robot" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Skill Advisor AI</span>
              <i className="fa-solid fa-wand-magic-sparkles text-[#00D285] text-xs" />
            </h4>
            <span className="text-[11px] text-[#00D285] flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D285] animate-pulse" />
              Online Assistant
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-sm" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                m.sender === 'user'
                  ? 'bg-[#00D285]/20 text-[#00D285]'
                  : 'bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400'
              }`}
            >
              {m.sender === 'user' ? (
                <i className="fa-solid fa-user" />
              ) : (
                <i className="fa-solid fa-robot" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#00D285] text-white rounded-tr-none font-medium'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <i className="fa-solid fa-spinner fa-spin text-[#00D285]" />
            Thinking...
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <button
          onClick={() => setInput('What are the top skills to trade in 2026?')}
          className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shrink-0 border border-slate-200 dark:border-slate-700/80 transition-colors shadow-2xs cursor-pointer"
        >
          💡 Top Skills
        </button>
        <button
          onClick={() => setInput('How to exchange skills safely?')}
          className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shrink-0 border border-slate-200 dark:border-slate-700/80 transition-colors shadow-2xs cursor-pointer"
        >
          🛡️ Safe Exchange
        </button>
        <button
          onClick={() => setInput('Suggest a roadmap for React & TypeScript')}
          className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shrink-0 border border-slate-200 dark:border-slate-700/80 transition-colors shadow-2xs cursor-pointer"
        >
          ⚛️ React Roadmap
        </button>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white dark:bg-slate-800/90 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI anything about skills..."
          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-8 h-8 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white flex items-center justify-center shrink-0 shadow-sm disabled:opacity-40 transition-all cursor-pointer"
        >
          <i className="fa-solid fa-paper-plane text-[10px]" />
        </button>
      </form>
    </div>
  );
};
