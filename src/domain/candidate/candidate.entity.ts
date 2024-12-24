import { BaseEntity } from '../base.entity';
import { Entity, Index, PrimaryKey } from '@mikro-orm/core';
import {
  Collection,
  Enum,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/postgresql';
import {
  EMPLOYMENT_TYPES,
  HOURLY_RATE,
  LOCATION_TYPES,
  SALARY_RANGE,
} from '../common/constants';
import { User } from '../user/user.entity';
import { CandidateExperience } from './candidate-experience.entity';
import { CandidateProject } from './candidate-project.entity';

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => User)
  public user!: User;

  @Property()
  @Index()
  public isOpenToWork!: boolean;

  @Property()
  public isPublic!: boolean;

  @Property({ nullable: true })
  @Enum(() => SALARY_RANGE.map((r) => r.slug))
  @Index()
  public salaryRange?: string;

  @Property({ nullable: true })
  @Enum(() => HOURLY_RATE.map((r) => r.slug))
  @Index()
  public hourlyRateRange?: string;

  @Property({ type: 'array' })
  @Enum(() => LOCATION_TYPES.map((t) => t.slug))
  @Index()
  public locationTypes: string[];

  @Property({ type: 'array' })
  @Enum(() => EMPLOYMENT_TYPES.map((t) => t.slug))
  @Index()
  public employmentTypes: string[];

  @OneToMany(() => CandidateExperience, (e) => e.candidate, {
    orphanRemoval: true,
  })
  public readonly experiences: Collection<CandidateExperience> =
    new Collection<CandidateExperience>(this);

  @OneToMany(() => CandidateProject, (p) => p.candidate, {
    orphanRemoval: true,
  })
  public readonly projects: Collection<CandidateProject> =
    new Collection<CandidateProject>(this);

  @Property({ type: 'array', nullable: true })
  public skills: string[];

  @Property({ nullable: true })
  public resumeUrl?: string;

  @Property()
  public isContactable!: boolean;

  @Property({ nullable: true })
  public email?: string;

  @Property({ nullable: true })
  public phone?: string;

  public constructor(
    user: User,
    isOpenToWork: boolean,
    isContactable: boolean,
    isPublic: boolean,
    salaryRange?: string,
    hourlyRateRange?: string,
    locationTypes?: string[],
    employmentTypes?: string[],
    skills?: string[],
    resumeUrl?: string,
    email?: string,
    phone?: string,
  ) {
    super();
    this.user = user;
    this.isOpenToWork = isOpenToWork;
    this.isContactable = isContactable;
    this.isPublic = isPublic;
    this.salaryRange = salaryRange;
    this.hourlyRateRange = hourlyRateRange;
    this.locationTypes = locationTypes;
    this.employmentTypes = employmentTypes;
    this.skills = skills;
    this.resumeUrl = resumeUrl;
    this.email = email;
    this.phone = phone;
  }
}
