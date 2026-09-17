import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Review } from '../../../types/user';
import { userService } from '../../../services/userService';
import { Avatar } from '../../common/Avatar';

interface ReviewsListProps {
  userId: number;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ userId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    userService
      .getReviews(userId)
      .then((data) => {
        if (isMounted) setReviews(data);
      })
      .catch((err) => console.error('Failed to load reviews:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useGSAP(
    () => {
      if (!loading && reviews.length > 0) {
        gsap.from('.review-card-item', {
          opacity: 0,
          y: 15,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        });
      }
    },
    { scope: containerRef, dependencies: [loading, reviews] }
  );

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div ref={containerRef} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-amber-500 dark:text-amber-400 mb-1">
            <i className="fa-solid fa-award" />
            <span>Peer Endorsements</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reputation & Community Reviews
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified ratings and feedback left by members after completing 1-on-1 skill exchange calls.
          </p>
        </div>

        {/* Rating Summary Box */}
        <div className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 shrink-0">
          <div className="text-2xl font-black text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
            <span>{averageRating}</span>
            <i className="fa-solid fa-star text-lg text-amber-400" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Overall Rating</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {reviews.length} verified {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 animate-pulse flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 text-xl">
            <i className="fa-solid fa-star" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">No Reviews Yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Complete your first peer exchange session to begin receiving community endorsements and star reviews!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="review-card-item p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-[#00D285]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={r.reviewer_name || 'Community Member'}
                      src={r.reviewer_image}
                      size="sm"
                      className="ring-2 ring-[#00D285]/30"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {r.reviewer_name || 'Peer Mentor'}
                      </h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <i className="fa-solid fa-calendar-days text-[9px]" />
                        {new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i
                        key={i}
                        className={`fa-star ${i < (Number(r.rating) || 5) ? 'fa-solid' : 'fa-regular opacity-30'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic mb-3">
                  "{r.comment || 'Great collaboration session! Learned a lot from our exchange.'}"
                </p>
              </div>

              {r.skill_exchanged && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Topic:</span>
                  <span className="text-[#00D285] font-bold bg-[#00D285]/10 px-2 py-0.5 rounded-md">
                    {r.skill_exchanged}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
