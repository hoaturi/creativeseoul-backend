import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';

@Entity()
export class Language {
  @PrimaryKey()
  public readonly id!: number;

  @Property({ unique: true })
  public label!: string;

  public constructor(label: string) {
    this.label = label;
  }
}
