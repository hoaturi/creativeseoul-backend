import { BaseEntity } from '../base.entity';
import { Cascade, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';
import { Candidate } from './candidate.entity';

@Entity()
export class CandidateExperience extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @ManyToOne(() => Candidate, {
    cascade: [Cascade.REMOVE],
  })
  public candidate!: Candidate;

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
