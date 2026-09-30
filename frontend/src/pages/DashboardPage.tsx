import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/features/dashboard/StatCard';
import { UpcomingSessionsList } from '../components/features/dashboard/UpcomingSessionsList';
import { RecentActivityFeed } from '../components/features/dashboard/RecentActivityFeed';
import { SkillsOverviewCard } from '../components/features/dashboard/SkillsOverviewCard';
import { ReputationReviewsModal } from '../components/features/dashboard/ReputationReviewsModal';
import { userService } from '../services/userService';
import { exchangeService } from '../services/exchangeService';
import { User, UserStats } from '../types/user';
import { Skill } from '../types/skill';
import { Session } from '../types/session';

export const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [stats, setStats] = useState<UserStats>({
    skills_shared: 0,
    skills_learned: 0,
    active_sessions: 0,
    total_reviews: 0,
    average_rating: 5.0,
    pending_proposals: 0,
  });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      userService.getProfile(),
      exchangeService.getSessions(),
    ])
      .then(([profileData, sessionsData]) => {
        setUser(profileData.user);
        setSkills(profileData.skills || []);
        if (profileData.stats) setStats(profileData.stats);
        setSessions(sessionsData || []);
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  useGSAP(
    () => {
      if (!loading) {
        gsap.from('.dash-fade-in', {
          opacity: 0,
          y: 16,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
        });
      }
    },
    { scope: dashboardRef, dependencies: [loading] }
  );

  const firstName = user?.full_name?.split(' ')[0] || 'Member';

  return (
    <AppLayout showSidebar={false} variant="landing">
      <div ref={dashboardRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Welcome Greeting Banner */}
        <div className="dash-fade-in bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D285]/10 text-[#00D285] text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-gauge-high" /> Learner Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {firstName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              You have{' '}
              <span className="text-[#00D285] font-bold">
                {stats.active_sessions} active {stats.active_sessions === 1 ? 'session' : 'sessions'}
              </span>{' '}
              and{' '}
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                {stats.pending_proposals ?? 0} pending{' '}
                {stats.pending_proposals === 1 ? 'proposal' : 'proposals'}
              </span>
              . Connect with peers or explore newly offered skills today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-store text-xs" />
              <span>Explore Marketplace</span>
            </Link>
            <Link
              to="/requests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <i className="fa-solid fa-handshake text-xs" />
              <span>View Requests</span>
            </Link>
          </div>
        </div>

        {/* 4 Key Statistics Cards */}
        <div className="dash-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            key="stat-card-shared"
            title="Skills Shared"
            value={stats.skills_shared}
            subtitle="Skills offered to teach"
            iconClass="fa-solid fa-arrow-right-arrow-left"
            colorGradient="from-[#00D285] to-emerald-600"
          />
          <StatCard
            key="stat-card-learned"
            title="Skills Learned"
            value={stats.skills_learned}
            subtitle="Skills you want to learn"
            iconClass="fa-solid fa-graduation-cap"
            colorGradient="from-cyan-500 to-blue-600"
          />
          <StatCard
            key="stat-card-sessions"
            title="Active Sessions"
            value={stats.active_sessions}
            subtitle="Scheduled 1-on-1 exchanges"
            iconClass="fa-regular fa-calendar-check"
            colorGradient="from-teal-500 to-emerald-500"
          />
          <StatCard
            key="stat-card-reputation"
            title="Reputation"
            value={`${stats.average_rating ? stats.average_rating.toFixed(1) : '5.0'} ★`}
            subtitle={`Across ${stats.total_reviews} ${stats.total_reviews === 1 ? 'review' : 'reviews'} (Click to view)`}
            iconClass="fa-solid fa-star"
            colorGradient="from-amber-400 to-orange-500"
            onClick={() => setIsReviewsModalOpen(true)}
          />
        </div>

        {/* Two Column Section: Upcoming Sessions & Skills Overview */}
        <div className="dash-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <UpcomingSessionsList sessions={sessions} />
            <RecentActivityFeed />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <SkillsOverviewCard skills={skills} />
          </div>
        </div>

        {/* Reputation Reviews Modal */}
        <ReputationReviewsModal
          isOpen={isReviewsModalOpen}
          onClose={() => setIsReviewsModalOpen(false)}
          userId={user?.id || 1}
        />
      </div>
    </AppLayout>
  );
};
