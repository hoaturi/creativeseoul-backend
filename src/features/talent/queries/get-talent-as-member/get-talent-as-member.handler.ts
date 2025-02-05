import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTalentAsMemberQuery } from './get-talent-as-member.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GetTalentAsMemberResponseDto } from '../../dtos/responses/get-talent-as-member-response.dto';
import { Talent } from '../../../../domain/talent/entities/talent.entity';
import { EntityManager, Loaded } from '@mikro-orm/postgresql';
import { TalentLocationDto } from '../../dtos/responses/talent-location.dto';
import { TalentSocialLinksDto } from '../../dtos/responses/talent-social-links.dto';
import { TalentLanguageDto } from '../../dtos/responses/talent-language.dto';
import { CompanyError } from '../../../company/company.error';

const TALENT_FIELDS = [
  'handle',
  'fullName',
  'title',
  'bio',
  'city.label',
  'country.label',
  'languages.language.label',
  'languages.level.label',
  'avatarUrl',
  'socialLinks',
] as const;

type TalentFields = (typeof TALENT_FIELDS)[number];
type LoadedTalent = Loaded<Talent, never, TalentFields>;

@QueryHandler(GetTalentAsMemberQuery)
export class GetTalentAsMemberHandler
  implements IQueryHandler<GetTalentAsMemberQuery>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    query: GetTalentAsMemberQuery,
  ): Promise<Result<GetTalentAsMemberResponseDto, ResultError>> {
    const { handle } = query;

    const talent = await this.em.findOne(
      Talent,
      { handle },
      {
        fields: TALENT_FIELDS,
      },
    );

    if (!talent) {
      return Result.failure(CompanyError.ProfileNotFound);
    }

    const response = this.mapToResponseDto(talent);
    return Result.success(response);
  }

  private mapToResponseDto(talent: LoadedTalent): GetTalentAsMemberResponseDto {
    const location = new TalentLocationDto(
      talent.country.label,
      talent.city?.label,
    );

    const socialLinks = new TalentSocialLinksDto(talent.socialLinks);

    const languages = talent.languages.getItems().map((language) => {
      return new TalentLanguageDto(
        language.language.label,
        language.level.label,
      );
    });

    return new GetTalentAsMemberResponseDto(
      talent.handle,
      talent.fullName,
      talent.title,
      talent.bio,
      location,
      languages,
      talent.avatarUrl,
      socialLinks,
    );
  }
}
