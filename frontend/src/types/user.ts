export interface User {
  id: number;
  full_name: string;
  email: string;
  bio?: string;
  profile_image?: string | null;
  cover_image?: string | null;
  headline?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  phone?: string;
  is_verified?: boolean;
  rating?: number;
  review_count?: number;
  created_at?: string;
  skills_teach?: { id: number; skill_name: string; skill_type: string; proficiency_level?: string }[];
  skills_learn?: { id: number; skill_name: string; skill_type: string; proficiency_level?: string }[];
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
  email?: string;
}

export interface UserStats {
  skills_shared: number;
  skills_learned: number;
  active_sessions: number;
  total_reviews: number;
  average_rating: number;
  pending_proposals?: number;
}

export interface Review {
  id: number;
  reviewer_id: number;
  reviewed_id: number;
  rating: number;
  comment: string;
  skill_exchanged?: string;
  reviewer_name?: string;
  reviewer_image?: string | null;
  created_at: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  type: 'request_sent' | 'request_received' | 'request_accepted' | 'request_rejected' | 'session_scheduled' | 'session_completed' | 'message' | string;
  created_at: string;
}
