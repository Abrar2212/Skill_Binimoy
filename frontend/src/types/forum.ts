export type ForumReactionType = 'helpful' | 'insightful' | 'heart' | 'like';
export type CommentReactionType = 'like' | 'helpful' | 'heart';

export interface ForumReactionCounts {
  helpful: number;
  insightful: number;
  heart: number;
  like: number;
}

export interface ForumPost {
  id: number;
  author_id: number;
  author_name: string;
  author_image: string | null;
  author_headline?: string;
  author_rating?: number;
  title: string;
  content: string;
  category: string;
  skill_related?: string;
  tags: string[];
  reactions: Record<string, number[]>;
  reaction_counts: ForumReactionCounts;
  user_reactions: Record<ForumReactionType, boolean>;
  total_reactions: number;
  comment_count: number;
  is_author?: boolean;
  created_at: string;
  updated_at?: string;
  ai_match?: {
    score: number;
    match_type: 'can_help' | 'learning' | 'explore' | 'none';
    reason: string | null;
  };
}

export interface ForumComment {
  id: number;
  post_id: number;
  author_id: number;
  author_name: string;
  author_image: string | null;
  author_headline?: string;
  content: string;
  parent_id: number | null;
  reactions: Record<string, number[]>;
  reaction_counts: {
    like: number;
    helpful: number;
    heart: number;
  };
  user_reactions: {
    like: boolean;
    helpful: boolean;
    heart: boolean;
  };
  is_author?: boolean;
  created_at: string;
  replies?: ForumComment[];
}

export interface CreateForumPostPayload {
  title: string;
  content: string;
  category: string;
  skill_related?: string;
  tags?: string[];
}
