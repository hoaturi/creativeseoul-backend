import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { LanguageDto } from '../../features/candidate/dtos/create-candidate-request.dto';

export function HasUniqueLanguages(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'hasUniqueLanguages',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(languages: LanguageDto[]) {
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
