import React, { useEffect, useState } from 'react';
import { Modal } from '../../common/Modal';
import { Avatar } from '../../common/Avatar';
import { Review } from '../../../types/user';
import { userService } from '../../../services/userService';

interface ReputationReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export const ReputationReviewsModal: React.FC<ReputationReviewsModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      userService
        .getReviews(userId)
        .then((data) => setReviews(data))
        .catch((err) => console.error('Failed to load reputation reviews:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, userId]);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reputation & Reviews" maxWidth="lg">
      <div className="space-y-6">
        {/* Rating Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-3xl font-black shrink-0 shadow-md">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-1 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i
                    key={i}
                    className={`fa-star ${
                      i < Math.round(Number(averageRating))
                        ? 'fa-solid text-amber-400'
                        : 'fa-regular text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Verified Peer Reputation
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculated from {reviews.length} completed 1-on-1 skill exchanges
              </p>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 animate-pulse flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-400 flex items-center justify-center mx-auto mb-2 text-xl">
              <i className="fa-solid fa-award" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No reviews yet</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Reviews will appear here as soon as your exchange partners review completed sessions.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.reviewer_name || 'Peer'} src={r.reviewer_image} size="md" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {r.reviewer_name || 'Peer'}
                      </h4>
                      {r.skill_exchanged && (
                        <p className="text-[10px] text-[#00D285] font-semibold">
                          Skill: {r.skill_exchanged}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i
                        key={i}
                        className={`fa-star ${
                          i < (r.rating || 5)
                            ? 'fa-solid text-amber-400'
                            : 'fa-regular text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  "{r.comment || 'Great session!'}"
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1 text-[#00D285] font-medium">
                    <i className="fa-solid fa-circle-check text-[10px]" /> Verified Exchange
                  </span>
                  <span>
                    {r.created_at
                      ? new Date(r.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
