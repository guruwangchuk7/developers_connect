export type PostType = 'UPDATE' | 'HELP' | 'TEAM' | 'PROJECT' | 'DEVELOPER';

export interface FeedPost {
  id: string;
  userId: string;
  user: string;
  role: string;
  timestamp: string;
  content: string;
  type: PostType;
  likes: number;
  comments: number;
  tags: string[];
  avatar_url?: string;
  skills?: string[];
  created_at?: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  skills: string[];
  availability: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  type: PostType;
  content: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    role: string | null;
    avatar_url: string | null;
  };
}

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  venue: string | null;
  event_date: string;
  end_date: string | null;
  image_url: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export interface Connection {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  actor_id: string | null;
  content: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}
