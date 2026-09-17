export type SessionStatus = 'Upcoming' | 'Completed' | 'Cancelled' | 'scheduled' | 'completed' | 'cancelled';

export interface Session {
  id: number;
  request_id?: number;
  partner_id?: number;
  scheduled_at?: string;
  scheduled_time?: string;
  duration_minutes: number;
  meeting_link?: string;
  status: SessionStatus;
  created_at?: string;
  skill_name?: string;
  offered_skill?: string;
  requested_skill?: string;
  sender_id?: number;
  receiver_id?: number;
  sender_name?: string;
  receiver_name?: string;
  partner_name?: string;
  partner_image?: string | null;
  notes?: string;
}
