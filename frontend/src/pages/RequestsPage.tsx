import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AppLayout } from '../components/layout/AppLayout';
import { RequestCard } from '../components/features/requests/RequestCard';
import { exchangeService } from '../services/exchangeService';
import { ExchangeRequest } from '../types/request';
import { useAuth } from '../context/AuthContext';

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || 1;

  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [tab, setTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchRequests = () => {
    setLoading(true);
    exchangeService
      .getRequests()
      .then((data) => setRequests(data))
      .catch((err) => console.error('Failed to load requests:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id: number, status: 'accepted' | 'rejected' | 'cancelled') => {
    const backendStatus =
      status === 'accepted' ? 'Accepted' : status === 'rejected' ? 'Rejected' : 'Cancelled';

    await exchangeService.updateRequestStatus(id, backendStatus);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: backendStatus } : r))
    );
  };

  const incomingRequests = requests.filter(
    (r) => r.direction === 'incoming' || r.receiver_id === currentUserId
  );

  const outgoingRequests = requests.filter(
    (r) => r.direction === 'outgoing' || r.sender_id === currentUserId
  );

  const displayedList = (tab === 'incoming' ? incomingRequests : outgoingRequests).filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  useGSAP(
    () => {
      if (!loading && displayedList.length > 0) {
        gsap.from('.request-item-card', {
          opacity: 0,
          y: 15,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        });
      }
    },
    { scope: listRef, dependencies: [loading, displayedList.length, tab, statusFilter] }
  );

  return (
    <AppLayout showSidebar={false} variant="landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[#00D285] text-xs font-bold shadow-sm mb-2">
              <i className="fa-solid fa-handshake text-xs" />
              <span>Collaboration Inbox</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Skill Exchange Requests
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Review and manage incoming proposals or track invitations you sent out.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchRequests}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#00D285] text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#00D285] transition-all shadow-sm active:scale-95"
            >
              <i className={`fa-solid fa-arrows-rotate text-xs ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {/* Incoming / Outgoing Pill Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200/80 dark:border-slate-700 text-xs font-bold shadow-inner">
              <button
                onClick={() => setTab('incoming')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  tab === 'incoming'
                    ? 'bg-[#00D285] text-white shadow-md shadow-[#00D285]/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <i className="fa-solid fa-inbox text-xs" />
                <span>Received ({incomingRequests.length})</span>
              </button>
              <button
                onClick={() => setTab('outgoing')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  tab === 'outgoing'
                    ? 'bg-[#00D285] text-white shadow-md shadow-[#00D285]/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <i className="fa-solid fa-paper-plane text-xs" />
                <span>Sent ({outgoingRequests.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-full capitalize font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-[#00D285] text-white shadow-md shadow-[#00D285]/20 font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div ref={listRef} className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                        <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/60 rounded" />
                      </div>
                    </div>
                    <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800/40 rounded-full" />
                  </div>
                  <div className="h-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : displayedList.length > 0 ? (
            displayedList.map((req) => (
              <div key={req.id} className="request-item-card">
                <RequestCard
                  request={req}
                  isIncoming={tab === 'incoming'}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-handshake text-2xl" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                No {statusFilter !== 'all' ? statusFilter : ''} requests found
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {tab === 'incoming'
                  ? 'Share more skills on the marketplace to attract exchange partners!'
                  : 'Browse the Marketplace to find peers and propose your first skill exchange.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
