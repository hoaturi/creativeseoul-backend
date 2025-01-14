import { Country } from './country.entity';
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['label', 'country'] })
export class City {
  @PrimaryKey()
  public readonly id!: number;

  @Property({ length: 32, unique: true })
  public readonly label: string;

  @Property({ length: 32, unique: true })
  public readonly slug: string;

  @ManyToOne(() => Country)
  public readonly country: Country;

  public constructor(label: string, slug: string, country: Country) {
    this.label = label;
    this.slug = slug;
    this.country = country;
  }
}
