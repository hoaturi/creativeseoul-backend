import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateJobPreferencesCommand } from './update-job-preferences.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { Talent } from '../../../../domain/talent/entities/talent.entity';
import { TalentError } from '../../talent.error';
import { ExperienceLevel } from '../../../../domain/job/entities/experience-level.entity';
import { WorkLocationType } from '../../../../domain/common/entities/work-location-type.entity';
import { SalaryRange } from '../../../../domain/talent/entities/salary-range.entity';
import { HourlyRateRange } from '../../../../domain/talent/entities/hourly-rate-range.entity';
import { EmploymentType } from '../../../../domain/common/entities/employment-type.entity';

@CommandHandler(UpdateJobPreferencesCommand)
export class UpdateJobPreferencesHandler
  implements ICommandHandler<UpdateJobPreferencesCommand>
{
  public constructor(private readonly em: EntityManager) {}

  public async execute(
    command: UpdateJobPreferencesCommand,
  ): Promise<Result<void, ResultError>> {
    const { user, dto } = command;

    return this.em.transactional(async (em) => {
      // First check if talent exists
      const talent = await em.findOne(
        Talent,
        { id: user.profile.id },
        {
          fields: ['id', 'employmentTypes', 'workLocationTypes'],
        },
      );
      if (!talent) {
        return Result.failure(TalentError.ProfileNotFound);
      }

      // Update the direct fields using nativeUpdate
      await em.nativeUpdate(
        Talent,
        { id: user.profile.id },
        {
          isAvailable: dto.isAvailable,
          isContactable: dto.isContactable,
          requiresVisaSponsorship: dto.requiresVisaSponsorship,
          email: dto.email,
          phone: dto.phone,
          experienceLevel: dto.experienceLevelId
            ? em.getReference(ExperienceLevel, dto.experienceLevelId)
            : null,
          salaryRange: dto.salaryRangeId
            ? em.getReference(SalaryRange, dto.salaryRangeId)
            : null,
          hourlyRateRange: dto.hourlyRateRangeId
            ? em.getReference(HourlyRateRange, dto.hourlyRateRangeId)
            : null,
        },
      );

      // Handle many-to-many relationships separately
      if (talent) {
        // Update work location types
        const workLocationTypes = dto.workLocationTypeIds.map((id) =>
          em.getReference(WorkLocationType, id),
        );
        talent.workLocationTypes.set(workLocationTypes);

        // Update employment types
        const employmentTypes = dto.employmentTypeIds.map((id) =>
          em.getReference(EmploymentType, id),
        );
        talent.employmentTypes.set(employmentTypes);
      }

      await em.flush();

      return Result.success();
    });
  }
}
