// Database Types
export interface Entry {
  id: string;
  title: string;
  category: string;
  file_url: string;
  file_type: 'image' | 'video' | 'audio' | 'website';
  prompt: string;
  tool_used: string;
  share_link: string | null;
  description: string;
  creator_name: string;
  creator_email?: string;
  creator_avatar?: string;
  creator_social?: string;
  user_id?: string | null;
  votes: number;
  is_featured: boolean;
  is_winner: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Vote {
  id: string;
  entry_id: string;
  device_hash: string;
  ip_address?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  created_at: string;
}

export interface HallOfFameEntry extends Entry {
  category_details: Category;
  award_title: string;
  award_date: string;
}

// Form Types
export interface SubmitFormData {
  title: string;
  category: string;
  file: File | null;
  prompt: string;
  tool_used: string;
  share_link: string;
  description: string;
  creator_name: string;
  creator_email: string;
  creator_social?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Filter Types
export interface GalleryFilters {
  category?: string;
  search?: string;
  sortBy?: 'votes' | 'created_at' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Leaderboard Types
export interface LeaderboardEntry extends Entry {
  rank: number;
  previousRank?: number;
  rankChange: 'up' | 'down' | 'same' | 'new';
}

// Component Props Types
export interface EntryCardProps {
  entry: Entry;
  onVote?: (entryId: string) => void;
  onView?: (entry: Entry) => void;
  showVoteButton?: boolean;
  className?: string;
}

export interface VoteButtonProps {
  entryId: string;
  initialVotes: number;
  hasVoted?: boolean;
  onVote?: (entryId: string, newVotes: number) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export interface LightboxModalProps {
  entry: Entry | null;
  isOpen: boolean;
  onClose: () => void;
  onVote?: (entryId: string) => void;
}

export interface MasonryGridProps {
  entries: Entry[];
  onEntryClick?: (entry: Entry) => void;
  onVote?: (entryId: string) => void;
  loading?: boolean;
}

// AI Tools
export type AITool =
  | 'ChatGPT'
  | 'DALL-E'
  | 'Midjourney'
  | 'Stable Diffusion'
  | 'Runway'
  | 'Gemini'
  | 'Claude'
  | 'V0'
  | 'Suno'
  | 'ElevenLabs'
  | 'Pika'
  | 'Udio'
  | 'Luma'
  | 'Other';

export const AI_TOOLS: { value: AITool; label: string; icon: string }[] = [
  { value: 'ChatGPT', label: 'ChatGPT', icon: '🤖' },
  { value: 'DALL-E', label: 'DALL-E', icon: '🎨' },
  { value: 'Midjourney', label: 'Midjourney', icon: '✨' },
  { value: 'Stable Diffusion', label: 'Stable Diffusion', icon: '🖼️' },
  { value: 'Runway', label: 'Runway', icon: '🎬' },
  { value: 'Gemini', label: 'Gemini', icon: '💎' },
  { value: 'Claude', label: 'Claude', icon: '🧠' },
  { value: 'V0', label: 'V0 (Vercel)', icon: '⚡' },
  { value: 'Suno', label: 'Suno', icon: '🎵' },
  { value: 'ElevenLabs', label: 'ElevenLabs', icon: '🎙️' },
  { value: 'Pika', label: 'Pika', icon: '📹' },
  { value: 'Udio', label: 'Udio', icon: '🎼' },
  { value: 'Luma', label: 'Luma', icon: '🌟' },
  { value: 'Other', label: 'Other', icon: '🔧' },
];

// File Type Categories
export const FILE_TYPE_CATEGORIES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
} as const;

export function getFileType(mimeType: string): Entry['file_type'] {
  if (FILE_TYPE_CATEGORIES.image.includes(mimeType as any)) return 'image';
  if (FILE_TYPE_CATEGORIES.video.includes(mimeType as any)) return 'video';
  if (FILE_TYPE_CATEGORIES.audio.includes(mimeType as any)) return 'audio';
  return 'website';
}
