export type CapsuleState = 
  | 'landing_window' 
  | 'landing_prompt'
  | 'zooming'
  | 'capsule_entry'
  | 'capsule_prompt' 
  | 'opened' 
  | 'ar_view'
  | 'time_travel'
  | 'dashboard';

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  userName: string;
  userAvatar: string;
  date: string;
  location: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  location: string;
  station: string;
  badge: string;
}
