import React, { useState } from 'react';
import { Session } from '../../../types/session';
import { Avatar } from '../../common/Avatar';
import { useAuth } from '../../../context/AuthContext';
import { LeaveReviewModal } from './LeaveReviewModal';

interface SessionCardProps {
  session: Session;
  onSessionUpdated?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onSessionUpdated }) => {
  const { user } = useAuth();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const isCompleted = session.status?.toLowerCase() === 'completed';
  const partnerName = session.partner_name || session.receiver_name || session.sender_name || 'Exchange Partner';
  const skillName = session.offered_skill || session.requested_skill || session.skill_name || 'Skill Exchange';
  const scheduledTime = session.scheduled_at || (session as any).scheduled_time || new Date().toISOString();

  // Determine partner ID
  const partnerId =
    session.sender_id === user?.id
      ? session.receiver_id || 2
      : session.sender_id || session.receiver_id || 2;

  const meetingLink = session.meeting_link || `https://meet.jit.si/SkillBinimoy-${session.id || 'Room'}`;

  return (
    <div className="session-card-item bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-[#00D285]/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={partnerName} src={session.partner_image} size="md" isOnline={!isCompleted} />
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{partnerName}</h4>
              <p className="text-xs text-[#00D285] font-bold">{skillName}</p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00D285] border border-emerald-200 dark:border-emerald-800/40'
                : 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40'
            }`}
          >
            {session.status}
          </span>
        </div>

        {/* Timing Information */}
        <div className="space-y-2 py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 mb-4 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-calendar text-[#00D285]" />
            <span>{new Date(scheduledTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-clock text-cyan-500" />
            <span>
              {new Date(scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duration_minutes || 60} mins)
            </span>
          </div>
        </div>

        {session.notes && (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-4">
            Notes: "{session.notes}"
          </p>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        {!isCompleted ? (
          <a
            href={meetingLink}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 rounded-2xl bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-xs shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <i className="fa-solid fa-video text-xs" />
            <span>Enter Video Room</span>
          </a>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1.5 py-1 text-xs text-[#00D285] font-bold">
              <i className="fa-solid fa-circle-check text-sm" />
              <span>Completed Session</span>
            </div>
            <button
              type="button"
              onClick={() => setIsReviewOpen(true)}
              className="w-full py-2.5 px-4 rounded-2xl border border-amber-300 dark:border-amber-700/60 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-star text-amber-400 text-xs" />
              <span>Rate & Review Partner</span>
            </button>
            <LeaveReviewModal
              isOpen={isReviewOpen}
              onClose={() => setIsReviewOpen(false)}
              partnerId={partnerId}
              partnerName={partnerName}
              skillExchanged={skillName}
              onReviewSubmitted={onSessionUpdated}
            />
          </div>
        )}
      </div>
    </div>
  );
};
