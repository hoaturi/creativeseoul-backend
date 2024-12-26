import { BaseEntity } from '../base.entity';
import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';
import { Professional } from './professional.entity';

@Entity()
export class ProfessionalExperience extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @ManyToOne(() => Professional, {
    deleteRule: 'cascade',
  })
  public professional!: Professional;

  @Property({ length: 64 })
  public title!: string;

  @Property({ type: 'real' })
  public yearsOfExperience!: number;

  @Property({ length: 512 })
  public description!: string;

  public constructor(
    title: string,
    yearsOfExperience: number,
    description: string,
  ) {
    super();
    this.title = title;
    this.yearsOfExperience = yearsOfExperience;
    this.description = description;
  }
}
