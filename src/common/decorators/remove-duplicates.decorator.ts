import { Transform } from 'class-transformer';

export function RemoveDuplicates() {
  return Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return value;
    }
    return [...new Set(value)];
  });
}
