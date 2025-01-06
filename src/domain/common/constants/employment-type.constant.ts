export const EMPLOYMENT_TYPES = [
  {
    id: 1,
    label: 'Full time',
  },
  {
    id: 2,
    label: 'Part time',
  },
  {
    id: 3,
    label: 'Contract',
  },
  {
    id: 4,
    label: 'Internship',
  },
] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]['label'];
