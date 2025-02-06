import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  EMPLOYMENT_TYPES,
  LANGUAGE_LEVELS,
  LANGUAGES,
  WORK_LOCATION_TYPES,
} from '../../domain/common/constants';
import { Language } from '../../domain/common/entities/language.entity';
import { Country } from '../../domain/common/entities/country.entity';
import { CATEGORIES } from '../../domain/job/constants/category.constant';
import { Category } from '../../domain/job/entities/category.entity';
import slugify from 'slugify';
import { SalaryRange } from '../../domain/talent/entities/salary-range.entity';
import { HourlyRateRange } from '../../domain/talent/entities/hourly-rate-range.entity';
import { WorkLocationType } from '../../domain/common/entities/work-location-type.entity';
import { EmploymentType } from '../../domain/common/entities/employment-type.entity';
import { LanguageLevel } from '../../domain/common/entities/language-level.entity';
import { CompanySize } from '../../domain/company/entities/company-size.entity';
import { COMPANY_SIZES } from '../../domain/company/company-size.constant';
import { COUNTRIES } from '../../domain/common/constants/country.constant';
import { SALARY_RANGE } from '../../domain/talent/constants/salary-range.constant';
import { HOURLY_RATE_RANGE } from '../../domain/talent/constants/hourly-rate-range.constant';
import { EXPERIENCE_LEVELS } from '../../domain/job/constants/experience-level.constant';
import { EventType } from '../../domain/event/event-type.entity';
import { EVENT_TYPE } from '../../domain/event/event-type.constant';
import { ExperienceLevel } from '../../domain/job/entities/experience-level.entity';
import { AvailabilityStatus } from '../../domain/talent/entities/availability-status.entity';
import { AVAILABILITY_STATUS } from '../../domain/talent/constants/availability-status.constant';

interface BaseEntity {
  id: number;
  label: string;
  slug: string;
}

interface SeedData {
  id: number;
  label: string;
}

export class BaseSeeder extends Seeder {
  public async run(em: EntityManager): Promise<void> {
    async function seedMissingEntities<T extends BaseEntity>(
      entityClass: new (...args: any[]) => T,
      data: ReadonlyArray<SeedData>,
      constructor: new (id: number, label: string, slug: string) => T,
      entityName: string,
    ): Promise<void> {
      let added = 0;

      for (const item of data) {
        const existing = await em.findOne(entityClass, { id: item.id });

        if (!existing) {
          const slug = slugify(item.label, { lower: true });
          em.create(entityClass, new constructor(item.id, item.label, slug));
          added++;
        }
      }

      console.log(`${entityName}: ${added} new records added`);
    }

    await seedMissingEntities(Language, LANGUAGES, Language, 'Languages');
    await seedMissingEntities(Country, COUNTRIES, Country, 'Countries');
    await seedMissingEntities(Category, CATEGORIES, Category, 'Categories');
    await seedMissingEntities(
      SalaryRange,
      SALARY_RANGE,
      SalaryRange,
      'SalaryRange',
    );
    await seedMissingEntities(
      HourlyRateRange,
      HOURLY_RATE_RANGE,
      HourlyRateRange,
      'HourlyRateRange',
    );
    await seedMissingEntities(
      WorkLocationType,
      WORK_LOCATION_TYPES,
      WorkLocationType,
      'WorkLocationType',
    );
    await seedMissingEntities(
      EmploymentType,
      EMPLOYMENT_TYPES,
      EmploymentType,
      'EmploymentType',
    );
    await seedMissingEntities(
      LanguageLevel,
      LANGUAGE_LEVELS,
      LanguageLevel,
      'LanguageLevel',
    );
    await seedMissingEntities(
      CompanySize,
      COMPANY_SIZES,
      CompanySize,
      'CompanySize',
    );
    await seedMissingEntities(
      ExperienceLevel,
      EXPERIENCE_LEVELS,
      ExperienceLevel,
      'experienceLevel',
    );
    await seedMissingEntities(EventType, EVENT_TYPE, EventType, 'EventType');

    await seedMissingEntities(
      AvailabilityStatus,
      AVAILABILITY_STATUS,
      AvailabilityStatus,
      'AvailabilityStatus',
    );

    await em.flush();
  }
}
