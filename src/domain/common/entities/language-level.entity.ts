import { Entity, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';

@Entity()
export class LanguageLevel {
  @PrimaryKey()
  public readonly id: number;

  @Property({ unique: true })
  public readonly label: string;

  @Property({ unique: true })
  public readonly slug: string;

  public constructor(id: number, label: string, slug: string) {
    this.id = id;
    this.label = label;
    this.slug = slug;
  }
}
