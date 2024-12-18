export const WORK_LOCATION_TYPES = [
  {
    id: 1,
    name: 'On-site',
    slug: 'on-site',
  },
  {
    id: 2,
    name: 'Remote',
    slug: 'remote',
  },
  {
    id: 3,
    name: 'Hybrid',
    slug: 'hybrid',
  },
] as const;

export const VALID_WORK_LOCATION_TYPE_IDS = WORK_LOCATION_TYPES.map(
  (type) => type.id,
);
