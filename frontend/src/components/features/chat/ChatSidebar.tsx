import React, { useState } from 'react';
import { ChatFriend } from '../../../types/chat';
import { Avatar } from '../../common/Avatar';

interface ChatSidebarProps {
  friends: ChatFriend[];
  activeFriendId: number | null;
  onSelectFriend: (friend: ChatFriend) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  friends,
  activeFriendId,
  onSelectFriend,
}) => {
  const [search, setSearch] = useState('');

  const filtered = friends.filter((f) =>
    f.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 shrink-0 border-r border-slate-200/80 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/40">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <i className="fa-solid fa-user-group text-[#00D285]" />
          <span>Exchange Partners</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00D285]/10 text-[#00D285] ml-auto">
            {friends.length}
          </span>
        </h3>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
          <input
            type="text"
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285] transition-all"
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
        {filtered.map((friend) => {
          const isActive = friend.id === activeFriendId;
          return (
            <button
              key={friend.id}
              onClick={() => onSelectFriend(friend)}
              className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#00D285]/10 dark:bg-[#00D285]/15 border-r-3 border-[#00D285]'
                  : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
              }`}
            >
              <Avatar name={friend.full_name} src={friend.profile_image} size="md" isOnline={friend.online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {friend.full_name}
                  </h4>
                  {friend.last_message_time && (
                    <span className="text-[10px] text-slate-400">{friend.last_message_time}</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {friend.last_message || 'Tap to message...'}
                </p>
              </div>
              {Boolean((friend.unread_count && friend.unread_count > 0) || (friend.unread && friend.unread > 0)) && (
                <span className="w-5 h-5 rounded-full bg-[#00D285] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm">
                  {friend.unread_count || friend.unread}
                </span>
              )}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 text-lg">
              <i className="fa-solid fa-handshake-simple" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No conversations found
            </p>
            <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto">
              Accept an exchange request or connect on the marketplace to start chatting!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
