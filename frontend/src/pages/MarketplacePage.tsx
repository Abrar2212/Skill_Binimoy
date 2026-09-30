import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AppLayout } from '../components/layout/AppLayout';
import { MarketplaceFilterBar } from '../components/features/marketplace/MarketplaceFilterBar';
import { TradePostCard } from '../components/features/marketplace/TradePostCard';
import { UserSkillCard } from '../components/features/marketplace/UserSkillCard';
import { ExchangeRequestModal } from '../components/features/marketplace/ExchangeRequestModal';
import { CreateTradePostModal } from '../components/features/marketplace/CreateTradePostModal';
import { AIMarketplaceBanner } from '../components/features/marketplace/AIMarketplaceBanner';
import { MarketplaceUser, TradePost } from '../types/skill';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { Sparkles, ArrowRightLeft, Users, PlusCircle } from 'lucide-react';

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
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [tradePosts, setTradePosts] = useState<TradePost[]>([]);
  const [users, setUsers] = useState<MarketplaceUser[]>([]);
  const [myProfileReady, setMyProfileReady] = useState(false);
  const [viewMode, setViewMode] = useState<'trades' | 'peers'>('trades');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('ai');

  // Modals state
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<MarketplaceUser | null>(null);
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState<string>('');
  const [selectedRequestedSkill, setSelectedRequestedSkill] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch Trade Posts and Users
  const fetchData = async () => {
    setLoading(true);
    try {
      const [tradeRes, usersData] = await Promise.all([
        userService.getTradePosts(),
        userService.getAllUsers(),
      ]);

      setTradePosts(tradeRes.posts || []);
      setMyProfileReady(Boolean(tradeRes.my_profile_ready));
      setUsers(usersData || []);
    } catch (err) {
      console.error('Failed to load marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Exchange Request initiation from Peer Card
  const handlePeerExchangeClick = (u: MarketplaceUser) => {
    setTargetUser(u);
    setSelectedOfferedSkill('');
    setSelectedRequestedSkill(u.skills_teach?.[0] || '');
    setIsExchangeModalOpen(true);
  };

  // Handle Exchange Request initiation from Trade Post Card
  const handleTradeProposeClick = (
    u: MarketplaceUser,
    offeredSkill: string,
    requestedSkill: string
  ) => {
    setTargetUser(u);
    setSelectedOfferedSkill(offeredSkill);
    setSelectedRequestedSkill(requestedSkill);
    setIsExchangeModalOpen(true);
  };

  // Handle Exchange Request initiation directly from AI Banner
  const handleBannerTradePropose = (post: TradePost) => {
    const matchedUser: MarketplaceUser = {
      id: post.user_id,
      full_name: post.user_name,
      email: '',
      profile_image: post.user_image,
      rating: post.user_rating,
      review_count: post.user_review_count,
      skills_teach: [post.offered_skill],
      skills_learn: [post.requested_skill],
    };
    handleTradeProposeClick(matchedUser, post.requested_skill, post.offered_skill);
  };

  // Handle Deleting own Trade Post
  const handleDeleteTradePost = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this trade offer?')) return;
    try {
      await userService.deleteTradePost(id);
      setTradePosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      showAlert({ variant: 'error', title: 'Error', message: err?.response?.data?.message || 'Failed to delete trade post.' });
    }
  };

  // Find Best Reciprocal / AI Matched Trade for Banner
  const bestMatchPost = tradePosts.find(
    (p) => !p.is_own_post && (p.ai_match?.is_reciprocal || (p.ai_match?.score && p.ai_match.score >= 80))
  ) || null;

  // Filter & Search Logic for Trade Posts
  const filteredTradePosts = tradePosts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchesQuery =
        post.title.toLowerCase().includes(query) ||
        post.offered_skill.toLowerCase().includes(query) ||
        post.requested_skill.toLowerCase().includes(query) ||
        post.user_name.toLowerCase().includes(query) ||
        (post.description && post.description.toLowerCase().includes(query));

      if (!matchesQuery) return false;
    }

    if (selectedCategory === 'All') return true;

    const keywords = CATEGORY_KEYWORDS[selectedCategory] || [selectedCategory.toLowerCase()];
    const matchesCategory =
      keywords.some((kw) => post.offered_skill.toLowerCase().includes(kw)) ||
      keywords.some((kw) => post.requested_skill.toLowerCase().includes(kw));

    return matchesCategory;
  });

  // Sort Logic for Trade Posts
  const sortedTradePosts = [...filteredTradePosts].sort((a, b) => {
    if (sortBy === 'ai') {
      const scoreA = a.ai_match?.score || 0;
      const scoreB = b.ai_match?.score || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === 'rating') {
      return (b.user_rating || 5) - (a.user_rating || 5);
    }
    if (sortBy === 'reviews') {
      return (b.user_review_count || 0) - (a.user_review_count || 0);
    }
    if (sortBy === 'recent') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });

  // Filter & Search Logic for Peers
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
      u.skills_teach?.some((s) => keywords.some((kw) => s.toLowerCase().includes(kw))) ||
      u.skills_learn?.some((s) => keywords.some((kw) => s.toLowerCase().includes(kw)));

    return matchesCategory;
  });

  // Sort Logic for Peers
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'ai') {
      const scoreA = a.ai_match?.score || 0;
      const scoreB = b.ai_match?.score || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (b.rating || 5) - (a.rating || 5);
    }
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
      if (!loading && (sortedTradePosts.length > 0 || sortedUsers.length > 0)) {
        gsap.from('.marketplace-card', {
          opacity: 0,
          y: 18,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
        });
      }
    },
    {
      scope: gridRef,
      dependencies: [loading, viewMode, selectedCategory, sortBy],
    }
  );

  return (
    <AppLayout showSidebar={false} variant="landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Marketplace Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[#00D285] text-xs font-bold shadow-sm mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skill Barter Marketplace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Skill Exchange Marketplace
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Post your trade offers or explore {tradePosts.length} active barter posts. AI dynamically sorts and suggests mutual trades based on your profile skills.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold shadow-md shadow-[#00D285]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Trade</span>
            </button>

            <button
              onClick={fetchData}
              title="Refresh listings"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#00D285] text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#00D285] transition-all shadow-sm active:scale-95"
            >
              <i className={`fa-solid fa-arrows-rotate text-xs ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* AI Profile Suggestion Banner */}
        <AIMarketplaceBanner
          isLoggedIn={Boolean(user)}
          isProfileReady={myProfileReady}
          bestMatchPost={bestMatchPost}
          totalMatches={tradePosts.filter((p) => (p.ai_match?.score || 0) >= 75).length}
          onProposeTrade={handleBannerTradePropose}
          onPostTradeClick={() => setIsCreateModalOpen(true)}
        />

        {/* Filter Bar with Tabs & Controls */}
        <MarketplaceFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPostTradeClick={() => setIsCreateModalOpen(true)}
          tradesCount={tradePosts.length}
          peersCount={users.length}
        />

        {/* Grid Content */}
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
          ) : viewMode === 'trades' ? (
            /* Trade Offers View */
            sortedTradePosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedTradePosts.map((post) => (
                  <div key={post.id} className="marketplace-card">
                    <TradePostCard
                      post={post}
                      onProposeClick={handleTradeProposeClick}
                      onDeleteClick={handleDeleteTradePost}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00D285] flex items-center justify-center mx-auto mb-3">
                  <ArrowRightLeft className="w-6 h-6" />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">No trade offers found</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Be the first to post a skill trade offer in this category and get matched by AI!
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-5 py-2 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs font-bold transition-all shadow-md shadow-[#00D285]/20 cursor-pointer"
                  >
                    + Post a Trade Offer
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Peer Directory View */
            sortedUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedUsers.map((u) => (
                  <div key={u.id} className="marketplace-card">
                    <UserSkillCard user={u} onExchangeClick={handlePeerExchangeClick} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
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
            )
          )}
        </div>

        {/* Post a Trade Modal */}
        {isCreateModalOpen && (
          <CreateTradePostModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={(newPost) => {
              setTradePosts((prev) => [newPost, ...prev]);
              setViewMode('trades');
            }}
          />
        )}

        {/* Exchange Proposal Modal */}
        {isExchangeModalOpen && targetUser && (
          <ExchangeRequestModal
            isOpen={isExchangeModalOpen}
            onClose={() => {
              setIsExchangeModalOpen(false);
              setTargetUser(null);
            }}
            targetUser={targetUser}
            initialOfferedSkill={selectedOfferedSkill}
            initialRequestedSkill={selectedRequestedSkill}
            onSuccess={fetchData}
          />
        )}
      </div>
    </AppLayout>
  );
};
