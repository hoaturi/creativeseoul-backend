export const SALARY_TYPES = [
  { id: 1, label: 'Hourly' },
  { id: 2, label: 'Monthly' },
  { id: 3, label: 'Yearly' },
] as const;

export type SalaryType = (typeof SALARY_TYPES)[number]['label'];
