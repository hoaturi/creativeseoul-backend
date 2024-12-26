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
import { ProfessionalExperience } from './professional-experience.entity';
import { ProfessionalProject } from './professional-project.entity';
import { Member } from '../member/member.entity';

const generateSearchVector = (
  professional: Professional,
): WeightedFullTextValue => ({
  A: [professional.skills?.join(' ')].filter(Boolean).join(' '),

  B: [
    ...[...professional.experiences].map((exp) => exp.title),
    ...[...professional.projects].map((project) => project.title),
  ]
    .filter(Boolean)
    .join(' '),
});

@Entity()
export class Professional extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => Member, (member) => member.professional, {
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

  @OneToMany(() => ProfessionalExperience, (e) => e.candidate, {
    orphanRemoval: true,
  })
  public readonly experiences: Collection<ProfessionalExperience> =
    new Collection<ProfessionalExperience>(this);

  @OneToMany(() => ProfessionalProject, (p) => p.professional, {
    orphanRemoval: true,
  })
  public readonly projects: Collection<ProfessionalProject> =
    new Collection<ProfessionalProject>(this);

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
    onCreate: (candidate: Professional) => generateSearchVector(candidate),
    onUpdate: (candidate: Professional) => generateSearchVector(candidate),
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
