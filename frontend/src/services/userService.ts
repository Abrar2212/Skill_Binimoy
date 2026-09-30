import { api } from './api';
import { User, UserStats, ActivityItem, Review } from '../types/user';
import { Skill, TrendingSkill, MarketplaceUser, TradePost } from '../types/skill';

export const userService = {
  async getProfile(): Promise<{ user: User; skills: Skill[]; stats: UserStats }> {
    try {
      const response = await api.get('/profile');
      const u = response.data.user;
      const backendStats = response.data.stats;

      const rawSkills: Skill[] = [
        ...(u.skills_teach || []).map((s: any, idx: number) => ({
          id: s.id ?? `teach-${idx}`,
          skill_name: s.skill_name,
          skill_type: 'teach' as const,
          proficiency_level: 'Expert' as const,
        })),
        ...(u.skills_learn || []).map((s: any, idx: number) => ({
          id: s.id ?? `learn-${idx}`,
          skill_name: s.skill_name,
          skill_type: 'learn' as const,
          proficiency_level: 'Beginner' as const,
        })),
      ];

      // Deduplicate skills by combination of id and type
      const seenSkillKeys = new Set<string>();
      const skills: Skill[] = [];
      for (const sk of rawSkills) {
        const key = `${sk.skill_type}-${sk.id}`;
        if (!seenSkillKeys.has(key)) {
          seenSkillKeys.add(key);
          skills.push(sk);
        }
      }

      const stats: UserStats = {
        skills_shared: backendStats?.skills_shared ?? (u.skills_teach || []).length,
        skills_learned: backendStats?.skills_learned ?? (u.skills_learn || []).length,
        active_sessions: backendStats?.active_sessions ?? 0,
        total_reviews: backendStats?.total_reviews ?? (u.review_count || 0),
        average_rating: backendStats?.average_rating ?? (u.rating || 5.0),
        pending_proposals: backendStats?.pending_proposals ?? 0,
      };

      return { user: u, skills, stats };
    } catch (err) {
      let localUser: User = {
        id: 1,
        full_name: 'Member',
        email: 'user@skillbinimoy.com',
        rating: 5.0,
        review_count: 0,
      };

      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          localUser = { ...localUser, ...JSON.parse(stored) };
        }
      } catch {}

      return {
        user: localUser,
        skills: [],
        stats: {
          skills_shared: 0,
          skills_learned: 0,
          active_sessions: 0,
          total_reviews: localUser.review_count || 0,
          average_rating: localUser.rating || 5.0,
          pending_proposals: 0,
        },
      };
    }
  },

  async updateProfile(data: Partial<User>): Promise<{ message: string; user: User }> {
    const response = await api.put('/profile', data);
    if (response.data.user) {
      try {
        const stored = localStorage.getItem('user');
        const prev = stored ? JSON.parse(stored) : {};
        localStorage.setItem('user', JSON.stringify({ ...prev, ...response.data.user }));
      } catch {}
    }
    return response.data;
  },

  async getTrendingSkills(): Promise<TrendingSkill[]> {
    const response = await api.get('/skills/trending');
    return response.data.trending || [];
  },

  async getAllUsers(): Promise<MarketplaceUser[]> {
    const response = await api.get('/all');
    return response.data.users || [];
  },

  async getTradePosts(): Promise<{ posts: TradePost[]; my_profile_ready: boolean }> {
    const response = await api.get('/trade-posts');
    return {
      posts: response.data.posts || [],
      my_profile_ready: Boolean(response.data.my_profile_ready),
    };
  },

  async createTradePost(postData: {
    title: string;
    offered_skill: string;
    requested_skill: string;
    description?: string;
    availability?: string;
  }): Promise<{ message: string; post: TradePost }> {
    const response = await api.post('/trade-posts', postData);
    return response.data;
  },

  async deleteTradePost(id: number | string): Promise<{ message: string }> {
    const response = await api.delete(`/trade-posts/${id}`);
    return response.data;
  },

  async addSkill(skill: Omit<Skill, 'id'>): Promise<{ message: string; skill: Skill }> {
    const backendType = (skill.skill_type === 'offered' || skill.skill_type === 'teach') ? 'teach' : 'learn';
    const response = await api.post('/skills', {
      skill_name: skill.skill_name,
      skill_type: backendType,
    });
    return {
      message: response.data.message,
      skill: response.data.skill,
    };
  },

  async deleteSkill(id: string | number): Promise<{ message: string }> {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },

  async getActivityFeed(): Promise<ActivityItem[]> {
    try {
      const response = await api.get('/activity');
      return response.data.activities || [];
    } catch {
      return [];
    }
  },

  async getReviews(userId: number | string): Promise<Review[]> {
    const response = await api.get(`/reviews/${userId}`);
    return response.data.reviews || [];
  },

  async addReview(data: {
    reviewed_id: number;
    rating: number;
    comment?: string;
    skill_exchanged?: string;
  }): Promise<{ message: string; review: Review }> {
    const response = await api.post('/reviews', data);
    return response.data;
  },
};
