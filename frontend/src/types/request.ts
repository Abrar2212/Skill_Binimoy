export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled' | 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface ExchangeRequest {
  id: number;
  sender_id: number;
  receiver_id: number;
  offered_skill?: string;
  requested_skill?: string;
  offered_skill_name?: string;
  requested_skill_name?: string;
  message: string;
  status: RequestStatus;
  created_at: string;
  sender_name?: string;
  sender_image?: string | null;
  receiver_name?: string;
  receiver_image?: string | null;
  partner_name?: string;
  partner_image?: string | null;
  direction?: 'incoming' | 'outgoing';
}
