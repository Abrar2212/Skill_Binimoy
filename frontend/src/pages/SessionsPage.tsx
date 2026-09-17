import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AppLayout } from '../components/layout/AppLayout';
import { SessionCard } from '../components/features/sessions/SessionCard';
import { ScheduleSessionModal } from '../components/features/sessions/ScheduleSessionModal';
import { exchangeService } from '../services/exchangeService';
import { Session } from '../types/session';

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const listRef = useRef<HTMLDivElement>(null);

  const fetchSessions = () => {
    setLoading(true);
    exchangeService
      .getSessions()
      .then((data) => setSessions(data))
      .catch((err) => console.error('Failed to load sessions:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const upcomingSessions = sessions.filter(
    (s) => s.status?.toLowerCase() === 'upcoming' || s.status?.toLowerCase() === 'scheduled'
  );
  const pastSessions = sessions.filter((s) => s.status?.toLowerCase() === 'completed');

  const displayedSessions =
    activeTab === 'upcoming'
      ? upcomingSessions
      : activeTab === 'completed'
      ? pastSessions
      : sessions;

  useGSAP(
    () => {
      if (!loading && displayedSessions.length > 0) {
        gsap.from('.session-card-item', {
          opacity: 0,
          y: 15,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        });
      }
    },
    { scope: listRef, dependencies: [loading, displayedSessions.length, activeTab] }
  );

  return (
    <AppLayout showSidebar={false} variant="landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D285]/10 text-[#00D285] text-xs font-bold uppercase tracking-wider mb-2">
              <i className="fa-solid fa-video" /> 1-on-1 Learning Calls
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Video Sessions
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage scheduled video calls, enter live virtual rooms, and review peer exchanges.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all duration-300 active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            <i className="fa-solid fa-plus text-xs" />
            <span>Book New Session</span>
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#00D285] text-white shadow-md shadow-[#00D285]/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <i className="fa-regular fa-calendar-check text-xs" />
            <span>Upcoming Meetings</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'upcoming'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {upcomingSessions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#00D285] text-white shadow-md shadow-[#00D285]/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <i className="fa-solid fa-award text-xs" />
            <span>Past Completed</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'completed'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {pastSessions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#00D285] text-white shadow-md shadow-[#00D285]/20'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <i className="fa-solid fa-layer-group text-xs" />
            <span>All Sessions</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {sessions.length}
            </span>
          </button>
        </div>

        {/* Sessions List or Loading/Empty State */}
        <div ref={listRef}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-full" />
                      <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                  </div>
                  <div className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : displayedSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onSessionUpdated={fetchSessions}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto text-2xl mb-4">
                {activeTab === 'upcoming' ? (
                  <i className="fa-regular fa-calendar-plus text-[#00D285]" />
                ) : activeTab === 'completed' ? (
                  <i className="fa-solid fa-medal text-amber-400" />
                ) : (
                  <i className="fa-solid fa-video text-slate-400" />
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeTab === 'upcoming'
                  ? 'No upcoming video meetings'
                  : activeTab === 'completed'
                  ? 'No completed sessions yet'
                  : 'No sessions found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                {activeTab === 'upcoming'
                  ? 'Schedule a 1-on-1 video exchange call with an accepted peer to start sharing your skills.'
                  : activeTab === 'completed'
                  ? 'Finish your first scheduled exchange call to unlock session history, ratings, and peer reviews.'
                  : 'Connect with members on the marketplace to request skills and schedule video meetings.'}
              </p>
              {activeTab === 'upcoming' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all active:scale-95"
                >
                  <i className="fa-solid fa-plus text-xs" />
                  <span>Book a Session</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Schedule Modal */}
        <ScheduleSessionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSessionCreated={fetchSessions}
        />
      </div>
    </AppLayout>
  );
};

