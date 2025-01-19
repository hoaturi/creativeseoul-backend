import { Transform } from 'class-transformer';

export function ToLowerCase(options?: { each?: boolean }): PropertyDecorator {
  return Transform(({ value }) => {
    const transform = (str: string): string | string[] => str.toLowerCase();

    if (Array.isArray(value)) {
      return value.map(transform);
    }

    if (options?.each && typeof value === 'string') {
      return transform(value);
    }

    return value;
  });
}
