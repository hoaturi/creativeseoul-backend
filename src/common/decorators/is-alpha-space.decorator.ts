import { registerDecorator } from 'class-validator';

export function IsAlphaSpace() {
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
          return /^[A-Za-z ]+$/.test(value);
        },
      },
    });
  };
}
