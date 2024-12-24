import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  COUNTRIES,
  EMPLOYMENT_TYPES,
  LANGUAGES,
  LOCATION_TYPES,
} from '../../domain/common/constants';
import { EmploymentType } from '../../domain/common/entities/employment-type.entity';
import { Language } from '../../domain/common/entities/language.entity';
import { WorkLocationType } from '../../domain/common/entities/work-location-type.entity';
import { Country } from '../../domain/common/entities/country.entity';

export class BaseSeeder extends Seeder {
  public async run(em: EntityManager): Promise<void> {
    async function seedMissingEntities<T>(
      entityClass: new (...args: any[]) => T,
      data: ReadonlyArray<{ readonly name: string; readonly slug: string }>,
      constructor: new (name: string, slug: string) => T,
      entityName: string,
    ) {
      let added = 0;
      for (const item of data) {
        const existing = await em.findOne(entityClass, { slug: item.slug });
        if (!existing) {
          em.create(entityClass, new constructor(item.name, item.slug));
          added++;
        }
      }
      console.log(`${entityName}: ${added} new records added`);
    }

    await seedMissingEntities(
      EmploymentType,
      EMPLOYMENT_TYPES,
      EmploymentType,
      'Employment Types',
    );
    await seedMissingEntities(Language, LANGUAGES, Language, 'Languages');
    await seedMissingEntities(
      WorkLocationType,
      LOCATION_TYPES,
      WorkLocationType,
      'Work Location Types',
    );
    await seedMissingEntities(Country, COUNTRIES, Country, 'Countries');

    await em.flush();
  }
}
