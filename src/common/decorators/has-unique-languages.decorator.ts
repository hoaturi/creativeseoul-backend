import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function HasUniqueLanguages(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'hasUniqueLanguages',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(languages: { languageId: number; level: number }[]) {
          if (!Array.isArray(languages)) return false;

          const languageIds = languages.map((lang) => lang.languageId);
          const uniqueIds = new Set(languageIds);

          return uniqueIds.size === languageIds.length;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} cannot contain duplicate languages`;
        },
      },
    });
  };
}
