import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AppLayout } from '../components/layout/AppLayout';
import { MarketplaceFilterBar } from '../components/features/marketplace/MarketplaceFilterBar';
import { UserSkillCard } from '../components/features/marketplace/UserSkillCard';
import { ExchangeRequestModal } from '../components/features/marketplace/ExchangeRequestModal';
import { MarketplaceUser } from '../types/skill';
import { userService } from '../services/userService';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Web Development': [
    'web',
    'react',
    'next',
    'typescript',
    'javascript',
    'html',
    'css',
    'tailwind',
    'frontend',
    'backend',
    'node',
    'express',
    'fastapi',
    'vue',
    'angular',
  ],
  'Design': [
    'design',
    'ui',
    'ux',
    'figma',
    'sketch',
    'adobe',
    'product design',
    'graphic',
    'motion',
    'video',
  ],
  'Data Science': [
    'python',
    'pytorch',
    'machine learning',
    'ai',
    'data',
    'tensorflow',
    'deep learning',
    'pandas',
    'numpy',
    'nlp',
  ],
  'App Development': [
    'flutter',
    'react native',
    'ios',
    'android',
    'swift',
    'kotlin',
    'dart',
    'mobile',
    'app',
  ],
  'Languages': [
    'english',
    'public speaking',
    'communication',
    'ielts',
    'toefl',
    'spanish',
    'french',
    'german',
    'japanese',
    'chinese',
    'arabic',
  ],
  'Marketing': [
    'marketing',
    'seo',
    'content',
    'strategy',
    'social media',
    'growth',
    'branding',
  ],
};

export const MarketplacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [users, setUsers] = useState<MarketplaceUser[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [targetUser, setTargetUser] = useState<MarketplaceUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchUsers = () => {
    setLoading(true);
    userService
      .getAllUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to load marketplace users:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleExchangeClick = (u: MarketplaceUser) => {
    setTargetUser(u);
    setIsModalOpen(true);
  };

  // Filter & Search Logic
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchesQuery =
        u.full_name.toLowerCase().includes(query) ||
        (u.bio && u.bio.toLowerCase().includes(query)) ||
        u.skills_teach?.some((s) => s.toLowerCase().includes(query)) ||
        u.skills_learn?.some((s) => s.toLowerCase().includes(query));

      if (!matchesQuery) return false;
    }

    if (selectedCategory === 'All') return true;

    const keywords = CATEGORY_KEYWORDS[selectedCategory] || [selectedCategory.toLowerCase()];
    const matchesCategory =
      u.skills_teach?.some((s) =>
        keywords.some((kw) => s.toLowerCase().includes(kw))
      ) ||
      u.skills_learn?.some((s) =>
        keywords.some((kw) => s.toLowerCase().includes(kw))
      );

    return matchesCategory;
  });

  // Sort Logic
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 5) - (a.rating || 5);
    }
    if (sortBy === 'reviews') {
      return (b.review_count || 0) - (a.review_count || 0);
    }
    if (sortBy === 'recent') {
      return (b.id || 0) - (a.id || 0);
    }
    return 0;
  });

  // GSAP animation for cards
  useGSAP(
    () => {
      if (!loading && sortedUsers.length > 0) {
        gsap.from('.marketplace-user-card', {
          opacity: 0,
          y: 18,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
        });
      }
    },
    { scope: gridRef, dependencies: [loading, sortedUsers.length, selectedCategory, sortBy] }
  );

  return (
    <AppLayout showSidebar={false} variant="landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Marketplace Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[#00D285] text-xs font-bold shadow-sm mb-2">
              <i className="fa-solid fa-store text-xs" />
              <span>Peer Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Skill Exchange Marketplace
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Discover <span className="text-[#00D285] font-bold">{users.length} active peers</span> ready to barter skills. Teach what you know, learn what you need—100% free.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#00D285] text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#00D285] transition-all shadow-sm active:scale-95 w-fit"
          >
            <i className={`fa-solid fa-arrows-rotate text-xs ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Bar */}
        <MarketplaceFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Users Grid */}
        <div ref={gridRef}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                    </div>
                  </div>
                  <div className="h-10 bg-slate-50 dark:bg-slate-800/40 rounded-xl" />
                  <div className="h-16 bg-slate-50 dark:bg-slate-800/30 rounded-xl" />
                </div>
              ))}
            </div>
          ) : sortedUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedUsers.map((u) => (
                <div key={u.id} className="marketplace-user-card">
                  <UserSkillCard user={u} onExchangeClick={handleExchangeClick} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-users text-2xl" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">No peers found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No community members found matching your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-5 py-2.5 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold transition-all shadow-md shadow-[#00D285]/20"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>

        {/* Exchange Proposal Modal */}
        <ExchangeRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          targetUser={targetUser}
          onSuccess={fetchUsers}
        />
      </div>
    </AppLayout>
  );
};
