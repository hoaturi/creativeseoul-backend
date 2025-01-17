import { BaseEntity } from '../../base.entity';
import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import {
  FullTextType,
  Index,
  Property,
  WeightedFullTextValue,
} from '@mikro-orm/postgresql';
import { Company } from '../../company/entities/company.entity';
import { Category } from './category.entity';
import { EmploymentType } from '../../common/entities/employment-type.entity';
import { SeniorityLevel } from './seniority-level.entity';
import { WorkLocationType } from '../../common/entities/work-location-type.entity';
import { LanguageLevel } from '../../common/entities/language-level.entity';

const generateSearchVector = (job: Job): WeightedFullTextValue => ({
  A: [job.title].filter(Boolean).join(' '),
  B: [job.tags?.join(' '), job.company.name].filter(Boolean).join(' '),
  C: [job.description, job.location].filter(Boolean).join(' '),
});

@Entity()
export class Job extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @Property({ unique: true })
  public readonly slug: string;

  // Basic Info
  @Property({ length: 64 })
  public title: string;

  @Property()
  public description: string;

  @ManyToOne(() => Company)
  public company: Company;

  // Job Details
  @ManyToOne(() => Category)
  public category: Category;

  @ManyToOne(() => EmploymentType)
  public employmentType: EmploymentType;

  @ManyToOne(() => SeniorityLevel)
  public seniorityLevel: SeniorityLevel;

  @ManyToOne(() => WorkLocationType)
  public workLocationType: WorkLocationType;

  @Property({ length: 64 })
  public location: string;

  // Compensation
  @Property({ nullable: true })
  public minSalary?: number;

  @Property({ nullable: true })
  public maxSalary?: number;

  // Requirements
  @Property({ type: 'array', nullable: true })
  public tags?: string[];

  @ManyToOne(() => LanguageLevel)
  public koreanLevel: LanguageLevel;

  @ManyToOne(() => LanguageLevel)
  public englishLevel: LanguageLevel;

  @Property()
  @Index()
  public residentOnly: boolean;

  // Application
  @Property()
  public applicationUrl: string;

  // Status
  @Property()
  @Index()
  public isPublished: boolean;

  @Property()
  @Index()
  public isFeatured: boolean;

  @Property()
  public applicationClickCount: number;

  // Search
  @Index({ type: 'fulltext' })
  @Property({
    type: new FullTextType('english'),
    onCreate: (job: Job) => generateSearchVector(job),
    onUpdate: (job: Job) => generateSearchVector(job),
  })
  public searchVector!: WeightedFullTextValue;

  public constructor(data: {
    company: Company;
    slug: string;
    title: string;
    description: string;
    category: Category;
    employmentType: EmploymentType;
    seniorityLevel: SeniorityLevel;
    workLocationType: WorkLocationType;
    location: string;
    minSalary?: number;
    maxSalary?: number;
    tags?: string[];
    koreanLevel: LanguageLevel;
    englishLevel: LanguageLevel;
    residentOnly: boolean;
    applicationUrl: string;
    isPublished: boolean;
    isFeatured: boolean;
    applicationClickCount: number;
  }) {
    super();
    this.company = data.company;
    this.slug = data.slug;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.employmentType = data.employmentType;
    this.seniorityLevel = data.seniorityLevel;
    this.workLocationType = data.workLocationType;
    this.location = data.location;
    this.minSalary = data.minSalary;
    this.maxSalary = data.maxSalary;
    this.tags = data.tags;
    this.koreanLevel = data.koreanLevel;
    this.englishLevel = data.englishLevel;
    this.residentOnly = data.residentOnly;
    this.applicationUrl = data.applicationUrl;
    this.isPublished = data.isPublished;
    this.isFeatured = data.isFeatured;
    this.applicationClickCount = data.applicationClickCount;
  }
}
