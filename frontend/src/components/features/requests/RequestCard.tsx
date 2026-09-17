import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { ExchangeRequest } from '../../../types/request';
import { Avatar } from '../../common/Avatar';

interface RequestCardProps {
  request: ExchangeRequest;
  isIncoming: boolean;
  onStatusUpdate: (id: number, status: 'accepted' | 'rejected' | 'cancelled') => Promise<void>;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  isIncoming,
  onStatusUpdate,
}) => {
  const [loading, setLoading] = useState(false);

  const partnerName =
    request.partner_name ||
    (isIncoming ? request.sender_name : request.receiver_name) ||
    'Community Peer';

  const partnerImage =
    request.partner_image ||
    (isIncoming ? request.sender_image : request.receiver_image);

  const handleAction = async (status: 'accepted' | 'rejected' | 'cancelled') => {
    setLoading(true);
    try {
      await onStatusUpdate(request.id, status);
      if (status === 'accepted') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const rawStatus = request.status || 'Pending';
  const statusKey = (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase()) as
    | 'Pending'
    | 'Accepted'
    | 'Rejected'
    | 'Cancelled';

  const statusBadges = {
    Pending: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40',
    Accepted: 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00D285] border border-emerald-200 dark:border-emerald-800/40',
    Rejected: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40',
    Cancelled: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
  }[statusKey] || 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-[#00D285]/50 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Avatar name={partnerName} src={partnerImage} size="md" />
          <div>
            <div className="flex items-center gap-2.5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{partnerName}</h4>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${statusBadges}`}
              >
                {rawStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <i className="fa-regular fa-clock text-[11px]" />
              <span>
                {request.created_at
                  ? new Date(request.created_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Recently'}
              </span>
            </p>
          </div>
        </div>

        {/* Skill Exchange Summary Bar */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
          <span className="text-[#00D285]">
            {request.offered_skill} <span className="text-slate-400 font-normal">(Offered)</span>
          </span>
          <i className="fa-solid fa-arrow-right-arrow-left text-slate-400 text-xs" />
          <span className="text-cyan-600 dark:text-cyan-400">
            {request.requested_skill} <span className="text-slate-400 font-normal">(Wanted)</span>
          </span>
        </div>
      </div>

      {/* Message Text */}
      {request.message && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 mb-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
          "{request.message}"
        </div>
      )}

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {isIncoming ? 'Received from community peer' : 'Sent by you'}
        </span>

        {/* Incoming Pending: Accept / Decline */}
        {isIncoming && statusKey === 'Pending' && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleAction('rejected')}
              disabled={loading}
              className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-rose-400 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <i className="fa-solid fa-xmark text-xs" />
              <span>Decline</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction('accepted')}
              disabled={loading}
              className="px-5 py-2 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <i className="fa-solid fa-check text-xs" />
              <span>Accept Proposal</span>
            </button>
          </div>
        )}

        {/* Outgoing Pending: Cancel */}
        {!isIncoming && statusKey === 'Pending' && (
          <button
            type="button"
            onClick={() => handleAction('cancelled')}
            disabled={loading}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <i className="fa-solid fa-trash-can text-xs" />
            <span>Cancel Proposal</span>
          </button>
        )}

        {/* Accepted: Chat or Schedule Session */}
        {statusKey === 'Accepted' && (
          <div className="flex items-center gap-2.5">
            <Link
              to="/chat"
              className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#00D285] text-slate-700 dark:text-slate-300 hover:text-[#00D285] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <i className="fa-solid fa-comments text-xs" />
              <span>Message</span>
            </Link>
            <Link
              to="/sessions"
              className="px-4 py-2 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-video text-xs" />
              <span>Schedule Call</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
