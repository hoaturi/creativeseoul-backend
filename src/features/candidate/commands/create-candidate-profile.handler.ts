import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/postgresql';
import { CreateCandidateProfileCommand } from './create-candidate-profile.command';
import { WorkLocationType } from '../../../domain/common/entities/work-location-type.entity';
import { EmploymentType } from '../../../domain/common/entities/employment-type.entity';
import { Language } from '../../../domain/common/entities/language.entity';
import { Candidate } from '../../../domain/candidate/candidate.entity';
import { User, UserRole } from '../../../domain/user/user.entity';
import { JobCategory } from '../../../domain/common/entities/job-category.entity';
import { CandidateLanguage } from '../../../domain/candidate/candidate-language.entity';
import { Result } from '../../../common/result/result';
import { ResultError } from '../../../common/result/result-error';
import { CustomException } from '../../../common/exceptions/custom.exception';
import { CandidateErrorCode } from '../../../domain/candidate/candidate-error-code.enum';
import { UserErrorCode } from '../../../domain/user/user-error-code.enum';
import {
  CreateCandidateProfileRequestDto,
  LanguageDto,
} from '../dtos/create-candidate-profile-request.dto';
import { CandidateError } from '../candidate.error';
import { State } from '../../../domain/common/entities/state.entity';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateCandidateProfileCommand)
export class CreateCandidateProfileHandler
  implements ICommandHandler<CreateCandidateProfileCommand>
{
  private readonly logger = new Logger(CreateCandidateProfileHandler.name);

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: CreateCandidateProfileCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto, userId } = command;

    const user = await this.validateUser(userId);
    const hasExistingProfile = await this.checkExistingProfile(user);

    if (hasExistingProfile) {
      return Result.failure(CandidateError.ProfileAlreadyExists);
    }

    const preferences = await this.fetchPreferences(dto);
    const profile = await this.createProfile(user, dto);
    await this.attachPreferences(profile, preferences, dto);

    await this.em.flush();

    this.logger.log(
      { userId: user.id, profileId: profile.id },
      'candidate.create-candidate-profile.success: Candidate profile created successfully',
    );

    return Result.success();
  }

  private async validateUser(userId: string): Promise<User> {
    const user = await this.em.findOne(User, { id: userId });

    if (!user) {
      throw new CustomException(
        UserErrorCode.USER_NOT_FOUND,
        { userId },
        'candidate.create-candidate-profile.failed: User not found',
      );
    }

    if (user.role !== UserRole.CANDIDATE) {
      throw new CustomException(
        CandidateErrorCode.USER_IS_NOT_CANDIDATE,
        { userId: user.id },
        'candidate.create-candidate-profile.failed: User is not a candidate',
      );
    }

    return user;
  }

  private async checkExistingProfile(user: User): Promise<boolean> {
    const existingProfile = await this.em.findOne(
      Candidate,
      { user },
      { fields: ['id'] },
    );

    return !!existingProfile;
  }

  private async fetchPreferences(dto: CreateCandidateProfileRequestDto) {
    const uniqueCategories = [...new Set(dto.preferredCategories)];
    const uniqueLocations = [...new Set(dto.preferredWorkLocations)];
    const uniqueEmploymentTypes = [...new Set(dto.preferredEmploymentTypes)];
    const uniqueStates = [...new Set(dto.preferredStates)];

    const uniqueLanguages = Array.from(
      dto.languages
        .reduce((map, lang) => {
          map.set(lang.languageId, lang);
          return map;
        }, new Map<number, LanguageDto>())
        .values(),
    );

    const [categories, locations, employmentTypes, states, languages] =
      await Promise.all([
        this.em.find(JobCategory, { id: { $in: uniqueCategories } }),
        this.em.find(WorkLocationType, { id: { $in: uniqueLocations } }),
        this.em.find(EmploymentType, { id: { $in: uniqueEmploymentTypes } }),
        this.em.find(State, { id: { $in: uniqueStates } }),
        this.em.find(Language, {
          id: { $in: uniqueLanguages.map((lang) => lang.languageId) },
        }),
      ]);

    return { categories, locations, employmentTypes, states, languages };
  }

  private async createProfile(
    user: User,
    dto: CreateCandidateProfileRequestDto,
  ): Promise<Candidate> {
    return this.em.create(
      Candidate,
      new Candidate(
        user,
        dto.fullName,
        dto.title,
        dto.bio,
        dto.isAvailable,
        dto.profilePictureUrl,
        dto.resumeUrl,
      ),
    );
  }

  private async attachPreferences(
    profile: Candidate,
    preferences: {
      categories: JobCategory[];
      locations: WorkLocationType[];
      employmentTypes: EmploymentType[];
      states: State[];
      languages: Language[];
    },
    dto: CreateCandidateProfileRequestDto,
  ): Promise<void> {
    const { categories, locations, employmentTypes, states, languages } =
      preferences;

    profile.preferredCategories.add(categories);
    profile.preferredWorkLocations.add(locations);
    profile.preferredEmploymentTypes.add(employmentTypes);
    profile.preferredStates.add(states);

    const candidateLanguages = languages.map((language) => {
      const proficiency = dto.languages.find(
        (lang) => lang.languageId === language.id,
      )!.proficiency;
      return new CandidateLanguage(profile, language, proficiency);
    });

    profile.languages.add(candidateLanguages);
  }
}
