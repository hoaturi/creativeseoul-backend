import { Entity, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';

@Entity()
export class SeniorityLevel {
  @PrimaryKey()
  public readonly id!: number;

  @Property({ unique: true })
  public readonly label!: string;

  @Property({ unique: true })
  public readonly slug!: string;
}
