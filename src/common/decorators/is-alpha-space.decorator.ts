import { registerDecorator } from 'class-validator';

export function IsAlphaSpace({
  allowEmpty = false,
}: { allowEmpty?: boolean } = {}) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isAlphaSpace',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must contain only letters and spaces`,
      },
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' &&
            ((allowEmpty && value === '') || /^[A-Za-z ]+$/.test(value))
          );
        },
      },
    });
  };
}
