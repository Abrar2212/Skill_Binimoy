import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { chatService, ChatBotAction } from '../../../services/chatService';
import { useAuth } from '../../../context/AuthContext';
import {
  Sparkles,
  ArrowRightLeft,
  User,
  Send,
  RotateCcw,
  X,
  ArrowRight,
  Video,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface AIChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  action?: ChatBotAction | null;
  timestamp: string;
}

const DEFAULT_WELCOME_MESSAGE: Message = {
  id: 'welcome-1',
  sender: 'bot',
  text: 'Hello! I am your Skill Binimoy AI Assistant. I can recommend trading partners, send exchange requests to peers directly to your Requests section, or set up 1-on-1 video sessions. How can I help you today?',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const AIChatbotDrawer: React.FC<AIChatbotDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const storageKey = `skillbinimoy_ai_chat_v3_${user?.id || 'guest'}`;

  // Load chat history from localStorage across page refreshes and navigation
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn('Failed to load chat history:', err);
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (err) {
      console.warn('Failed to save chat history:', err);
    }
  }, [messages, storageKey]);

  // Entrance animation
  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (isOpen) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'back.out(1.2)' }
        );
      }
    },
    { dependencies: [isOpen] }
  );

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Reset / Clear chat
  const handleClearChat = () => {
    if (window.confirm('Reset this conversation and start a new chat?')) {
      const fresh: Message[] = [
        {
          id: `welcome-${Date.now()}`,
          sender: 'bot',
          text: 'Chat history cleared. How can I assist you with your skills, trades, or video sessions today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setMessages(fresh);
      try {
        localStorage.setItem(storageKey, JSON.stringify(fresh));
      } catch {}
    }
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userText = textToSend.trim();
    setInput('');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await chatService.chatWithBot(userText, historyPayload);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.reply,
        action: res.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Sorry, I ran into an issue connecting to the skill advisor. Please try again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-w-[460px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden h-[560px] transition-colors"
    >
      {/* Header */}
      <div className="px-5 py-4 bg-slate-50/90 dark:bg-slate-850/90 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Skill Binimoy Brand Logo Emblem */}
          <div className="relative w-10 h-10 rounded-full bg-[#00D285] flex items-center justify-center text-white shadow-md shadow-[#00D285]/25 shrink-0">
            <ArrowRightLeft className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-emerald-400 flex items-center justify-center text-amber-300">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
          </div>

          <div>
            <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white flex items-center">
              <span>Skill Binimoy AI</span>
              <span className="text-[#00D285]">.</span>
            </h4>
            <span className="text-[11px] text-emerald-600 dark:text-[#00D285] flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D285] animate-pulse" />
              Live Barter Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearChat}
            title="Reset conversation"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close chatbot"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatars */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs shadow-xs ${
                m.sender === 'user'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  : 'bg-[#00D285] text-white'
              }`}
            >
              {m.sender === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <ArrowRightLeft className="w-3.5 h-3.5" />
              )}
            </div>

            <div className="max-w-[85%] space-y-2">
              <div
                className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap break-words ${
                  m.sender === 'user'
                    ? 'bg-[#00D285] text-white rounded-tr-xs font-medium shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-xs shadow-xs'
                }`}
              >
                {m.text}
              </div>

              {/* ACTION CARD: Request Sent */}
              {m.action?.type === 'request_sent' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 text-xs space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#00D285]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {m.action.data?.alreadyPending ? 'Exchange Request Pending' : 'Exchange Request Sent!'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                    Partner: <span className="font-bold text-slate-900 dark:text-white">{m.action.data?.partnerName}</span>
                    <br />
                    Trade: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{m.action.data?.offeredSkill}</span> ↔{' '}
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">{m.action.data?.requestedSkill}</span>
                  </p>
                  <Link
                    to="/requests"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-[11px] shadow-xs transition-transform active:scale-95"
                  >
                    <span>View in Requests Section</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* ACTION CARD: Session Scheduled */}
              {m.action?.type === 'session_created' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#00D285]">
                    <Video className="w-4 h-4" />
                    <span>1-on-1 Video Session Booked!</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                    Partner: <span className="font-bold text-slate-900 dark:text-white">{m.action.data?.partnerName}</span>
                    <br />
                    Topic: <span className="font-semibold text-[#00D285]">{m.action.data?.topic || 'Skill Barter'}</span>
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {m.action.data?.meetingLink && (
                      <a
                        href={m.action.data.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-[11px] shadow-xs transition-transform active:scale-95"
                      >
                        <Video className="w-3 h-3" />
                        <span>Join Video Room</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    <Link
                      to="/sessions"
                      onClick={onClose}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:border-[#00D285]"
                    >
                      <Calendar className="w-3 h-3 text-[#00D285]" />
                      <span>Sessions Tab</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* ACTION CARD: Instant Call Ready */}
              {m.action?.type === 'join_call' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-[#00D285]">
                    <Video className="w-4 h-4" />
                    <span>Instant Video Call Ready</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Connect immediately with <span className="font-bold text-slate-900 dark:text-white">{m.action.data?.partnerName}</span> via Jitsi Meet.
                  </p>
                  {m.action.data?.meetingLink && (
                    <a
                      href={m.action.data.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-[11px] shadow-xs transition-transform active:scale-95"
                    >
                      <Video className="w-3 h-3" />
                      <span>Join Call Room Now</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              )}

              {/* ACTION CARD: Suggest Barter Button */}
              {m.action?.type === 'suggest_barter' && m.action.data?.partnerName && (
                <div className="pt-1">
                  <button
                    onClick={() =>
                      sendMessage(
                        `Send exchange request to ${m.action?.data?.partnerName} offering ${m.action?.data?.offeredSkill} for ${m.action?.data?.requestedSkill}`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-[11px] shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Send Exchange Request to {m.action.data.partnerName}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              <span className="block text-[10px] text-slate-400 px-1">
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic py-1 px-1">
            <i className="fa-solid fa-spinner fa-spin text-[#00D285]" />
            Checking platform database...
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Unified Bottom Section: Quick Chips + Input Pill (Seamless, No Scrollbars) */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        {/* Quick Suggestion Chips */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar pb-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            type="button"
            onClick={() => sendMessage('Who is the best trader/exchange partner for me based on my profile?')}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-[#00D285] dark:hover:text-[#00D285] border border-transparent hover:border-[#00D285]/30 shrink-0 transition-colors font-medium text-[11px] cursor-pointer"
          >
            🤝 Best Trader for Me
          </button>
          <button
            type="button"
            onClick={() => sendMessage('Send exchange request to my top recommended match')}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-[#00D285] dark:hover:text-[#00D285] border border-transparent hover:border-[#00D285]/30 shrink-0 transition-colors font-medium text-[11px] cursor-pointer"
          >
            ⚡ Send Barter Request
          </button>
          <button
            type="button"
            onClick={() => sendMessage('Schedule a 1-on-1 video session with my partner')}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-[#00D285] dark:hover:text-[#00D285] border border-transparent hover:border-[#00D285]/30 shrink-0 transition-colors font-medium text-[11px] cursor-pointer"
          >
            🎥 Video Session
          </button>
          <button
            type="button"
            onClick={() => sendMessage('What is the best skill for me to learn next?')}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-[#00D285] dark:hover:text-[#00D285] border border-transparent hover:border-[#00D285]/30 shrink-0 transition-colors font-medium text-[11px] cursor-pointer"
          >
            🎯 Best Skill to Learn
          </button>
        </div>

        {/* Input Pill with Embedded Send Button */}
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI or say 'Send request to Nusrat'..."
            className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 rounded-full pl-4 pr-11 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-2 focus:ring-[#00D285]/20 transition-all shadow-2xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-1.5 w-8 h-8 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white flex items-center justify-center shrink-0 shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:hover:bg-[#00D285] cursor-pointer"
            title="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
