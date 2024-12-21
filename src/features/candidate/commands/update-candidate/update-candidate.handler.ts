import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCandidateCommand } from './update-candidate.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { Logger } from '@nestjs/common';
import { CustomException } from '../../../../common/exceptions/custom.exception';
import { UserErrorCode } from '../../../../domain/user/user-error-code.enum';
import { User, UserRole } from '../../../../domain/user/user.entity';
import { CandidateErrorCode } from '../../../../domain/candidate/candidate-error-code.enum';
import { Candidate } from '../../../../domain/candidate/candidate.entity';
import { CandidateError } from '../../candidate.error';
import { LanguageDto } from '../../dtos/create-candidate-request.dto';
import { Language } from '../../../../domain/common/entities/language.entity';
import { CandidateLanguage } from '../../../../domain/candidate/candidate-language.entity';
import { UpdateCandidateRequestDto } from '../../dtos/update-candidate-request.dto';
import { JobCategory } from '../../../../domain/common/entities/job-category.entity';
import { WorkLocationType } from '../../../../domain/common/entities/work-location-type.entity';
import { State } from '../../../../domain/common/entities/state.entity';
import { EmploymentType } from '../../../../domain/common/entities/employment-type.entity';

@CommandHandler(UpdateCandidateCommand)
export class UpdateCandidateHandler
  implements ICommandHandler<UpdateCandidateCommand>
{
  private readonly logger = new Logger(UpdateCandidateHandler.name);

  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: UpdateCandidateCommand,
  ): Promise<Result<void, ResultError>> {
    const { dto, userId } = command;

    const [, candidate] = await Promise.all([
      this.validateUser(userId),
      this.findCandidate(userId),
    ]);

    if (!candidate) {
      return Result.failure(CandidateError.ProfileNotFound);
    }

    this.updateBasicInfo(candidate, dto);
    this.updatePreferences(candidate, dto);
    this.updateLanguages(candidate, dto.languages);

    await this.em.flush();

    this.logger.log(
      {
        profileId: candidate.id,
      },
      'candidate.update-candidate-profile.success: Candidate profile updated successfully',
    );

    return Result.success();
  }

  private async validateUser(userId: string): Promise<void> {
    const user = await this.em.findOne(User, { id: userId });

    if (!user) {
      throw new CustomException(
        UserErrorCode.USER_NOT_FOUND,
        { userId },
        'candidate.update-candidate-profile.failed: User not found',
      );
    }

    if (user.role !== UserRole.CANDIDATE) {
      throw new CustomException(
        CandidateErrorCode.USER_IS_NOT_CANDIDATE,
        { userId: user.id, userRole: user.role },
        'candidate.update-candidate-profile.failed: User is not a candidate',
      );
    }
  }

  private async findCandidate(userId: string): Promise<Candidate | null> {
    return this.em.findOne(
      Candidate,
      { user: userId },
      {
        populate: [
          'languages',
          'preferredCategories',
          'preferredWorkLocationTypes',
          'preferredStates',
          'preferredEmploymentTypes',
        ],
      },
    );
  }

  private updateBasicInfo(
    candidate: Candidate,
    dto: UpdateCandidateRequestDto,
  ): void {
    const profileUpdates: Partial<Candidate> = {
      fullName: dto.fullName,
      title: dto.title,
      bio: dto.bio,
      isAvailable: dto.isAvailable,
      profilePictureUrl: dto.profilePictureUrl,
      resumeUrl: dto.resumeUrl,
    };

    Object.entries(profileUpdates).forEach(([key, value]) => {
      if (value !== undefined) {
        candidate[key] = value;
      }
    });
  }

  private updatePreferences(
    candidate: Candidate,
    dto: UpdateCandidateRequestDto,
  ): void {
    const preferenceUpdates = [
      {
        collection: candidate.preferredCategories,
        ids: dto.preferredCategoryIds,
        entity: JobCategory,
      },
      {
        collection: candidate.preferredWorkLocationTypes,
        ids: dto.preferredWorkLocationTypeIds,
        entity: WorkLocationType,
      },
      {
        collection: candidate.preferredStates,
        ids: dto.preferredStateIds,
        entity: State,
      },
      {
        collection: candidate.preferredEmploymentTypes,
        ids: dto.preferredEmploymentTypeIds,
        entity: EmploymentType,
      },
    ];

    preferenceUpdates.map(({ collection, ids, entity }) => {
      if (!ids) return;

      const references = ids.map((id) => {
        return this.em.getReference(entity, id);
      });

      collection.set(references);
    });
  }

  private updateLanguages(
    candidate: Candidate,
    languagesDto: LanguageDto[] = [],
  ): void {
    if (!languagesDto.length) {
      return;
    }

    const candidateLanguages = languagesDto.map((lang) => {
      const languageRef = this.em.getReference(Language, lang.languageId);

      const candidateLanguage = new CandidateLanguage(
        candidate,
        languageRef,
        lang.level,
      );

      return this.em.create(CandidateLanguage, candidateLanguage);
    });

    candidate.languages.set(candidateLanguages);
  }
}
