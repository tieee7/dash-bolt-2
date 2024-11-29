export interface ChatbotConfig {
  id: string;
  user_id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  avatar_url: string | null;
  welcome_message: string;
  position: 'left' | 'right';
  custom_css: string | null;
  operating_hours: OperatingHours[];
  response_delay: number;
  created_at: string;
  updated_at: string;
}

export interface OperatingHours {
  day: number;
  start: string;
  end: string;
  is_closed: boolean;
}

export interface DomainVerification {
  id: string;
  user_id: string;
  domain: string;
  verification_token: string;
  verified_at: string | null;
  created_at: string;
}

export interface ChatbotMessage {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: 'user' | 'bot';
  created_at: string;
}