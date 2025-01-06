export const SENIORITY_LEVELS = [
  { id: 1, label: 'Intern' },
  { id: 2, label: 'Junior' },
  { id: 3, label: 'Mid' },
  { id: 4, label: 'Senior' },
  { id: 5, label: 'Lead' },
  { id: 6, label: 'Manager' },
] as const;

export type SeniorityLevel = (typeof SENIORITY_LEVELS)[number]['label'];
