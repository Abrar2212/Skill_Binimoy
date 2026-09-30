import { api } from './api';
import {
  ForumPost,
  ForumComment,
  CreateForumPostPayload,
  ForumReactionType,
  CommentReactionType,
} from '../types/forum';

export const forumService = {
  async getPosts(params?: {
    category?: string;
    search?: string;
    sort?: string;
    author_id?: number;
  }): Promise<{ posts: ForumPost[]; total: number }> {
    try {
      const response = await api.get('/forum/posts', { params });
      return response.data || { posts: [], total: 0 };
    } catch (err) {
      console.warn('Failed to fetch forum posts:', err);
      return { posts: [], total: 0 };
    }
  },

  async getPostById(id: number): Promise<ForumPost | null> {
    try {
      const response = await api.get(`/forum/posts/${id}`);
      return response.data?.post || null;
    } catch (err) {
      console.warn('Failed to fetch post details:', err);
      return null;
    }
  },

  async createPost(payload: CreateForumPostPayload): Promise<{ message: string; post: ForumPost }> {
    const response = await api.post('/forum/posts', payload);
    return response.data;
  },

  async deletePost(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/forum/posts/${id}`);
    return response.data;
  },

  async reactToPost(
    id: number,
    reaction_type: ForumReactionType
  ): Promise<{
    message: string;
    reaction_type: ForumReactionType;
    user_reacted: boolean;
    reaction_counts: { helpful: number; insightful: number; heart: number; like: number };
  }> {
    const response = await api.post(`/forum/posts/${id}/react`, { reaction_type });
    return response.data;
  },

  async getComments(postId: number): Promise<ForumComment[]> {
    try {
      const response = await api.get(`/forum/posts/${postId}/comments`);
      return response.data?.comments || [];
    } catch (err) {
      console.warn('Failed to fetch comments:', err);
      return [];
    }
  },

  async addComment(
    postId: number,
    content: string,
    parent_id?: number | null
  ): Promise<{ message: string; comment: ForumComment }> {
    const response = await api.post(`/forum/posts/${postId}/comments`, {
      content,
      parent_id: parent_id || null,
    });
    return response.data;
  },

  async deleteComment(
    commentId: number
  ): Promise<{ message: string; deleted_id: number; post_id: number }> {
    const response = await api.delete(`/forum/comments/${commentId}`);
    return response.data;
  },

  async reactToComment(
    commentId: number,
    reaction_type: CommentReactionType
  ): Promise<{
    message: string;
    reaction_type: CommentReactionType;
    user_reacted: boolean;
    reaction_counts: { like: number; helpful: number; heart: number };
  }> {
    const response = await api.post(`/forum/comments/${commentId}/react`, { reaction_type });
    return response.data;
  },

  async getUserPosts(userId: number): Promise<ForumPost[]> {
    try {
      const response = await api.get(`/forum/user-posts/${userId}`);
      return response.data?.posts || [];
    } catch (err) {
      console.warn('Failed to fetch user forum posts:', err);
      return [];
    }
  },
};
