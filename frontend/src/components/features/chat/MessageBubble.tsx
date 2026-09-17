import React from 'react';
import { ChatMessage } from '../../../types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
  isSelf: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSelf }) => {
  const formattedTime =
    message.timestamp ||
    (message.created_at
      ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '');

  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} mb-3`}>
      <div
        className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed transition-all shadow-sm ${
          isSelf
            ? 'bg-[#00D285] text-white rounded-br-xs font-medium'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-bl-xs font-medium'
        }`}
      >
        {message.message}
      </div>
      {formattedTime && (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
          {formattedTime}
        </span>
      )}
    </div>
  );
};
