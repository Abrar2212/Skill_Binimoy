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
}
