import { Country } from './country.entity';
import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['name', 'country'] })
export class City {
  @PrimaryKey()
  public readonly id: number;

  @Property({ length: 32 })
  public readonly name: string;

  @Property({ length: 32 })
  @Index()
  public readonly slug: string;

  @ManyToOne(() => Country)
  public readonly country: Country;

  public constructor(name: string, slug: string, country: Country) {
    this.name = name;
    this.slug = slug;
    this.country = country;
  }
}
