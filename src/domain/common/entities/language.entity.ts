import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';

@Entity()
export class Language {
  @PrimaryKey()
  public readonly id!: number;

  @Property({ unique: true })
  public name!: string;

  @Property()
  public slug!: string;

  public constructor(name: string, slug: string) {
    this.name = name;
    this.slug = slug;
  }
}
