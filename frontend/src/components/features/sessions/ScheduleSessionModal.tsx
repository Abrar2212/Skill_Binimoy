import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { exchangeService } from '../../../services/exchangeService';
import { ExchangeRequest } from '../../../types/request';

interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated?: () => void;
}

export const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({
  isOpen,
  onClose,
  onSessionCreated,
}) => {
  const [partnerName, setPartnerName] = useState('');
  const [skillName, setSkillName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedRequests, setAcceptedRequests] = useState<ExchangeRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      exchangeService
        .getRequests()
        .then((reqs) => {
          const accepted = reqs.filter((r) => r.status?.toLowerCase() === 'accepted');
          setAcceptedRequests(accepted);
          if (accepted.length > 0) {
            setSelectedRequestId(accepted[0].id);
            setPartnerName(accepted[0].partner_name || accepted[0].sender_name || accepted[0].receiver_name || '');
            setSkillName(accepted[0].offered_skill || accepted[0].requested_skill || '');
          }
        })
        .catch((err) => console.error('Failed to load accepted requests:', err));
    }
  }, [isOpen]);

  const handleRequestChange = (reqIdStr: string) => {
    const id = parseInt(reqIdStr);
    setSelectedRequestId(id);
    const req = acceptedRequests.find((r) => r.id === id);
    if (req) {
      setPartnerName(req.partner_name || req.sender_name || req.receiver_name || '');
      setSkillName(req.offered_skill || req.requested_skill || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !skillName || !dateTime) return;

    setLoading(true);
    try {
      const roomSlug = `SkillBinimoy-${encodeURIComponent(skillName.replace(/\s+/g, '-'))}-${Date.now()}`;
      await exchangeService.createSession({
        request_id: selectedRequestId || 1,
        scheduled_at: new Date(dateTime).toISOString(),
        duration_minutes: parseInt(duration),
        meeting_link: `https://meet.jit.si/${roomSlug}`,
      });
      onClose();
      if (onSessionCreated) onSessionCreated();
    } catch (err) {
      console.error('Failed to schedule session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book a 1-on-1 Learning Session"
      description="Schedule a video call with your exchange partner"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Accepted Request Selector (if available) */}
        {acceptedRequests.length > 0 && (
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              <i className="fa-solid fa-handshake text-[#00D285] mr-1.5" />
              Select Accepted Exchange
            </label>
            <select
              value={selectedRequestId || ''}
              onChange={(e) => handleRequestChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285] cursor-pointer"
            >
              {acceptedRequests.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.partner_name || req.sender_name || req.receiver_name || `Exchange #${req.id}`} ({req.offered_skill} ↔ {req.requested_skill})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            <i className="fa-solid fa-user text-slate-400 mr-1.5" />
            Exchange Partner Name
          </label>
          <input
            type="text"
            placeholder="e.g. Rakib Hasan, Nusrat Jahan"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285]"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            <i className="fa-solid fa-bolt text-[#00D285] mr-1.5" />
            Topic / Skill Focus
          </label>
          <input
            type="text"
            placeholder="e.g. PyTorch Deep Learning, UI/UX in Figma"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285]"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              <i className="fa-regular fa-calendar text-[#00D285] mr-1.5" />
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              <i className="fa-regular fa-clock text-cyan-500 mr-1.5" />
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285] cursor-pointer"
            >
              <option value="30">30 Minutes</option>
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes (Standard)</option>
              <option value="90">90 Minutes</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            <i className="fa-regular fa-note-sticky text-slate-400 mr-1.5" />
            Session Agenda / Notes (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Outline specific objectives or questions for this exchange..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285] resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all duration-300 flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin text-xs" />
            ) : (
              <i className="fa-solid fa-video text-xs" />
            )}
            <span>{loading ? 'Scheduling...' : 'Schedule Session'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
