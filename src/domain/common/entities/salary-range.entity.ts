import { Entity, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';

@Entity()
export class SalaryRange {
  @PrimaryKey()
  public readonly id!: number;

  @Property({ unique: true })
  public readonly label!: string;

  @Property({ unique: true })
  public readonly slug!: string;

  public constructor(label: string, slug: string) {
    this.label = label;
    this.slug = slug;
  }
}
