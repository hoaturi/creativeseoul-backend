export const JOB_CATEGORIES = [
  {
    id: 1,
    name: 'Admin & Office',
    slug: 'admin-office',
  },
  {
    id: 2,
    name: 'Au Pair & Home Help',
    slug: 'au-pair-home-help',
  },
  {
    id: 3,
    name: 'Customer Service',
    slug: 'customer-service',
  },
  {
    id: 4,
    name: 'Digital & Creative',
    slug: 'digital-creative',
  },
  {
    id: 5,
    name: 'Events & Promotions',
    slug: 'events-promotions',
  },
  {
    id: 6,
    name: 'Food & Beverage',
    slug: 'food-beverage',
  },
  {
    id: 7,
    name: 'Healthcare',
    slug: 'healthcare',
  },
  {
    id: 8,
    name: 'Hospitality',
    slug: 'hospitality',
  },
  {
    id: 9,
    name: 'IT & Technology',
    slug: 'it-technology',
  },
  {
    id: 10,
    name: 'Labourer & Trades',
    slug: 'labourer-trades',
  },
  {
    id: 11,
    name: 'Retail & Sales',
    slug: 'retail-sales',
  },
  {
    id: 12,
    name: 'Teaching & Education',
    slug: 'teaching-education',
  },
  {
    id: 13,
    name: 'Tourism',
    slug: 'tourism',
  },
] as const;

export const VALID_JOB_CATEGORY_IDS = JOB_CATEGORIES.map(
  (category) => category.id,
);
