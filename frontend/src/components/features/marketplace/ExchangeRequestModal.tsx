import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Avatar } from '../../common/Avatar';
import { MarketplaceUser } from '../../../types/skill';
import { exchangeService } from '../../../services/exchangeService';
import { userService } from '../../../services/userService';
import { useAuth } from '../../../context/AuthContext';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ExchangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: MarketplaceUser | null;
  onSuccess?: () => void;
}

export const ExchangeRequestModal: React.FC<ExchangeRequestModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [myTeachSkills, setMyTeachSkills] = useState<string[]>([]);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  // Load current user's taught skills from database
  useEffect(() => {
    if (isOpen) {
      setError('');
      userService
        .getProfile()
        .then((data) => {
          const teach = (data.user?.skills_teach || []).map((s) => s.skill_name);
          setMyTeachSkills(teach);
          if (teach.length > 0 && !offeredSkill) {
            setOfferedSkill(teach[0]);
          }
        })
        .catch((err) => console.error('Failed to load user skills:', err));
    }
  }, [isOpen]);

  // Set default requested skill when targetUser opens
  useEffect(() => {
    if (targetUser && targetUser.skills_teach && targetUser.skills_teach.length > 0) {
      setRequestedSkill(targetUser.skills_teach[0]);
    } else {
      setRequestedSkill('');
    }
  }, [targetUser]);

  if (!targetUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !offeredSkill.trim() || !requestedSkill.trim()) {
      setError('Please provide the offered skill, requested skill, and an introduction message.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await exchangeService.sendRequest({
        receiver_id: targetUser.id,
        offered_skill: offeredSkill.trim(),
        requested_skill: requestedSkill.trim(),
        message: message.trim(),
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setMessage('');
        onClose();
        if (onSuccess) onSuccess();
      }, 1600);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to send proposal. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Propose Skill Exchange"
      description={`Exchange skills directly with ${targetUser.full_name}`}
      maxWidth="md"
    >
      {sentSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white">Proposal Sent!</h4>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            {targetUser.full_name} has received your exchange proposal. You can track progress in your Requests tab.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target User Info */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <Avatar name={targetUser.full_name} src={targetUser.profile_image} size="md" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{targetUser.full_name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {targetUser.bio || 'Skill Binimoy Peer Mentor'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-amber-500">★ {targetUser.rating || 5.0}</span>
              <p className="text-[10px] text-slate-400">{targetUser.review_count || 0} reviews</p>
            </div>
          </div>

          {/* Skill Selections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Offered Skill */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                What will you teach?
              </label>
              <input
                type="text"
                placeholder="e.g. React 19, TypeScript"
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285]"
                required
              />
              {myTeachSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {myTeachSkills.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => setOfferedSkill(sk)}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full transition-colors ${
                        offeredSkill === sk
                          ? 'bg-[#00D285] text-white font-semibold shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Requested Skill */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                What do you want to learn?
              </label>
              <input
                type="text"
                placeholder="e.g. Figma UI, Python ML"
                value={requestedSkill}
                onChange={(e) => setRequestedSkill(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285]"
                required
              />
              {targetUser.skills_teach && targetUser.skills_teach.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {targetUser.skills_teach.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => setRequestedSkill(sk)}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full transition-colors ${
                        requestedSkill === sk
                          ? 'bg-cyan-500 text-white font-semibold shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Proposal Message */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Personalized Introduction & Goals
            </label>
            <textarea
              rows={3}
              placeholder={`Hi ${targetUser.full_name.split(' ')[0]}! I'd love to exchange skills. I can help you with ${offeredSkill || 'my skills'}, and would like to learn ${requestedSkill || 'from you'}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] resize-none"
              required
            />
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-xs shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Sending...' : 'Send Request'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
