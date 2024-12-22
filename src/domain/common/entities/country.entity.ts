import { Entity, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';

@Entity()
export class Country {
  @PrimaryKey()
  public readonly id: number;

  @Property({ unique: true })
  public readonly name: string;

  @Property({ unique: true })
  public readonly slug: string;

  public constructor(name: string, slug: string) {
    this.name = name;
    this.slug = slug;
  }
}
