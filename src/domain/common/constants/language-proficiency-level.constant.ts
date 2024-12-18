export const LANGUAGE_PROFICIENCY_LEVELS = {
  BASIC: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  NATIVE: 4,
} as const;

export const VALID_LANGUAGE_PROFICIENCY_LEVEL_IDS = Object.values(
  LANGUAGE_PROFICIENCY_LEVELS,
);
