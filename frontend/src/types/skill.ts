export type SkillType = 'teach' | 'learn' | 'offered' | 'wanted';
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Skill {
  id: number | string;
  user_id?: number;
  skill_name: string;
  skill_type: SkillType;
  proficiency_level?: ProficiencyLevel;
  category?: string;
}

export interface TrendingSkill {
  id?: string | number;
  skill_name?: string;
  name?: string;
  category?: string;
  total_count?: number;
  teach_count?: number;
  learn_count?: number;
  learners_count?: number;
  teachers_count?: number;
}

export interface AIMatchInfo {
  score: number;
  match_type: string;
  is_reciprocal: boolean;
  can_teach_me?: string[];
  wants_from_me?: string[];
  reason?: string | null;
}

export interface TradePost {
  id: number;
  user_id: number;
  title: string;
  offered_skill: string;
  requested_skill: string;
  description?: string;
  availability?: string;
  status: 'Open' | 'Closed';
  created_at: string;
  user_name: string;
  user_image?: string | null;
  user_rating?: number;
  user_headline?: string;
  user_review_count?: number;
  is_own_post?: boolean;
  ai_match?: AIMatchInfo;
}

export interface MarketplaceUser {
  id: number;
  full_name: string;
  email: string;
  profile_image?: string | null;
  bio?: string;
  rating?: number;
  review_count?: number;
  skills_teach?: string[];
  skills_learn?: string[];
  skills_offered?: (string | Skill)[];
  skills_wanted?: (string | Skill)[];
  ai_match?: AIMatchInfo;
}
