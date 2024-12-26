import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import { MemberLanguageRequestDto } from '../../features/member/dtos/member-language-request.dto';

export function HasUniqueLanguages(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'hasUniqueLanguages',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(languages: MemberLanguageRequestDto[]) {
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
