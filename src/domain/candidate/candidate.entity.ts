import { BaseEntity } from '../base.entity';
import { Entity, Index, PrimaryKey } from '@mikro-orm/core';
import {
  Collection,
  Enum,
  FullTextType,
  OneToMany,
  OneToOne,
  Property,
  WeightedFullTextValue,
} from '@mikro-orm/postgresql';
import {
  EMPLOYMENT_TYPES,
  HOURLY_RATE_RANGE,
  LOCATION_TYPES,
  SALARY_RANGE,
} from '../common/constants';
import { CandidateExperience } from './candidate-experience.entity';
import { CandidateProject } from './candidate-project.entity';
import { Member } from '../member/member.entity';

const generateSearchVector = (candidate: Candidate): WeightedFullTextValue => ({
  A: [candidate.skills?.join(' ')].filter(Boolean).join(' '),

  B: [
    ...[...candidate.experiences].map((exp) => exp.title),
    ...[...candidate.projects].map((project) => project.title),
  ]
    .filter(Boolean)
    .join(' '),
});

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => Member, (member) => member.candidate, {
    owner: true,
    deleteRule: 'cascade',
  })
  public readonly member!: Member;

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
  @Enum(() => HOURLY_RATE_RANGE.map((r) => r.slug))
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

  @Index({ type: 'fulltext' })
  @Property({
    type: new FullTextType('english'),
    onCreate: (candidate: Candidate) => generateSearchVector(candidate),
    onUpdate: (candidate: Candidate) => generateSearchVector(candidate),
  })
  public searchVector!: WeightedFullTextValue;

  public constructor(
    member: Member,
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
    this.member = member;
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
