import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { COUNTRIES, LANGUAGES } from '../../domain/common/constants';
import { Language } from '../../domain/common/entities/language.entity';
import { Country } from '../../domain/common/entities/country.entity';
import { CATEGORIES } from '../../domain/common/constants/category.constant';
import { Category } from '../../domain/common/entities/category.entity';

export class BaseSeeder extends Seeder {
  public async run(em: EntityManager): Promise<void> {
    async function seedMissingEntities<T>(
      entityClass: new (...args: any[]) => T,
      data: ReadonlyArray<{ readonly label: string }>,
      constructor: new (label: string) => T,
      entityName: string,
    ) {
      let added = 0;
      for (const item of data) {
        const existing = await em.findOne(entityClass, { label: item.label });
        if (!existing) {
          em.create(entityClass, new constructor(item.label));
          added++;
        }
      }
      console.log(`${entityName}: ${added} new records added`);
    }

    await seedMissingEntities(Language, LANGUAGES, Language, 'Languages');

    await seedMissingEntities(Country, COUNTRIES, Country, 'Countries');

    await seedMissingEntities(Category, CATEGORIES, Category, 'Categories');

    await em.flush();
  }
}
