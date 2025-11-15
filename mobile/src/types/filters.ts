// ══════════════════════════════════════════════════════════════
// Session Filters & Sorting Types
// Advanced filtering system for meditation sessions
// ══════════════════════════════════════════════════════════════

export type SortBy =
  | 'title'         // Alphabetical by title
  | 'duration'      // By session duration
  | 'level'         // By difficulty level
  | 'recent'        // Recently completed (requires user progress)
  | 'popular'       // Most completed (requires user progress)
  | 'recommended';  // AI-recommended based on history

export type SortOrder = 'asc' | 'desc';

export interface SessionFilters {
  // Text search
  searchQuery?: string;

  // Duration filters (in minutes)
  durations?: number[]; // e.g., [5, 10, 15, 20]
  durationRange?: {
    min?: number;
    max?: number;
  };

  // Difficulty levels
  levels?: number[]; // 1-5

  // Cultural traditions
  cultureTags?: string[]; // 'zen', 'vipassana', 'vedic', 'taoist', 'sufi', 'christian'

  // Purpose/category tags
  purposes?: string[]; // 'stress', 'sleep', 'focus', 'morning', 'anxiety', etc.

  // Special filters
  showFavoritesOnly?: boolean;
  showHiddenSessions?: boolean;
  showCustomSessionsOnly?: boolean;
  showCompletedOnly?: boolean;
  showUncompletedOnly?: boolean;

  // Instruction filters
  hasInstructions?: boolean;
  instructionTypes?: string[]; // specific instruction IDs

  // Sorting
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface FilterPreset {
  id: string;
  nameKey: string;          // i18n key
  descriptionKey: string;
  icon: string;
  filters: SessionFilters;
}

export interface AvailableFilters {
  durations: number[];
  levels: number[];
  cultureTags: Array<{
    tag: string;
    count: number;
    nameKey: string;
  }>;
  purposes: Array<{
    purpose: string;
    count: number;
    nameKey: string;
  }>;
}

// ══════════════════════════════════════════════════════════════
// Default Filter Presets
// ══════════════════════════════════════════════════════════════

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'quick_sessions',
    nameKey: 'filters.presets.quickSessions.name',
    descriptionKey: 'filters.presets.quickSessions.description',
    icon: '⚡',
    filters: {
      durationRange: { min: 5, max: 10 },
      sortBy: 'duration',
      sortOrder: 'asc',
    },
  },
  {
    id: 'deep_practice',
    nameKey: 'filters.presets.deepPractice.name',
    descriptionKey: 'filters.presets.deepPractice.description',
    icon: '🧘',
    filters: {
      durationRange: { min: 15, max: 20 },
      levels: [3, 4, 5],
      sortBy: 'level',
      sortOrder: 'desc',
    },
  },
  {
    id: 'beginner_friendly',
    nameKey: 'filters.presets.beginnerFriendly.name',
    descriptionKey: 'filters.presets.beginnerFriendly.description',
    icon: '🌱',
    filters: {
      levels: [1, 2],
      hasInstructions: true,
      sortBy: 'level',
      sortOrder: 'asc',
    },
  },
  {
    id: 'morning_routine',
    nameKey: 'filters.presets.morningRoutine.name',
    descriptionKey: 'filters.presets.morningRoutine.description',
    icon: '🌅',
    filters: {
      purposes: ['morning'],
      durationRange: { min: 5, max: 15 },
      sortBy: 'duration',
    },
  },
  {
    id: 'stress_relief',
    nameKey: 'filters.presets.stressRelief.name',
    descriptionKey: 'filters.presets.stressRelief.description',
    icon: '😌',
    filters: {
      purposes: ['stress'],
      sortBy: 'recommended',
    },
  },
  {
    id: 'sleep_preparation',
    nameKey: 'filters.presets.sleepPreparation.name',
    descriptionKey: 'filters.presets.sleepPreparation.description',
    icon: '🌙',
    filters: {
      purposes: ['sleep'],
      sortBy: 'duration',
      sortOrder: 'desc',
    },
  },
  {
    id: 'cultural_exploration',
    nameKey: 'filters.presets.culturalExploration.name',
    descriptionKey: 'filters.presets.culturalExploration.description',
    icon: '🌍',
    filters: {
      sortBy: 'title',
    },
  },
  {
    id: 'favorites',
    nameKey: 'filters.presets.favorites.name',
    descriptionKey: 'filters.presets.favorites.description',
    icon: '⭐',
    filters: {
      showFavoritesOnly: true,
      sortBy: 'recent',
    },
  },
];
