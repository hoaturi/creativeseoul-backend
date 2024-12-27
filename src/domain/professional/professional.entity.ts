import { Cascade, Entity, Index, PrimaryKey } from '@mikro-orm/core';
import {
  Collection,
  FullTextType,
  OneToMany,
  OneToOne,
  Property,
  WeightedFullTextValue,
} from '@mikro-orm/postgresql';
import { ProfessionalExperience } from './professional-experience.entity';
import { ProfessionalProject } from './professional-project.entity';
import { Member } from '../member/member.entity';
import { BaseEntity } from '../base.entity';

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
  @Index()
  public salaryRangeId?: number;

  @Property({ nullable: true })
  @Index()
  public hourlyRateRangeId?: number;

  @Property({ type: 'array' })
  @Index()
  public locationTypeIds: number[];

  @Property({ type: 'array' })
  @Index()
  public employmentTypeIds: number[];

  @OneToMany(() => ProfessionalExperience, (e) => e.professional, {
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  public readonly experiences: Collection<ProfessionalExperience> =
    new Collection<ProfessionalExperience>(this);

  @OneToMany(() => ProfessionalProject, (p) => p.professional, {
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  public readonly projects: Collection<ProfessionalProject> =
    new Collection<ProfessionalProject>(this);

  @Property({ type: 'array', nullable: true })
  public skills?: string[];

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
    data: {
      isPublic: boolean;
      isOpenToWork: boolean;
      isContactable: boolean;
      locationTypeIds: number[];
      employmentTypeIds: number[];
      salaryRangeId?: number;
      hourlyRateRangeId?: number;
      skills?: string[];
      resumeUrl?: string;
      email?: string;
      phone?: string;
    },
  ) {
    super();
    Object.assign(this, { member, ...data });
  }
}
