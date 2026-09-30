import React, { useState } from 'react';
import {
  ForumPost,
  ForumComment,
  ForumReactionType,
  CommentReactionType,
} from '../../../types/forum';
import { forumService } from '../../../services/forumService';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';
import {
  ThumbsUp,
  Lightbulb,
  Heart,
  Rocket,
  MessageSquare,
  Share2,
  Trash2,
  Send,
  CornerDownRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ForumPostCardProps {
  post: ForumPost;
  onPostDeleted?: (postId: number) => void;
  onPostUpdated?: (updatedPost: ForumPost) => void;
}

export const ForumPostCard: React.FC<ForumPostCardProps> = ({
  post,
  onPostDeleted,
  onPostUpdated,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { showAuthPrompt, showAlert } = useAlert();
  const [currentPost, setCurrentPost] = useState<ForumPost>(post);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  // Strict author verification: ONLY the authenticated user with matching ID can delete
  const isPostAuthor = Boolean(
    isAuthenticated &&
    user &&
    (
      String(user.id) === String(currentPost.author_id) ||
      Number(user.id) === Number(currentPost.author_id)
    )
  );

  const canDeleteComment = (commentAuthorId: number) => {
    if (!isAuthenticated || !user) return false;
    const isCommentOwner =
      String(user.id) === String(commentAuthorId) ||
      Number(user.id) === Number(commentAuthorId);
    return isCommentOwner || isPostAuthor;
  };

  // Reaction action
  const handleReaction = async (type: ForumReactionType) => {
    if (!isAuthenticated) {
      showAuthPrompt('Please sign in to react to posts and participate in the forum!');
      return;
    }

    // Optimistic UI update
    const isCurrentlyReacted = currentPost.user_reactions[type];
    const prevCount = currentPost.reaction_counts[type] || 0;
    const newCount = isCurrentlyReacted ? Math.max(0, prevCount - 1) : prevCount + 1;

    const updatedUserReactions = {
      ...currentPost.user_reactions,
      [type]: !isCurrentlyReacted,
    };
    const updatedCounts = {
      ...currentPost.reaction_counts,
      [type]: newCount,
    };
    const updatedTotal =
      (updatedCounts.helpful || 0) +
      (updatedCounts.insightful || 0) +
      (updatedCounts.heart || 0) +
      (updatedCounts.like || 0);

    const updatedPost: ForumPost = {
      ...currentPost,
      user_reactions: updatedUserReactions,
      reaction_counts: updatedCounts,
      total_reactions: updatedTotal,
    };
    setCurrentPost(updatedPost);
    if (onPostUpdated) onPostUpdated(updatedPost);

    try {
      const res = await forumService.reactToPost(currentPost.id, type);
      setCurrentPost((prev) => ({
        ...prev,
        user_reactions: {
          ...prev.user_reactions,
          [type]: res.user_reacted,
        },
        reaction_counts: res.reaction_counts,
      }));
    } catch (err) {
      console.error('Reaction failed:', err);
    }
  };

  // Toggle comments
  const toggleComments = async () => {
    if (!isCommentsOpen && comments.length === 0) {
      setLoadingComments(true);
      try {
        const fetched = await forumService.getComments(currentPost.id);
        setComments(fetched);
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setLoadingComments(false);
      }
    }
    setIsCommentsOpen(!isCommentsOpen);
  };

  // Submit top-level comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (!isAuthenticated) {
      showAuthPrompt('Please sign in to comment on forum posts and share solutions!');
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await forumService.addComment(currentPost.id, newCommentText.trim());
      setComments((prev) => [...prev, res.comment]);
      setNewCommentText('');
      setCurrentPost((prev) => ({
        ...prev,
        comment_count: (prev.comment_count || 0) + 1,
      }));
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Submit nested reply
  const handleAddReply = async (parentId: number) => {
    if (!replyText.trim()) return;
    if (!isAuthenticated) {
      showAuthPrompt('Please sign in to reply to comments!');
      return;
    }

    setSubmittingReply(true);
    try {
      const res = await forumService.addComment(currentPost.id, replyText.trim(), parentId);
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), res.comment],
            };
          }
          return c;
        })
      );
      setReplyText('');
      setReplyingToId(null);
      setCurrentPost((prev) => ({
        ...prev,
        comment_count: (prev.comment_count || 0) + 1,
      }));
    } catch (err) {
      console.error('Failed to post reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  // Delete a comment or reply
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    setDeletingCommentId(commentId);
    try {
      await forumService.deleteComment(commentId);
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: (c.replies || []).filter((r) => r.id !== commentId),
          }))
      );
      setCurrentPost((prev) => ({
        ...prev,
        comment_count: Math.max(0, (prev.comment_count || 1) - 1),
      }));
    } catch (err) {
      console.error('Failed to delete comment:', err);
      showAlert({ variant: 'error', title: 'Error', message: 'Could not delete comment. Please try again.' });
    } finally {
      setDeletingCommentId(null);
    }
  };

  // React to comment
  const handleCommentReaction = async (commentId: number, type: CommentReactionType) => {
    if (!isAuthenticated) {
      showAuthPrompt('Please sign in to react to comments!');
      return;
    }

    try {
      const res = await forumService.reactToComment(commentId, type);
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              reaction_counts: res.reaction_counts,
              user_reactions: {
                ...c.user_reactions,
                [type]: res.user_reacted,
              },
            };
          }
          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId
                  ? {
                      ...r,
                      reaction_counts: res.reaction_counts,
                      user_reactions: {
                        ...r.user_reactions,
                        [type]: res.user_reacted,
                      },
                    }
                  : r
              ),
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error('Comment reaction failed:', err);
    }
  };

  // Delete post
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this discussion post? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await forumService.deletePost(currentPost.id);
      if (onPostDeleted) onPostDeleted(currentPost.id);
    } catch (err) {
      console.error('Failed to delete post:', err);
      showAlert({ variant: 'error', title: 'Error', message: 'Could not delete post. Please try again.' });
      setDeleting(false);
    }
  };

  // Copy post link
  const handleShare = () => {
    const url = `${window.location.origin}/forum#post-${currentPost.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div
      id={`post-${currentPost.id}`}
      style={{ opacity: 1, visibility: 'visible' }}
      className="forum-post-card group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
    >
      {/* Copied Toast */}
      {copiedToast && (
        <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-lg animate-fade-in flex items-center gap-1.5">
          <i className="fa-solid fa-check text-xs" /> Link copied to clipboard!
        </div>
      )}

      {/* AI Relevance Banner if matched to user profile */}
      {currentPost.ai_match && currentPost.ai_match.score >= 70 && currentPost.ai_match.reason && (
        <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#00D285]/15 to-teal-500/15 border border-[#00D285]/35 text-[#00a86b] dark:text-[#00D285] text-xs font-bold tracking-tight shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#00D285] animate-pulse" />
          <span>{currentPost.ai_match.reason}</span>
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {currentPost.author_image ? (
            <img
              src={currentPost.author_image}
              alt={currentPost.author_name}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#00D285]/30 shadow-sm"
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00D285]/20 to-teal-500/20 text-[#00D285] flex items-center justify-center font-bold text-sm ring-1 ring-[#00D285]/30">
              {currentPost.author_name ? currentPost.author_name[0].toUpperCase() : 'U'}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base hover:text-[#00D285] transition-colors">
                {currentPost.author_name}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                • {formatDate(currentPost.created_at)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
              {currentPost.author_headline || 'Skill Binimoy Member'}
            </p>
          </div>
        </div>

        {/* Category Badge & Post Actions */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
            {currentPost.category}
          </span>

          {/* Delete Option for Author */}
          {isPostAuthor && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 transition-colors cursor-pointer"
              title="Delete discussion post"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#00D285] hover:bg-[#00D285]/10 transition-colors cursor-pointer"
            title="Copy share link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Problem Title */}
      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2.5 leading-snug group-hover:text-[#00D285] transition-colors">
        {currentPost.title}
      </h2>

      {/* Problem Content */}
      <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line mb-4 font-normal">
        {currentPost.content}
      </div>

      {/* Tags and Skill Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5">
        {currentPost.skill_related && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#00D285]/10 text-[#00D285] border border-[#00D285]/20">
            <i className="fa-solid fa-code text-[10px]" /> {currentPost.skill_related}
          </span>
        )}
        {currentPost.tags &&
          currentPost.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
            >
              #{tag}
            </span>
          ))}
      </div>

      {/* Interaction Bar (Reactions & Comments Toggle) */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Reaction Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Helpful Reaction */}
          <button
            type="button"
            onClick={() => handleReaction('helpful')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentPost.user_reactions.helpful
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Mark as Helpful"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Helpful</span>
            <span className="text-[11px] opacity-80">{currentPost.reaction_counts.helpful || 0}</span>
          </button>

          {/* Insightful Reaction */}
          <button
            type="button"
            onClick={() => handleReaction('insightful')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentPost.user_reactions.insightful
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Insightful problem or perspective"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Insightful</span>
            <span className="text-[11px] opacity-80">{currentPost.reaction_counts.insightful || 0}</span>
          </button>

          {/* Heart / Love */}
          <button
            type="button"
            onClick={() => handleReaction('heart')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentPost.user_reactions.heart
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Appreciate this discussion"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Heart</span>
            <span className="text-[11px] opacity-80">{currentPost.reaction_counts.heart || 0}</span>
          </button>

          {/* Like / Boost */}
          <button
            type="button"
            onClick={() => handleReaction('like')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentPost.user_reactions.like
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/20 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Inspiring / Upvote"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Boost</span>
            <span className="text-[11px] opacity-80">{currentPost.reaction_counts.like || 0}</span>
          </button>
        </div>

        {/* Toggle Comments Button */}
        <button
          onClick={toggleComments}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-[#00D285] dark:hover:text-[#00D285] hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-bold transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#00D285]" />
          <span>
            {currentPost.comment_count === 1
              ? '1 Solution / Comment'
              : `${currentPost.comment_count || 0} Solutions`}
          </span>
          {isCommentsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible Comments & Threaded Replies Section */}
      {isCommentsOpen && (
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
          {/* Quick Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2.5 items-center">
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt={user.full_name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#00D285]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#00D285] flex items-center justify-center text-xs font-bold">
                {user ? user.full_name[0].toUpperCase() : 'U'}
              </div>
            )}
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Suggest a solution, give feedback, or answer..."
              className="flex-1 px-4 py-2 text-xs rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D285]/40"
              disabled={submittingComment}
            />
            <button
              type="submit"
              disabled={submittingComment || !newCommentText.trim()}
              className="px-4 py-2 rounded-full bg-[#00D285] hover:bg-[#00ba76] disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Answer</span>
            </button>
          </form>

          {/* Comments List */}
          {loadingComments ? (
            <div className="py-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <div className="w-4 h-4 rounded-full border-2 border-[#00D285] border-t-transparent animate-spin" />
              <span>Loading solutions and discussions...</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              No solutions posted yet. Be the first to help this peer!
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Top-Level Comment */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {comment.author_image ? (
                          <img
                            src={comment.author_image}
                            alt={comment.author_name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-[#00D285] flex items-center justify-center text-[10px] font-bold">
                            {comment.author_name ? comment.author_name[0].toUpperCase() : 'U'}
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {comment.author_name}
                          </span>
                          <span className="text-[11px] text-slate-400 ml-1.5">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Comment Actions (Reactions & Delete) */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCommentReaction(comment.id, 'helpful')}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                            comment.user_reactions?.helpful
                              ? 'bg-emerald-500 text-white'
                              : 'text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          title="Mark solution as helpful"
                        >
                          <ThumbsUp className="w-2.5 h-2.5" />
                          <span>{comment.reaction_counts?.helpful || 0}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCommentReaction(comment.id, 'like')}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                            comment.user_reactions?.like
                              ? 'bg-violet-600 text-white'
                              : 'text-slate-500 hover:text-violet-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          title="Like this answer"
                        >
                          <Heart className="w-2.5 h-2.5" />
                          <span>{comment.reaction_counts?.like || 0}</span>
                        </button>

                        {/* Delete Comment Button for Author or Post Author */}
                        {canDeleteComment(comment.author_id) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={deletingCommentId === comment.id}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete this comment"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed pl-9 mb-2 font-normal">
                      {comment.content}
                    </p>

                    {/* Reply Action Trigger */}
                    <div className="pl-9 flex items-center gap-2">
                      <button
                        onClick={() =>
                          setReplyingToId(replyingToId === comment.id ? null : comment.id)
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#00D285] transition-colors cursor-pointer"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Inline Reply Input */}
                    {replyingToId === comment.id && (
                      <div className="mt-3 pl-9 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.author_name}...`}
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00D285]"
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          disabled={submittingReply || !replyText.trim()}
                          className="px-3 py-1.5 rounded-xl bg-[#00D285] text-white text-xs font-bold hover:bg-[#00ba76] disabled:opacity-50 cursor-pointer"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => setReplyingToId(null)}
                          className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Threaded Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-6 sm:pl-8 space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-4">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              {reply.author_image ? (
                                <img
                                  src={reply.author_image}
                                  alt={reply.author_name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-500 flex items-center justify-center text-[10px] font-bold">
                                  {reply.author_name ? reply.author_name[0].toUpperCase() : 'U'}
                                </div>
                              )}
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {reply.author_name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {formatDate(reply.created_at)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCommentReaction(reply.id, 'like')}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                                  reply.user_reactions?.like
                                    ? 'bg-rose-500 text-white'
                                    : 'text-slate-400 hover:text-rose-500'
                                }`}
                              >
                                <Heart className="w-2.5 h-2.5" />
                                <span>{reply.reaction_counts?.like || 0}</span>
                              </button>

                              {/* Delete Reply Button */}
                              {canDeleteComment(reply.author_id) && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(reply.id)}
                                  disabled={deletingCommentId === reply.id}
                                  className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                  title="Delete this reply"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed pl-8 font-normal">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
