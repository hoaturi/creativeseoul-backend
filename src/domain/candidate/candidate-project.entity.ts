import { Cascade, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Property } from '@mikro-orm/postgresql';
import { Candidate } from './candidate.entity';

@Entity()
export class CandidateProject extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @ManyToOne(() => Candidate, {
    cascade: [Cascade.REMOVE],
  })
  public candidate!: Candidate;

  @Property({ length: 64 })
  public title!: string;

  @Property({ length: 512 })
  public description!: string;

  @Property()
  public url!: string;

  public constructor(title: string, description: string, url: string) {
    super();
    this.title = title;
    this.description = description;
    this.url = url;
  }
}
