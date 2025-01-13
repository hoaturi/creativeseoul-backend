import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTalentAsMemberQuery } from './get-talent-as-member.query';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GetTalentAsMemberResponseDto } from '../../dtos/responses/get-talent-as-member-response.dto';
import { Talent } from '../../../../domain/talent/talent.entity';
import { EntityManager, Loaded } from '@mikro-orm/postgresql';
import { TalentLocationDto } from '../../dtos/responses/talent-location.dto';
import { TalentSocialLinksDto } from '../../dtos/responses/talent-social-links.dto';
import { TalentLanguageProficiencyDto } from '../../dtos/responses/talent-language-proficiency.dto';
import { CompanyError } from '../../../company/company.error';
import { UserRole } from '../../../../domain/user/user-role.enum';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

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
  'isPublic',
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
    const { user, handle } = query;

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

    if (!this.hasPermission(talent, user)) {
      return Result.failure(CompanyError.ProfileNotFound);
    }

    const response = this.mapToResponseDto(talent);
    return Result.success(response);
  }

  private hasPermission(
    talent: LoadedTalent,
    user?: AuthenticatedUser,
  ): boolean {
    const isOwner = user?.profileId === talent.id;
    return talent.isPublic || isOwner || user?.role === UserRole.ADMIN;
  }

  private mapToResponseDto(talent: LoadedTalent): GetTalentAsMemberResponseDto {
    const location = new TalentLocationDto(
      talent.country.label,
      talent.city.label,
    );

    const socialLinks = new TalentSocialLinksDto(talent.socialLinks);

    const languages = talent.languages.getItems().map((language) => {
      return new TalentLanguageProficiencyDto(
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
