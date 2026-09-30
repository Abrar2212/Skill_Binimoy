import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { userService } from '../../../services/userService';
import { TradePost } from '../../../types/skill';
import { Sparkles, PlusCircle, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface CreateTradePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPost: TradePost) => void;
}

export const CreateTradePostModal: React.FC<CreateTradePostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState('Flexible schedule');
  const [myTeachSkills, setMyTeachSkills] = useState<string[]>([]);
  const [myLearnSkills, setMyLearnSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess(false);
      userService
        .getProfile()
        .then((data) => {
          const teach = (data.user?.skills_teach || []).map((s) => s.skill_name);
          const learn = (data.user?.skills_learn || []).map((s) => s.skill_name);
          setMyTeachSkills(teach);
          setMyLearnSkills(learn);

          if (teach.length > 0 && !offeredSkill) setOfferedSkill(teach[0]);
          if (learn.length > 0 && !requestedSkill) setRequestedSkill(learn[0]);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !offeredSkill.trim() || !requestedSkill.trim()) {
      setError('Please provide a title, offered skill, and requested skill.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await userService.createTradePost({
        title: title.trim(),
        offered_skill: offeredSkill.trim(),
        requested_skill: requestedSkill.trim(),
        description: description.trim(),
        availability: availability.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess(res.post);
        onClose();
        setTitle('');
        setDescription('');
      }, 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to publish trade post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a Skill Trade Offer" maxWidth="lg">
      <div className="p-6">
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#00D285] flex items-center justify-center mx-auto text-2xl animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Trade Offer Published!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your trade offer is now live on the marketplace. AI will automatically match and recommend it to compatible peers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Trade Headline / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Figma UI/UX Design in exchange for React 19 Frontend"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285]"
                required
              />
            </div>

            {/* Offered Skill (What I can teach) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Skill You Offer (What you will teach) <span className="text-rose-500">*</span>
              </label>
              {myTeachSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {myTeachSkills.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setOfferedSkill(s)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                        offeredSkill === s
                          ? 'bg-[#00D285] text-white border-[#00D285]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#00D285]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
                placeholder="Type or select skill you can teach..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285]"
                required
              />
            </div>

            {/* Requested Skill (What I want to learn) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Skill You Request (What you want in return) <span className="text-rose-500">*</span>
              </label>
              {myLearnSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {myLearnSkills.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRequestedSkill(s)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                        requestedSkill === s
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={requestedSkill}
                onChange={(e) => setRequestedSkill(e.target.value)}
                placeholder="Type or select skill you want to learn..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285]"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Details & Expectations
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe your background, what you hope to cover, project ideas, or session format..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285] resize-none"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Availability & Frequency
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. Weekends, Evenings (2 hrs/week)"
                  className="flex-1 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={loading}
                className="bg-[#00D285] hover:bg-[#00ba76] text-white flex items-center gap-2 font-bold shadow-md shadow-[#00D285]/20"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-xs" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Publish Trade Offer</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
