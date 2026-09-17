export interface ChatMessage {
  id: string | number;
  sender_id: number;
  receiver_id?: number;
  message: string;
  is_read?: boolean;
  created_at?: string;
  timestamp?: string;
  sender_name?: string;
}

export interface ChatFriend {
  id: number;
  full_name: string;
  profile_image?: string | null;
  online?: boolean;
  last_message?: string;
  last_message_time?: string;
  unread?: number;
  unread_count?: number;
}
