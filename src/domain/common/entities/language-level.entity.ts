import { Entity, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';

@Entity()
export class LanguageLevel {
  @PrimaryKey()
  public readonly id!: number;

  @Property()
  public readonly label!: string;

  @Property()
  public readonly slug!: string;

  public constructor(label: string, slug: string) {
    this.label = label;
    this.slug = slug;
  }
}
