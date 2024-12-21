export const EMPLOYMENT_TYPES = [
  {
    id: 1,
    name: 'Full time',
    slug: 'full-time',
  },
  {
    id: 2,
    name: 'Part time',
    slug: 'part-time',
  },
  {
    id: 3,
    name: 'Contract/Temp',
    slug: 'contract/Temp',
  },
  {
    id: 4,
    name: 'Freelance',
    slug: 'freelance',
  },
] as const;

export const VALID_EMPLOYMENT_TYPE_IDS = Object.values(EMPLOYMENT_TYPES).map(
  (type) => type.id,
);
