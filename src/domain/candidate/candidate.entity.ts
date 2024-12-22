import { BaseEntity } from '../base.entity';
import { Entity, Index, PrimaryKey } from '@mikro-orm/core';
import {
  Collection,
  Enum,
  ManyToMany,
  OneToOne,
  Property,
} from '@mikro-orm/postgresql';
import {
  EMPLOYMENT_TYPES,
  HOURLY_RATE,
  LOCATION_TYPES,
  SALARY_RANGE,
  SENIORITY_LEVELS,
} from '../common/constants';
import { Category } from '../common/entities/job-category.entity';
import { Member } from '../member/member.entity';

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => Member)
  public member!: Member;

  @Property()
  @Index()
  public isOpenToWork!: boolean;

  @Property({ nullable: true })
  @Enum(() => SENIORITY_LEVELS.map((s) => s.slug))
  @Index()
  public seniority?: string;

  @Property({ nullable: true })
  @Enum(() => SALARY_RANGE.map((r) => r.slug))
  @Index()
  public salaryRange?: string;

  @Property({ nullable: true })
  @Enum(() => HOURLY_RATE.map((r) => r.slug))
  @Index()
  public hourlyRateRange?: string;

  @Property({ type: 'array', nullable: true })
  @Enum(() => LOCATION_TYPES.map((t) => t.slug))
  @Index()
  public locationTypes: string[];

  @Property({ type: 'array', nullable: true })
  @Enum(() => EMPLOYMENT_TYPES.map((t) => t.slug))
  @Index()
  public employmentTypes: string[];

  @Property({ nullable: true })
  public resumeUrl?: string;

  @Property()
  public isContactable!: boolean;

  @Property({ nullable: true })
  public email?: string;

  @Property({ nullable: true })
  public phone?: string;

  @ManyToMany(() => Category)
  public categories = new Collection<Category>(this);

  @Property()
  public readonly isPublic!: boolean;

  public constructor(
    isOpenToWork: boolean,
    isContactable: boolean,
    isPublic: boolean,
    seniority?: string,
    salaryRange?: string,
    hourlyRateRange?: string,
    locationTypes?: string[],
    employmentTypes?: string[],
    resumeUrl?: string,
    email?: string,
    phone?: string,
  ) {
    super();
    this.isOpenToWork = isOpenToWork;
    this.isContactable = isContactable;
    this.isPublic = isPublic;
    this.seniority = seniority;
    this.salaryRange = salaryRange;
    this.hourlyRateRange = hourlyRateRange;
    this.locationTypes = locationTypes;
    this.employmentTypes = employmentTypes;
    this.resumeUrl = resumeUrl;
    this.email = email;
    this.phone = phone;
  }
}
