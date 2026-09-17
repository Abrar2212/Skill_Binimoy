import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ChatSidebar } from '../components/features/chat/ChatSidebar';
import { ChatWindow } from '../components/features/chat/ChatWindow';
import { chatService } from '../services/chatService';
import { ChatFriend, ChatMessage } from '../types/chat';

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const [friends, setFriends] = useState<ChatFriend[]>([]);
  const [activeFriend, setActiveFriend] = useState<ChatFriend | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch exchange partners
  useEffect(() => {
    chatService
      .getFriends()
      .then((data) => {
        setFriends(data);
        if (data.length > 0) {
          if (targetUserId) {
            const matched = data.find((f) => f.id === parseInt(targetUserId));
            setActiveFriend(matched || data[0]);
          } else {
            setActiveFriend(data[0]);
          }
        }
      })
      .catch((err) => console.error('Failed to load chat friends:', err))
      .finally(() => setLoading(false));
  }, [targetUserId]);

  // Fetch messages when active friend changes
  useEffect(() => {
    if (activeFriend) {
      chatService
        .getMessages(activeFriend.id)
        .then((msgs) => setMessages(msgs))
        .catch((err) => console.error('Failed to load messages:', err));
    }
  }, [activeFriend]);

  // Optional background polling to sync new messages
  useEffect(() => {
    if (!activeFriend) return;
    const interval = setInterval(() => {
      chatService
        .getMessages(activeFriend.id)
        .then((msgs) => {
          setMessages((prev) => {
            if (msgs.length !== prev.length) return msgs;
            return prev;
          });
        })
        .catch(() => {});
    }, 4000);

    return () => clearInterval(interval);
  }, [activeFriend]);

  const handleSendMessage = async (msgText: string) => {
    if (!activeFriend) return;
    try {
      const newMsg = await chatService.sendMessage(activeFriend.id, msgText);
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <AppLayout showSidebar={false} variant="landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D285]/10 text-[#00D285] text-xs font-bold uppercase tracking-wider mb-2">
            <i className="fa-solid fa-comments" /> Direct Messaging
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Messages & Exchange Chat
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Coordinate your learning schedules, ask questions, and chat in real-time with verified peers.
          </p>
        </div>

        {/* Chat Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden h-[680px] max-h-[82vh] flex flex-col md:flex-row transition-colors">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center p-8 space-y-3 flex-col">
              <div className="w-10 h-10 rounded-full border-3 border-[#00D285] border-t-transparent animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Connecting to conversations...</p>
            </div>
          ) : (
            <>
              <ChatSidebar
                friends={friends}
                activeFriendId={activeFriend?.id || null}
                onSelectFriend={(f) => setActiveFriend(f)}
              />

              <ChatWindow
                activeFriend={activeFriend}
                messages={messages}
                onSendMessage={handleSendMessage}
              />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
