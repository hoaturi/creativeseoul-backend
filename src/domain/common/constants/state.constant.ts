export const STATES = [
  {
    id: 1,
    name: 'Seoul',
    slug: 'seoul',
  },
  {
    id: 2,
    name: 'Busan',
    slug: 'busan',
  },
  {
    id: 3,
    name: 'Incheon',
    slug: 'incheon',
  },
  {
    id: 4,
    name: 'Daegu',
    slug: 'daegu',
  },
  {
    id: 5,
    name: 'Gwangju',
    slug: 'gwangju',
  },
  {
    id: 6,
    name: 'Daejeon',
    slug: 'daejeon',
  },
  {
    id: 7,
    name: 'Ulsan',
    slug: 'ulsan',
  },
  {
    id: 8,
    name: 'Sejong',
    slug: 'sejong',
  },
  {
    id: 9,
    name: 'Gyeonggi',
    slug: 'gyeonggi',
  },
  {
    id: 10,
    name: 'Gangwon',
    slug: 'gangwon',
  },
  {
    id: 11,
    name: 'Chungbuk',
    slug: 'chungbuk',
  },
  {
    id: 12,
    name: 'Chungnam',
    slug: 'chungnam',
  },
  {
    id: 13,
    name: 'Gyeongbuk',
    slug: 'gyeongbuk',
  },
  {
    id: 14,
    name: 'Gyeongnam',
    slug: 'gyeongnam',
  },
  {
    id: 15,
    name: 'Jeonbuk',
    slug: 'jeonbuk',
  },
  {
    id: 16,
    name: 'Jeonnam',
    slug: 'jeonnam',
  },
  {
    id: 17,
    name: 'Jeju',
    slug: 'jeju',
  },
] as const;

export const VALID_STATE_IDS = STATES.map((location) => location.id);
