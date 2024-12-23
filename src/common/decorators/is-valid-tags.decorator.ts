import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidTags(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidTags',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string[], _: ValidationArguments) {
          // Tag must start with a letter and can contain letters, numbers,
          // dots, and special characters (#,+). Length must be between 3-32 characters
          const TAG_PATTERN = /^[a-zA-Z][a-zA-Z0-9.#+]{2,31}$/;

          return (
            Array.isArray(value) && value.every((tag) => TAG_PATTERN.test(tag))
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of valid tags. Each tag must:
- Start with a letter
- Be between 3 and 32 characters long
- Only contain letters, numbers, dots (.), hash (#), or plus (+)`;
        },
      },
    });
  };
}
