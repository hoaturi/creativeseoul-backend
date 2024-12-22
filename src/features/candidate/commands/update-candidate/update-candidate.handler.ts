import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCandidateCommand } from './update-candidate.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { CustomException } from '../../../../common/exceptions/custom.exception';
import { UserErrorCode } from '../../../../domain/user/user-error-code.enum';
import { User, UserRole } from '../../../../domain/user/user.entity';
import { UpdateCandidateRequestDto } from '../../dtos/update-candidate-request.dto';
import { Logger } from '@nestjs/common';
import { Category } from '../../../../domain/common/entities/job-category.entity';
import { Candidate } from '../../../../domain/candidate/candidate.entity';
import { CandidateError } from '../../candidate.error';

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
      this.em.findOne(Candidate, { member: { user: userId } }),
    ]);

    if (!candidate) {
      return Result.failure(CandidateError.NotFound);
    }

    this.updateCandidate(candidate, dto);

    await this.em.flush();

    this.logger.log(
      {
        profileId: candidate.id,
      },
      'candidate.update-candidate.success: Candidate updated successfully',
    );

    return Result.success();
  }

  private async validateUser(userId: string): Promise<void> {
    const user = await this.em.findOne(User, userId);

    if (!user) {
      throw new CustomException(
        UserErrorCode.USER_NOT_FOUND,
        { userId },
        'candidate.update-candidate.failed: User not found',
      );
    }

    if (user.role !== UserRole.CANDIDATE) {
      throw new CustomException(
        UserErrorCode.INVALID_USER_ROLE,
        { userId, role: user.role },
        'candidate.update-candidate.failed: User is not a candidate',
      );
    }
  }

  private updateCandidate(
    candidate: Candidate,
    dto: UpdateCandidateRequestDto,
  ): void {
    const updates: Partial<Candidate> = {
      isOpenToWork: dto.isOpenToWork ?? candidate.isOpenToWork,
      seniority: dto.seniority,
      salaryRange: dto.salaryRange,
      hourlyRateRange: dto.hourlyRateRange,
      employmentTypes: dto.employmentTypes,
      locationTypes: dto.locationTypes,
      resumeUrl: dto.resumeUrl,
      isContactable: dto.isContactable ?? candidate.isContactable,
      email: dto.email,
      phone: dto.phone,
    };

    if (dto.jobCategoryIds) {
      const references = dto.jobCategoryIds.map((id) =>
        this.em.getReference(Category, id),
      );

      candidate.categories.set(references);
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        candidate[key] = value;
      }
    });
  }
}
