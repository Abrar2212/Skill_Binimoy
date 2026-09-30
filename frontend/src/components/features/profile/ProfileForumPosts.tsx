import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { forumService } from '../../../services/forumService';
import { ForumPost } from '../../../types/forum';
import {
  MessageSquareCode,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ProfileForumPostsProps {
  userId: number;
  isOwnProfile?: boolean;
}

export const ProfileForumPosts: React.FC<ProfileForumPostsProps> = ({
  userId,
  isOwnProfile = true,
}) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    forumService
      .getUserPosts(userId)
      .then((data) => setPosts(data))
      .catch((err) => console.error('Failed to load user forum posts:', err))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00D285]/10 text-[#00D285] flex items-center justify-center text-lg">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Forum Discussions & Questions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Technical problems and challenges asked by {isOwnProfile ? 'you' : 'this member'}.
            </p>
          </div>
        </div>

        <Link
          to="/forum"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#00D285]/15 text-slate-700 dark:text-slate-300 hover:text-[#00D285] text-xs font-bold transition-all self-start sm:self-auto"
        >
          <span>Explore All Forum Topics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="pt-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#00D285] flex items-center justify-center mx-auto mb-3 text-lg">
              <i className="fa-solid fa-comments text-base" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              No technical problems posted yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
              {isOwnProfile
                ? 'Facing an issue with code, frameworks, or architecture? Ask in the community forum!'
                : 'This user has not started any forum discussions yet.'}
            </p>
            {isOwnProfile && (
              <Link
                to="/forum"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00D285] text-white text-xs font-bold shadow-md hover:bg-[#00ba76] transition-all"
              >
                <span>Ask a Problem in Forum</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 hover:border-[#00D285]/50 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00D285]/10 text-[#00D285]">
                      {post.category}
                    </span>
                    {post.skill_related && (
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        • {post.skill_related}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <Link
                  to={`/forum#post-${post.id}`}
                  className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#00D285] transition-colors line-clamp-2 mb-2"
                >
                  {post.title}
                </Link>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {post.content}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.total_reactions || 0} reactions</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comment_count || 0} answers</span>
                    </span>
                  </div>

                  <Link
                    to={`/forum#post-${post.id}`}
                    className="inline-flex items-center gap-1 font-bold text-xs text-[#00D285] hover:underline"
                  >
                    <span>View Discussion</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
