import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';

@Entity()
export class Language {
  @PrimaryKey()
  public readonly id!: number;

  @Property({ unique: true })
  public label!: string;

  @Property({ unique: true })
  public slug!: string;

  public constructor(label: string, slug: string) {
    this.label = label;
    this.slug = slug;
  }
}
