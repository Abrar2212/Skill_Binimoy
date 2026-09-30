import React, { useEffect, useState, useRef } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { ForumPostCard } from '../components/features/forum/ForumPostCard';
import { CreateForumPostModal } from '../components/features/forum/CreateForumPostModal';
import { forumService } from '../services/forumService';
import { ForumPost, CreateForumPostPayload } from '../types/forum';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import {
  Sparkles,
  PlusCircle,
  Search,
  SlidersHorizontal,
  HelpCircle,
  MessageSquareCode,
  Code2,
  Bug,
  Lightbulb,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Data Science & AI',
  'Mobile Apps',
  'Design & UI/UX',
  'Programming & Logic',
  'Career & Freelancing',
];

export const ForumPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { showAuthPrompt } = useAlert();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch posts from backend with search, category, sort
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await forumService.getPosts({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery.trim() || undefined,
        sort: sortBy,
      });
      setPosts(res.posts || []);
    } catch (err) {
      console.error('Failed to load forum posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreatePost = async (payload: CreateForumPostPayload) => {
    const res = await forumService.createPost(payload);
    setPosts((prev) => [res.post, ...prev]);
    showToast('Problem posted successfully to the community forum!');
  };

  const handlePostDeleted = (deletedId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
    showToast('Discussion post removed.');
  };

  const handlePostUpdated = (updated: ForumPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleRequireAuth = (customMessage?: string) => {
    showAuthPrompt(
      customMessage || 'Please sign in to ask problems or participate in discussions!'
    );
  };

  return (
    <AppLayout showSidebar={false} variant="landing">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-2xl border border-slate-700 dark:border-slate-200 text-xs font-bold animate-bounce">
          <i className="fa-solid fa-circle-check text-[#00D285]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Floating Ask Question Button (Quick Action from anywhere on screen) */}
      <button
        onClick={() => {
          if (!isAuthenticated) {
            handleRequireAuth('Please sign in to ask problems or participate in discussions!');
            return;
          }
          setIsCreateModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#00D285]/35 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title="Post a technical question"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Ask a Question</span>
      </button>

      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-7">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D285]/10 text-[#00D285] text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquareCode className="w-3.5 h-3.5" /> Technical Problem Forum
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Community Questions & Problem Hub
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Post real-world technical challenges, troubleshoot bugs, and explore questions personalized to your teaching and learning skills.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  handleRequireAuth('Please sign in to ask problems or participate in discussions!');
                  return;
                }
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00D285] hover:bg-[#00ba76] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#00D285]/20 hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ask a Problem</span>
            </button>
          </div>
        </div>

        {/* AI Profile Preference Banner */}
        {isAuthenticated && user && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-[#00D285]/10 to-teal-500/10 border border-[#00D285]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#00D285] text-white flex items-center justify-center shadow-sm shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Personalized matching active for {user.full_name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Highlighting challenges aligning with skills you master or want to explore.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-[#00D285] text-xs font-bold border border-[#00D285]/30 self-start sm:self-auto">
              <i className="fa-solid fa-wand-magic-sparkles text-[10px]" />
              <span>Smart Recommendation</span>
            </div>
          </div>
        )}

        {/* In-Feed "Ask a Question / Post Problem" Prompt Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-sm hover:border-[#00D285]/50 transition-all duration-300">
          <div className="flex items-center gap-3">
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt={user.full_name}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#00D285]/30 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-[#00D285]/15 text-[#00D285] flex items-center justify-center font-bold text-sm shrink-0">
                {user ? user.full_name[0].toUpperCase() : 'U'}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  handleRequireAuth('Please sign in to ask problems or participate in discussions!');
                  return;
                }
                setIsCreateModalOpen(true);
              }}
              className="flex-1 text-left px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer group"
            >
              <span className="truncate">
                {user
                  ? `Facing a coding problem, ${user.full_name.split(' ')[0]}? Click here to ask...`
                  : 'Have a technical problem or question? Click here to ask...'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00D285] text-white text-xs font-bold shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Question</span>
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) return handleRequireAuth('Please sign in to share code issues or ask technical problems.');
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-[#00D285] transition-colors cursor-pointer font-medium"
              >
                <Code2 className="w-3.5 h-3.5 text-[#00D285]" />
                <span>Share Code Issue</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) return handleRequireAuth('Please sign in to troubleshoot bugs with community experts.');
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-[#00D285] transition-colors cursor-pointer font-medium"
              >
                <Bug className="w-3.5 h-3.5 text-rose-500" />
                <span>Troubleshoot Bug</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) return handleRequireAuth('Please sign in to request architecture advice.');
                  setIsCreateModalOpen(true);
                }}
                className="hidden sm:flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-[#00D285] transition-colors cursor-pointer font-medium"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Architecture Advice</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) return handleRequireAuth('Please sign in to open the full technical editor.');
                setIsCreateModalOpen(true);
              }}
              className="text-xs font-bold text-[#00D285] hover:underline cursor-pointer"
            >
              Open Full Editor &rarr;
            </button>
          </div>
        </div>

        {/* Search, Filter Bar & Sort Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problem title, tag (#react), or keyword..."
                className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D285]/40 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 text-xs font-bold rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00D285]/40 shadow-xs cursor-pointer"
              >
                <option value="recommended">Personalized (AI Match)</option>
                <option value="newest">Latest Questions</option>
                <option value="popular">Most Discussed</option>
                <option value="unanswered">Needs Answers</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#00D285] text-white shadow-sm shadow-[#00D285]/30'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Posts List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-44 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/60 dark:border-slate-800"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-8">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-[#00D285] flex items-center justify-center mx-auto mb-4 text-2xl">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1.5">
              No problem posts found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search query or choosing another category filter.'
                : 'Be the first member to ask a technical question or share a problem!'}
            </p>
            <button
              onClick={() => {
                if (searchQuery || selectedCategory !== 'All') {
                  setSearchQuery('');
                  setSelectedCategory('All');
                } else {
                  if (!isAuthenticated) {
                    handleRequireAuth('Please sign in to ask problems or participate in discussions!');
                    return;
                  }
                  setIsCreateModalOpen(true);
                }
              }}
              className="px-6 py-2.5 rounded-full bg-[#00D285] text-white text-xs font-bold shadow-md hover:bg-[#00ba76] transition-all cursor-pointer"
            >
              {searchQuery || selectedCategory !== 'All' ? 'Reset Filters' : 'Ask First Question'}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <ForumPostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
              />
            ))}
          </div>
        )}

        {/* Create Post Modal */}
        <CreateForumPostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      </div>
    </AppLayout>
  );
};

export default ForumPage;
