import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { userService } from '../../../services/userService';

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: number;
  partnerName: string;
  skillExchanged?: string;
  onReviewSubmitted?: () => void;
}

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  isOpen,
  onClose,
  partnerId,
  partnerName,
  skillExchanged,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief comment about your exchange session.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await userService.addReview({
        reviewed_id: partnerId,
        rating,
        comment: comment.trim(),
        skill_exchanged: skillExchanged || 'Skill Exchange',
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setComment('');
        onClose();
        if (onReviewSubmitted) onReviewSubmitted();
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Session with ${partnerName}`}
      description="Share your feedback and rating to build trust"
      maxWidth="md"
    >
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#00D285]/10 text-[#00D285] border border-[#00D285]/30 flex items-center justify-center mx-auto text-2xl shadow-sm">
            <i className="fa-solid fa-check" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Review Submitted!</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thank you for helping build our trusted skill-sharing community.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating Selection */}
          <div className="text-center py-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              How was your exchange experience?
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                  >
                    <i
                      className={`text-2xl transition-all duration-200 ${
                        active
                          ? 'fa-solid fa-star text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                          : 'fa-regular fa-star text-slate-300 dark:text-slate-600 hover:text-amber-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-bold text-amber-500 dark:text-amber-400 mt-2.5">
              {rating === 5 && 'Outstanding! (5/5)'}
              {rating === 4 && 'Very Good! (4/5)'}
              {rating === 3 && 'Good Experience (3/5)'}
              {rating === 2 && 'Needs Improvement (2/5)'}
              {rating === 1 && 'Poor (1/5)'}
            </p>
          </div>

          {/* Feedback Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <i className="fa-regular fa-comment-dots text-[#00D285] mr-1.5" />
              Written Feedback
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share what you learned from ${partnerName}, their communication style, and advice for future exchange partners...`}
              className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00D285] focus:ring-1 focus:ring-[#00D285] resize-none"
            />
          </div>

          {error && <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{error}</p>}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all duration-300 flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <i className="fa-solid fa-spinner fa-spin text-xs" />
              ) : (
                <i className="fa-solid fa-paper-plane text-xs" />
              )}
              <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
