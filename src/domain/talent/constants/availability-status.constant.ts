export const enum AvailabilityStatusId {
  NOT_LOOKING = 1,
  LOOKING = 2,
  OPEN_TO_OPPORTUNITIES = 3,
}

export const AVAILABILITY_STATUS = [
  { id: AvailabilityStatusId.NOT_LOOKING, label: 'Not looking for work' },
  { id: AvailabilityStatusId.LOOKING, label: 'Looking for work' },
  {
    id: AvailabilityStatusId.OPEN_TO_OPPORTUNITIES,
    label: 'Open to new opportunities',
  },
] as const;
