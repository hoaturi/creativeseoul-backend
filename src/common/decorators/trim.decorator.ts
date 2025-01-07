import { Transform } from 'class-transformer';

export function Trim({ each = false }: { each?: boolean } = {}) {
  return Transform((params) => {
    const value = params.value;

    if (!value) {
      return value;
    }

    if (each) {
      return value.map((v: string) => v.trim());
    }

    return value.trim();
  });
}
