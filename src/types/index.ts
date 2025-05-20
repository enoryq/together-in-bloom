
export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  user_id: string;
  partner_id: string;
  status: 'pending' | 'active' | 'declined';
  connection_date: string | null;
  created_at: string;
  profile?: Profile;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface Milestone {
  id: string;
  user_id: string;
  title: string;
  date: string;
  description: string | null;
  type: 'anniversary' | 'birthday' | 'custom';
  is_recurring: boolean;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  duration_days: number;
  is_predefined: boolean;
  created_by: string | null;
  created_at: string;
  activities?: ChallengeActivity[];
}

export interface ChallengeActivity {
  id: string;
  challenge_id: string;
  day_number: number;
  title: string;
  description: string | null;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  start_date: string;
  current_day: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  created_at: string;
  challenge?: Challenge;
  progress?: UserChallengeProgress[];
}

export interface UserChallengeProgress {
  id: string;
  user_challenge_id: string;
  day_number: number;
  is_completed: boolean;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  activity?: ChallengeActivity;
}
