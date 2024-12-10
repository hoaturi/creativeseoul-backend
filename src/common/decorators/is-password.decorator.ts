import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// This regex matches only printable ASCII character
const VALID_PASSWORD_REGEX = /^[!-~]{8,}$/;

export function IsPassword(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName,
      options: {
        message:
          'Password must be at least 8 characters long and can only contain letters, numbers, and common special characters',
        ...validationOptions,
      },
      validator: IsPasswordConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsPassword' })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  public validate(value: any, _: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }
    return VALID_PASSWORD_REGEX.test(value);
  }
}
