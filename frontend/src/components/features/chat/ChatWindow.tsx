import React, { useState, useRef, useEffect } from 'react';
import { ChatFriend, ChatMessage } from '../../../types/chat';
import { Avatar } from '../../common/Avatar';
import { MessageBubble } from './MessageBubble';
import { useAuth } from '../../../context/AuthContext';

interface ChatWindowProps {
  activeFriend: ChatFriend | null;
  messages: ChatMessage[];
  onSendMessage: (msg: string) => Promise<void>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  activeFriend,
  messages,
  onSendMessage,
}) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeFriend) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900/30">
        <div className="w-16 h-16 rounded-full bg-[#00D285]/10 text-[#00D285] flex items-center justify-center mb-4 text-2xl">
          <i className="fa-regular fa-comments" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Select a Conversation
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
          Choose a verified skill exchange partner from the left list to coordinate schedules and swap insights.
        </p>
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    const outgoing = text.trim();
    setText('');
    setSending(true);
    try {
      await onSendMessage(outgoing);
    } finally {
      setSending(false);
    }
  };

  const videoRoomUrl = `https://meet.jit.si/SkillBinimoy-Chat-${activeFriend.id}`;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900/30">
      {/* Active Header */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <Avatar
            name={activeFriend.full_name}
            src={activeFriend.profile_image}
            size="md"
            isOnline={activeFriend.online}
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {activeFriend.full_name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeFriend.online ? 'bg-[#00D285] animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {activeFriend.online ? 'Active Now' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Video Call Quick Action */}
        <div className="flex items-center gap-2">
          <a
            href={videoRoomUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D285]/10 hover:bg-[#00D285] text-[#00D285] hover:text-white text-xs font-bold transition-all duration-300 shadow-sm group"
            title="Start Instant 1-on-1 Video Room"
          >
            <i className="fa-solid fa-video text-xs group-hover:scale-110 transition-transform" />
            <span>Video Call</span>
          </a>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-5 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-lg">
              <i className="fa-regular fa-comment-dots" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No messages yet
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Say hi to {activeFriend.full_name} and start arranging your skill exchange session!
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isSelf = user?.id ? m.sender_id === user.id : m.sender_id === 1;
            return <MessageBubble key={m.id} message={m} isSelf={isSelf} />;
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-3.5 bg-slate-50/70 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message ${activeFriend.full_name}...`}
          className="flex-1 bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285] transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
          title="Send message"
        >
          {sending ? (
            <i className="fa-solid fa-spinner fa-spin text-xs" />
          ) : (
            <i className="fa-solid fa-paper-plane text-xs" />
          )}
        </button>
      </form>
    </div>
  );
};
