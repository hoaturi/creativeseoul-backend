export const JOB_CATEGORIES = [
  {
    id: 1,
    name: 'Creative & Design',
    slug: 'creative-design',
  },
  {
    id: 2,
    name: 'Marketing',
    slug: 'marketing',
  },
  {
    id: 3,
    name: 'Content',
    slug: 'content',
  },
  {
    id: 4,
    name: 'Engineering',
    slug: 'engineering',
  },
  {
    id: 5,
    name: 'Product',
    slug: 'product',
  },
  {
    id: 6,
    name: 'Animation & 3D',
    slug: 'animation-3d',
  },
  {
    id: 7,
    name: 'Visual Media',
    slug: 'visual-media',
  },
  {
    id: 8,
    name: 'Data',
    slug: 'data',
  },
  {
    id: 9,
    name: 'Music & Sound',
    slug: 'music-sound',
  },
] as const;

export const VALID_JOB_CATEGORY_IDS = JOB_CATEGORIES.map(
  (category) => category.id,
);
