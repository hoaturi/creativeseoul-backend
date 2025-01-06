import { Entity, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';

@Entity()
export class Category {
  @PrimaryKey()
  public readonly id!: number;

  @Property({ unique: true })
  public readonly label!: string;

  public constructor(label: string) {
    this.label = label;
  }
}
