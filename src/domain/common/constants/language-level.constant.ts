export const LANGUAGE_LEVELS = [
  { id: 1, label: 'None' },
  { id: 2, label: 'Basic' },
  { id: 3, label: 'Intermediate' },
  { id: 4, label: 'Advanced' },
  { id: 5, label: 'Fluent' },
] as const;

export type LanguageLevel = (typeof LANGUAGE_LEVELS)[number]['label'];
