import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { userService } from '../../../services/userService';
import { ActivityItem } from '../../../types/user';

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'recently';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'recently';

  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getActivityMeta(type: string) {
  switch (type) {
    case 'request_accepted':
      return {
        iconClass: 'fa-solid fa-circle-check',
        color: 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20',
      };
    case 'request_rejected':
      return {
        iconClass: 'fa-solid fa-circle-xmark',
        color: 'text-rose-500 bg-rose-500/10 border border-rose-500/20',
      };
    case 'request_received':
      return {
        iconClass: 'fa-solid fa-wand-magic-sparkles',
        color: 'text-purple-500 bg-purple-500/10 border border-purple-500/20',
      };
    case 'request_sent':
      return {
        iconClass: 'fa-solid fa-paper-plane',
        color: 'text-blue-500 bg-blue-500/10 border border-blue-500/20',
      };
    case 'session_scheduled':
      return {
        iconClass: 'fa-regular fa-calendar-check',
        color: 'text-amber-500 bg-amber-500/10 border border-amber-500/20',
      };
    case 'session_completed':
      return {
        iconClass: 'fa-solid fa-award',
        color: 'text-[#00D285] bg-[#00D285]/10 border border-[#00D285]/20',
      };
    case 'message':
      return {
        iconClass: 'fa-regular fa-comment-dots',
        color: 'text-cyan-500 bg-cyan-500/10 border border-cyan-500/20',
      };
    default:
      return {
        iconClass: 'fa-solid fa-bolt',
        color: 'text-slate-400 bg-slate-500/10 border border-slate-500/20',
      };
  }
}

export const RecentActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    userService
      .getActivityFeed()
      .then((items) => {
        if (isMounted) {
          setActivities(items);
        }
      })
      .catch((err) => {
        console.error('Failed to load recent activity:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useGSAP(
    () => {
      if (!loading && activities.length > 0) {
        gsap.from('.activity-item', {
          opacity: 0,
          y: 12,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        });
      }
    },
    { scope: containerRef, dependencies: [loading, activities] }
  );

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center text-sm">
            <i className="fa-solid fa-chart-line" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
        </div>
        <Link
          to="/requests"
          className="text-xs font-bold text-[#00D285] hover:text-[#00ba76] transition-colors flex items-center gap-1.5"
        >
          <span>View All</span>
          <i className="fa-solid fa-arrow-right text-[10px]" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={`act-loading-skel-${n}`} className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-2.5 w-3/4 bg-slate-100 dark:bg-slate-800/60 rounded" />
              </div>
              <div className="h-2.5 w-10 bg-slate-100 dark:bg-slate-800/40 rounded" />
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2.5 text-base">
            <i className="fa-solid fa-inbox" />
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            No recent activity yet
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Propose a skill exchange or connect with peers on the marketplace to see updates here!
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#00D285] hover:text-[#00ba76]"
          >
            <span>Explore Marketplace</span>
            <i className="fa-solid fa-arrow-right text-[10px]" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {activities.map((item, idx) => {
            const meta = getActivityMeta(item.type);
            return (
              <div
                key={`act-item-${item.id ?? idx}-${idx}`}
                className="activity-item flex items-start gap-3 text-xs p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${meta.color}`}
                >
                  <i className={meta.iconClass} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-slate-200 truncate">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mt-0.5 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1 pt-0.5">
                  <i className="fa-regular fa-clock text-[10px]" />{' '}
                  {formatRelativeTime(item.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
