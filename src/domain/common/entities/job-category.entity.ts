import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';

@Entity()
export class JobCategory {
  @PrimaryKey()
  public readonly id!: number;

  @Property()
  public name!: string;

  @Property()
  public slug!: string;

  public constructor(name: string, slug: string) {
    this.name = name;
    this.slug = slug;
  }
}
