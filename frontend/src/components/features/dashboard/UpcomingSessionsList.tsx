import React from 'react';
import { Link } from 'react-router-dom';
import { Session } from '../../../types/session';
import { Avatar } from '../../common/Avatar';

interface UpcomingSessionsListProps {
  sessions: Session[];
}

export const UpcomingSessionsList: React.FC<UpcomingSessionsListProps> = ({ sessions }) => {
  const upcoming = sessions.filter(
    (s) => s.status?.toLowerCase() === 'upcoming' || s.status?.toLowerCase() === 'scheduled'
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00D285]/10 text-[#00D285] flex items-center justify-center text-sm">
            <i className="fa-regular fa-calendar-check" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Upcoming Learning Sessions
          </h3>
        </div>
        <Link
          to="/sessions"
          className="text-xs font-bold text-[#00D285] hover:text-[#00ba76] transition-colors flex items-center gap-1.5"
        >
          <span>View All</span>
          <i className="fa-solid fa-arrow-right text-[10px]" />
        </Link>
      </div>

      <div className="space-y-3">
        {upcoming.slice(0, 3).map((session) => {
          const partnerName =
            session.partner_name || session.receiver_name || session.sender_name || 'Partner';
          const skillName =
            session.offered_skill || session.requested_skill || session.skill_name || 'Skill Exchange';
          const scheduledTime =
            session.scheduled_at || (session as any).scheduled_time || new Date().toISOString();
          const meetingLink =
            session.meeting_link || `https://meet.jit.si/SkillBinimoy-${session.id || 'Room'}`;

          return (
            <div
              key={session.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:border-[#00D285]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <Avatar name={partnerName} src={session.partner_image} size="md" isOnline={true} />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {partnerName}
                  </h4>
                  <p className="text-xs text-[#00D285] font-semibold">{skillName}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <i className="fa-regular fa-clock text-xs text-cyan-500" />
                      {new Date(scheduledTime).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>• {session.duration_minutes || 60} mins</span>
                  </div>
                </div>
              </div>

              <a
                href={meetingLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all active:scale-95"
              >
                <i className="fa-solid fa-video text-xs" />
                <span>Join Room</span>
              </a>
            </div>
          );
        })}

        {upcoming.length === 0 && (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs space-y-1">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400">
              <i className="fa-regular fa-calendar-plus" />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              No upcoming sessions scheduled yet
            </p>
            <p className="text-[11px]">
              Explore the Marketplace to propose a skill exchange and set up a call!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
