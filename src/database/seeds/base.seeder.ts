import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { State } from '../../domain/common/entities/state.entity';
import { JobCategory } from '../../domain/common/entities/job-category.entity';
import { EmploymentType } from '../../domain/common/entities/employment-type.entity';
import { Language } from '../../domain/common/entities/language.entity';
import { WorkLocationType } from '../../domain/common/entities/work-location-type.entity';
import {
  EMPLOYMENT_TYPES,
  JOB_CATEGORIES,
  LANGUAGES,
  STATES,
  WORK_LOCATION_TYPES,
} from '../../domain/common/constants';

export class BaseSeeder extends Seeder {
  public async run(em: EntityManager): Promise<void> {
    JOB_CATEGORIES.map((category) =>
      em.create(JobCategory, new JobCategory(category.name, category.slug)),
    );

    EMPLOYMENT_TYPES.map((type) =>
      em.create(EmploymentType, new EmploymentType(type.name, type.slug)),
    );

    LANGUAGES.map((language) =>
      em.create(Language, new Language(language.name, language.slug)),
    );

    WORK_LOCATION_TYPES.map((location) =>
      em.create(
        WorkLocationType,
        new WorkLocationType(location.name, location.slug),
      ),
    );

    STATES.map((state) => em.create(State, new State(state.name, state.slug)));

    await em.flush();
  }
}
