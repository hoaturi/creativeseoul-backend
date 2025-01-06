export const HOURLY_RATE_RANGE = [
  { id: 1, label: '₩0 - ₩10K' },
  { id: 2, label: '₩10K - ₩20K' },
  { id: 3, label: '₩20K - ₩35K' },
  { id: 4, label: '₩35K - ₩50K' },
  { id: 5, label: '₩50K - ₩65K' },
  { id: 6, label: '₩65K+' },
] as const;

export type HourlyRateRange = (typeof HOURLY_RATE_RANGE)[number]['label'];
