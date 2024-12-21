export const LANGUAGE_LEVELS = {
  BEGINNER: 1,
  CONVERSATIONAL: 2,
  BUSINESS: 3,
  FLUENT: 4,
  NATIVE: 5,
} as const;

export const VALID_LANGUAGE_LEVEL_IDS = Object.values(LANGUAGE_LEVELS);
