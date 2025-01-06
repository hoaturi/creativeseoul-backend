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
  public readonly id: number;

  @Property({ length: 32 })
  public readonly label: string;

  @ManyToOne(() => Country)
  public readonly country: Country;

  public constructor(label: string, country: Country) {
    this.label = label;
    this.country = country;
  }
}
