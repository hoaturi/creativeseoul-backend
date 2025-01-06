export const WORK_LOCATION_TYPES = [
  {
    id: 1,
    label: 'On-site',
  },
  {
    id: 2,
    label: 'Remote',
  },
  {
    id: 3,
    label: 'Hybrid',
  },
] as const;

export type WorkLocationType = (typeof WORK_LOCATION_TYPES)[number]['label'];
